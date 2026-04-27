import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
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

    // Fetch plan + product
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
    const amount = Number(plan.price)
    const amountInCents = Math.round(amount * 100)
    const commissionAmount = (amount * commissionRate) / 100

    // Create pending order
    const orderId = crypto.randomUUID()

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
        webhook_status: 'pending',
        webhook_attempts: 0,
      })

    if (orderError) {
      console.error('[Checkout] Order creation failed:', orderError)
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
    }

    // Check if Stripe product/price exists, or create them
    let stripePriceId = plan.stripe_price_id

    if (!stripePriceId) {
      // Create product in Stripe if needed
      let stripeProductId = product.stripe_product_id

      if (!stripeProductId) {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          metadata: {
            saasnex_product_id: product.id,
            saasnex_owner_id: product.owner_id,
          },
        })
        stripeProductId = stripeProduct.id

        // Save back to DB
        await supabase
          .from('products')
          .update({ stripe_product_id: stripeProductId })
          .eq('id', product.id)
      }

      // Create price in Stripe
      const stripePrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: amountInCents,
        currency: 'brl',
        metadata: {
          saasnex_plan_id: plan.id,
        },
      })
      stripePriceId = stripePrice.id

      // Save back to DB
      await supabase
        .from('plans')
        .update({ stripe_price_id: stripePriceId })
        .eq('id', plan.id)
    }

    // Create Stripe Checkout Session
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        transfer_group: `order_${orderId}`,
      },
      metadata: {
        order_id: orderId,
        affiliate_id: affiliate_id || '',
        tracking_id: tracking_id || '',
      },
      success_url: `${origin}/checkout/success?order_id=${orderId}`,
      cancel_url: `${origin}/checkout/${plan_id}?canceled=true`,
    })

    // Update order with Stripe session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderId)

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
