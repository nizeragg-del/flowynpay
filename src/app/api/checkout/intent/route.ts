import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      plan_id,
      customer_name,
      customer_email,
      affiliate_id,
      tracking_id,
      add_order_bump,
      // If we already have a paymentIntentId, we can update the amount
      payment_intent_id,
    } = body

    if (!plan_id || !customer_email) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // 1. Fetch plan + product
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select(`
        *,
        product:products(
          id, name, commission_rate, owner_id, is_flowyn_saas,
          order_bump_title, order_bump_description, order_bump_price, order_bump_discount_percent
        )
      `)
      .eq('id', plan_id)
      .single()

    if (planError || !plan) {
      console.error('[Intent] Plan fetch failed:', planError)
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    const product = plan.product as any
    const isFlowynSaas = !!product.is_flowyn_saas
    const commissionRate = isFlowynSaas ? 75 : Number(product.commission_rate)

    // 2. Calculate total amount in cents
    let baseAmount = Number(plan.price)
    let orderBumpAmount = 0
    const includesOrderBump = !!(add_order_bump && product.order_bump_price)
    if (includesOrderBump) {
      const rawPrice = Number(product.order_bump_price)
      const discount = Number(product.order_bump_discount_percent || 0)
      orderBumpAmount = discount > 0 ? rawPrice * (1 - discount / 100) : rawPrice
    }
    const totalAmount = Math.round((baseAmount + orderBumpAmount) * 100) // in cents

    // 3. Create or Update PaymentIntent
    let paymentIntent: any

    if (payment_intent_id) {
      // Update existing intent (e.g., user toggled Order Bump)
      paymentIntent = await stripe.paymentIntents.update(payment_intent_id, {
        amount: totalAmount,
      })
    } else {
      // Create a new pending order in DB first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          plan_id: plan.id,
          product_id: product.id,
          customer_name: customer_name || '',
          customer_email: customer_email,
          amount: (baseAmount + orderBumpAmount),
          status: 'pending',
          commission_rate: commissionRate,
          affiliate_id: affiliate_id || null,
          tracking_id: tracking_id || null,
          includes_order_bump: includesOrderBump,
        })
        .select('id')
        .single()

      if (orderError || !order) {
        console.error('[Intent] Order creation failed:', orderError)
        return NextResponse.json({ error: 'Erro ao registrar pedido.' }, { status: 500 })
      }

      // Create Stripe PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'brl',
        automatic_payment_methods: { enabled: true },
        receipt_email: customer_email,
        metadata: {
          order_id: order.id,
          producer_id: product.owner_id,
          affiliate_id: affiliate_id || '',
          commission_rate: commissionRate.toString(),
          tracking_id: tracking_id || '',
          is_flowyn_saas: isFlowynSaas ? 'true' : 'false',
        },
      })

      // Save payment intent ID to order
      await supabase
        .from('orders')
        .update({ stripe_payment_intent_id: paymentIntent.id })
        .eq('id', order.id)
    }

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    })
  } catch (err: any) {
    console.error('[Intent] Error:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
