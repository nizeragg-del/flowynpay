import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, PLATFORM_FEE_PERCENT, PLATFORM_FEE_FIXED } from '@/lib/stripe'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  console.log('[Checkout] Início da requisição POST (Stripe)')
  try {
    const body = await request.json()
    const { plan_id, customer_name, customer_email, affiliate_id, tracking_id } = body

    if (!plan_id || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: plan_id, customer_name, customer_email' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()

    // 1. Buscar plano + produto + produtor
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*, product:products(id, name, commission_rate, webhook_url, owner_id)')
      .eq('id', plan_id)
      .single()

    if (planError || !plan) {
      console.error('[Checkout] Plan fetch failed:', planError)
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    const product = plan.product as any
    const commissionRate = Number(product.commission_rate)
    const amount = Number(plan.price) // Valor em Reais (ex: 97.00)
    const amountInCents = Math.round(amount * 100)
    
    // 2. Criar pedido pendente no banco
    const orderId = crypto.randomUUID()
    const commissionAmount = affiliate_id ? (amount * commissionRate) / 100 : 0

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        product_id: product.id,
        plan_id: plan.id,
        affiliate_id: affiliate_id || null,
        customer_name,
        customer_email,
        amount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        status: 'pending',
        tracking_id: tracking_id || null,
      })

    if (orderError) {
      console.error('[Checkout] Order creation failed:', orderError)
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
    }

    // 3. Criar Sessão de Checkout do Stripe
    // Usamos metadata para passar informações de split para o webhook
    const origin = new URL(request.url).origin
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${product.name} - ${plan.name}`,
              metadata: {
                product_id: product.id,
                plan_id: plan.id,
              }
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/${plan.id}`,
      customer_email: customer_email,
      metadata: {
        order_id: orderId,
        producer_id: product.owner_id,
        affiliate_id: affiliate_id || '',
        commission_rate: commissionRate.toString(),
      },
    })

    // 4. Atualizar pedido com ID da sessão
    await supabase
      .from('orders')
      .update({ 
        stripe_payment_id: session.id, // Armazenamos o Session ID aqui temporariamente
      })
      .eq('id', orderId)

    console.log('[Checkout] Sessão Stripe criada:', session.id)
    return NextResponse.json({
      success: true,
      order_id: orderId,
      checkout_url: session.url,
    })

  } catch (err: any) {
    console.error('[Checkout] Unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Erro interno do servidor' }, { status: 500 })
  }
}
