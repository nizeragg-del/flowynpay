import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()

  const client_id = formData.get('client_id') as string
  const redirect_uri = formData.get('redirect_uri') as string
  const state = formData.get('state') as string
  const order_id = formData.get('order_id') as string

  if (!client_id || !redirect_uri || !order_id) {
    return NextResponse.redirect(new URL(`/oauth/authorize?error=Parâmetros inválidos`, request.url))
  }

  // Double check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL(`/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`, request.url))
  }

  // Generate an authorization code
  // In Supabase, the default for 'code' is gen_random_bytes, but we can generate one here and insert it
  const code = crypto.randomBytes(16).toString('hex')

  const { error: insertError } = await supabase
    .from('oauth_authorization_codes')
    .insert({
      code,
      client_id,
      customer_user_id: user.id,
      order_id
    })

  if (insertError) {
    console.error('Error generating authorization code:', insertError)
    return NextResponse.redirect(new URL(`/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&error=Erro interno ao gerar autorização`, request.url))
  }

  // Redirect back to the SaaS with the code
  const redirectUrl = new URL(redirect_uri)
  redirectUrl.searchParams.append('code', code)
  if (state) {
    redirectUrl.searchParams.append('state', state)
  }

  return NextResponse.redirect(redirectUrl.toString())
}
