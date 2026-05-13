import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (error || !profile?.stripe_account_id) {
      return NextResponse.json({ balance: 0, pending: 0 })
    }

    const balance = await stripe.balance.retrieve({}, {
      stripeAccount: profile.stripe_account_id,
    })

    // Stripe returns amounts in cents. Sum available and pending.
    const available = balance.available.reduce((acc, curr) => acc + curr.amount, 0) / 100
    const pending = balance.pending.reduce((acc, curr) => acc + curr.amount, 0) / 100

    return NextResponse.json({ 
      available, 
      pending,
      currency: balance.available[0]?.currency.toUpperCase() || 'BRL'
    })

  } catch (error: any) {
    console.error('[Stripe Balance Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
