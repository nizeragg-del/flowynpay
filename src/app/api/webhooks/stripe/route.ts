import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, calculateSplit } from '@/lib/stripe'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
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

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = session.metadata

    console.log('[Webhook] Checkout concluído:', session.id)

    const orderId = metadata.order_id
    const producerId = metadata.producer_id
    const affiliateId = metadata.affiliate_id
    const commissionRate = Number(metadata.commission_rate || 0)
    const amountInCents = session.amount_total

    // 1. Calcular Splits
    const { platformFee, affiliateShare, producerShare } = calculateSplit(amountInCents, commissionRate)

    try {
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
      // Transferência para o Produtor
      if (producerProfile?.stripe_account_id) {
        await stripe.transfers.create({
          amount: producerShare,
          currency: 'brl',
          destination: producerProfile.stripe_account_id,
          transfer_group: orderId,
          metadata: { order_id: orderId, type: 'producer_payout' }
        })
      }

      // Transferência para o Afiliado (se houver)
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

      // 5. Disparar Webhook Externo do Produtor
      // (Buscamos o produto para pegar a URL do webhook)
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, product:products(webhook_url)')
        .eq('id', orderId)
        .single()

      if (orderData?.product?.webhook_url) {
        console.log('[Webhook] Disparando webhook externo para:', orderData.product.webhook_url)
        // Lógica simplificada de disparo (idealmente seria uma fila)
        fetch(orderData.product.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'purchase.completed',
            data: orderData
          })
        }).catch(err => console.error('[External Webhook Error]:', err))
      }

    } catch (dbError: any) {
      console.error('[Webhook DB/Stripe Error]:', dbError)
      return new Response(`Error: ${dbError.message}`, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
