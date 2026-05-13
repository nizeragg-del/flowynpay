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
      .select('stripe_account_id, stripe_onboarding_complete')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ connected: false })
    }

    if (!profile.stripe_account_id) {
      return NextResponse.json({ connected: false })
    }

    // Optional: Verify with Stripe if onboarding is actually complete
    // For performance, we trust the database flag, but we can verify here if needed
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)
    
    const onboardingComplete = account.details_submitted && account.charges_enabled

    return NextResponse.json({ 
      connected: true,
      onboarding_complete: onboardingComplete,
      account_id: profile.stripe_account_id,
      email: account.email
    })

  } catch (error: any) {
    console.error('[Stripe Status Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
