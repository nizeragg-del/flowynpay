import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    let accountId = profile.stripe_account_id

    // Create a Stripe Connected Account if one doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'BR',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          saasnex_user_id: user.id,
          saasnex_role: profile.role,
        },
      })

      accountId = account.id

      // Save the Stripe account ID
      await supabase
        .from('profiles')
        .update({
          stripe_account_id: accountId,
          stripe_account_status: 'pending',
        })
        .eq('id', user.id)
    }

    // Generate an Account Link for onboarding
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/settings/payments?refresh=true`,
      return_url: `${origin}/dashboard/settings/payments?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })

  } catch (err: any) {
    console.error('[Stripe Connect] Error:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}

// GET: Check account status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_account_id, stripe_account_status, stripe_onboarding_complete')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_account_id) {
      return NextResponse.json({
        connected: false,
        status: 'not_connected',
        onboarding_complete: false,
      })
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)

    const isComplete = account.charges_enabled && account.payouts_enabled
    const status = isComplete ? 'active' : 'pending'

    // Update local status if changed
    if (status !== profile.stripe_account_status || isComplete !== profile.stripe_onboarding_complete) {
      await supabase
        .from('profiles')
        .update({
          stripe_account_status: status,
          stripe_onboarding_complete: isComplete,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      connected: true,
      status,
      onboarding_complete: isComplete,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    })

  } catch (err: any) {
    console.error('[Stripe Connect] Status check error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
