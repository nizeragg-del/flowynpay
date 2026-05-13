import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { stripe, createOnboardingLink } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id, email:auth.users(email)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Perfil não encontrado')
    }

    let accountId = profile.stripe_account_id

    // 2. Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'BR',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual', // Default, can be changed during onboarding
        metadata: {
          supabase_user_id: user.id,
        },
      })

      accountId = account.id

      // Save to database
      await supabase
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', user.id)
    }

    // 3. Generate onboarding link
    const origin = new URL(request.url).origin
    const returnUrl = `${origin}/dashboard/settings/payments?status=success`
    const refreshUrl = `${origin}/dashboard/settings/payments?status=refresh`

    const onboardingLink = await createOnboardingLink(accountId, returnUrl, refreshUrl)

    return NextResponse.json({ url: onboardingLink.url })

  } catch (error: any) {
    console.error('[Stripe Onboarding Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
