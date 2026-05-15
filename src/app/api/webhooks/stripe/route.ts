import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, calculateSplit } from '@/lib/stripe'
import { getResendClient } from '@/lib/resend'
import { deliveryEmail } from '@/lib/email-templates'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/**
 * Shared logic: process a completed payment.
 * Works for both PaymentIntent.succeeded (transparent checkout)
 * and checkout.session.completed (legacy hosted checkout).
 */
async function handlePaymentSuccess({
  orderId,
  producerId,
  affiliateId,
  commissionRate,
  amountInCents,
  supabase,
}: {
  orderId: string
  producerId: string
  affiliateId: string
  commissionRate: number
  amountInCents: number
  supabase: ReturnType<typeof getAdminClient>
}) {
  console.log('[Webhook] Processando pagamento para ordem:', orderId)

  // 1. Calcular Splits
  const { platformFee, affiliateShare, producerShare } = calculateSplit(amountInCents, commissionRate)

  // 2. Buscar IDs das contas Stripe Connect
  const { data: producerProfile } = await supabase
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', producerId)
    .single()

  let affiliateAccountId = null
  if (affiliateId) {
    const { data: affiliateProfile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', affiliateId)
      .single()
    affiliateAccountId = affiliateProfile?.stripe_account_id
  }

  // 3. Executar Transferências (Split)
  if (producerProfile?.stripe_account_id) {
    await stripe.transfers.create({
      amount: producerShare,
      currency: 'brl',
      destination: producerProfile.stripe_account_id,
      transfer_group: orderId,
      metadata: { order_id: orderId, type: 'producer_payout' }
    })
  }

  if (affiliateAccountId && affiliateShare > 0) {
    await stripe.transfers.create({
      amount: affiliateShare,
      currency: 'brl',
      destination: affiliateAccountId,
      transfer_group: orderId,
      metadata: { order_id: orderId, type: 'affiliate_payout' }
    })
  }

  // 4. Atualizar Ordem no Banco
  await supabase
    .from('orders')
    .update({
      status: 'paid',
      commission_amount: affiliateShare / 100,
      platform_fee: platformFee / 100,
      producer_amount: producerShare / 100,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  // 5. Buscar dados do pedido + produto para entrega
  const { data: orderData } = await supabase
    .from('orders')
    .select(`
      *,
      product:products(
        id, name, delivery_type, delivery_url, deliverable_file_paths, order_bump_file_paths, webhook_url
      )
    `)
    .eq('id', orderId)
    .single()

  if (!orderData) {
    console.error('[Webhook] Order not found after update:', orderId)
    return
  }

  const product = orderData.product as any

  // 6. Entrega Digital: enviar e-mail com arquivo ou link
  if (product?.delivery_type === 'external') {
    const accessLinks: { label: string; url: string; isFile: boolean }[] = []

    if (product.delivery_url) {
      accessLinks.push({ label: '🔓 Acessar Conteúdo', url: product.delivery_url, isFile: false })
    }

    // Arquivos do produto principal
    if (product.deliverable_file_paths && Array.isArray(product.deliverable_file_paths)) {
      for (const path of product.deliverable_file_paths) {
        console.log('[Webhook] Gerando signed URL para:', path)
        const { data: signed, error: signedError } = await supabase.storage
          .from('product-files')
          .createSignedUrl(path, 60 * 60 * 48) // 48h

        if (!signedError && signed) {
          const filename = path.split('/').pop() || 'Baixar Arquivo'
          accessLinks.push({ label: `📥 ${filename}`, url: signed.signedUrl, isFile: true })
        } else {
          console.error('[Webhook] Erro ao gerar signed URL:', signedError)
        }
      }
    }

    // Arquivos do Order Bump (se comprou)
    if (orderData.includes_order_bump && product.order_bump_file_paths && Array.isArray(product.order_bump_file_paths)) {
      for (const path of product.order_bump_file_paths) {
        console.log('[Webhook] Gerando signed URL para Order Bump:', path)
        const { data: signed, error: signedError } = await supabase.storage
          .from('product-files')
          .createSignedUrl(path, 60 * 60 * 48) // 48h

        if (!signedError && signed) {
          const filename = path.split('/').pop() || 'Baixar Order Bump'
          accessLinks.push({ label: `🎁 ${filename}`, url: signed.signedUrl, isFile: true })
        } else {
          console.error('[Webhook] Erro ao gerar signed URL para Order Bump:', signedError)
        }
      }
    }

    // Enviar e-mail transacional
    const resendClient = getResendClient()
    if (resendClient) {
      const emailResult = await resendClient.emails.send({
        from: 'Flowyn <noreply@flowyn.com.br>',
        to: orderData.customer_email,
        subject: `✅ Seu acesso a "${product.name}" está pronto!`,
        html: deliveryEmail({
          customerName: orderData.customer_name,
          productName: product.name,
          accessLinks,
        }),
      })
      console.log('[Webhook] E-mail enviado:', emailResult)
    } else {
      console.warn('[Webhook] RESEND_API_KEY não configurada — e-mail não enviado para:', orderData.customer_email)
    }
  }

  // 7. Webhook Externo do Produtor (se configurado)
  if (product?.webhook_url) {
    console.log('[Webhook] Disparando webhook externo para:', product.webhook_url)
    fetch(product.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'purchase.completed', data: orderData })
    }).catch(err => console.error('[External Webhook Error]:', err))
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`[Webhook Error]: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = getAdminClient()

  try {
    // ── Transparent Checkout (Stripe Elements / PaymentIntent) ──────────────
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const metadata = paymentIntent.metadata

      console.log('[Webhook] PaymentIntent succeeded:', paymentIntent.id)

      // Find order by payment intent ID
      const { data: order, error: orderLookupError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

      if (orderLookupError || !order) {
        // Fallback: use metadata order_id
        if (metadata?.order_id) {
          await handlePaymentSuccess({
            orderId: metadata.order_id,
            producerId: metadata.producer_id || '',
            affiliateId: metadata.affiliate_id || '',
            commissionRate: Number(metadata.commission_rate || 0),
            amountInCents: paymentIntent.amount_received,
            supabase,
          })
        } else {
          console.warn('[Webhook] PaymentIntent sem ordem no banco ou metadata:', paymentIntent.id)
        }
        return NextResponse.json({ received: true })
      }

      // Avoid duplicate processing
      if (order.status === 'paid') {
        console.log('[Webhook] Ordem já processada, ignorando:', order.id)
        return NextResponse.json({ received: true })
      }

      await handlePaymentSuccess({
        orderId: order.id,
        producerId: metadata?.producer_id || '',
        affiliateId: metadata?.affiliate_id || '',
        commissionRate: Number(metadata?.commission_rate || 0),
        amountInCents: paymentIntent.amount_received,
        supabase,
      })
    }

    // ── Legacy Hosted Checkout (checkout.session.completed) ─────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata

      console.log('[Webhook] Checkout Session concluída:', session.id)

      // Skip if this session is backed by a PaymentIntent we already handle
      if (session.payment_intent) {
        // The payment_intent.succeeded event will handle this; skip to avoid double-processing
        console.log('[Webhook] Sessão com PaymentIntent — delegando para payment_intent.succeeded')
        return NextResponse.json({ received: true })
      }

      const orderId = metadata.order_id
      if (!orderId) {
        console.warn('[Webhook] checkout.session.completed sem order_id no metadata')
        return NextResponse.json({ received: true })
      }

      await handlePaymentSuccess({
        orderId,
        producerId: metadata.producer_id || '',
        affiliateId: metadata.affiliate_id || '',
        commissionRate: Number(metadata.commission_rate || 0),
        amountInCents: session.amount_total,
        supabase,
      })
    }
  } catch (err: any) {
    console.error('[Webhook DB/Stripe Error]:', err)
    return new Response(`Error: ${err.message}`, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
