import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { createLoginLink } from '@/lib/stripe'

export async function POST() {
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
      throw new Error('Conta Stripe não encontrada')
    }

    const loginLink = await createLoginLink(profile.stripe_account_id)

    return NextResponse.json({ url: loginLink.url })

  } catch (error: any) {
    console.error('[Stripe Dashboard Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
