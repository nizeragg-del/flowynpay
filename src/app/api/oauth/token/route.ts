import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { client_id, client_secret, code } = body

    if (!client_id || !client_secret || !code) {
      return NextResponse.json({ error: 'invalid_request', error_description: 'Missing required parameters' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Validate Client ID and Secret
    const { data: app, error: appError } = await supabase
      .from('oauth_applications')
      .select('id')
      .eq('client_id', client_id)
      .eq('client_secret', client_secret)
      .single()

    if (appError || !app) {
      return NextResponse.json({ error: 'invalid_client', error_description: 'Client authentication failed' }, { status: 401 })
    }

    // 2. Validate Authorization Code
    const { data: authCode, error: codeError } = await supabase
      .from('oauth_authorization_codes')
      .select('*')
      .eq('code', code)
      .eq('client_id', client_id)
      .eq('used', false)
      .single()

    if (codeError || !authCode) {
      return NextResponse.json({ error: 'invalid_grant', error_description: 'Invalid or expired authorization code' }, { status: 400 })
    }

    // Check expiration (expires_at is TIMESTAMPTZ)
    if (new Date(authCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'invalid_grant', error_description: 'Authorization code expired' }, { status: 400 })
    }

    // 3. Mark code as used
    await supabase
      .from('oauth_authorization_codes')
      .update({ used: true })
      .eq('id', authCode.id)

    // 4. Generate Access Token
    const token = crypto.randomBytes(32).toString('hex')

    const { error: tokenError } = await supabase
      .from('oauth_access_tokens')
      .insert({
        token,
        client_id,
        customer_user_id: authCode.customer_user_id,
        order_id: authCode.order_id
      })

    if (tokenError) {
      console.error('Error creating access token', tokenError)
      return NextResponse.json({ error: 'server_error', error_description: 'Failed to generate access token' }, { status: 500 })
    }

    return NextResponse.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 2592000, // 30 days in seconds
    })
  } catch (err) {
    return NextResponse.json({ error: 'server_error', error_description: 'Internal Server Error' }, { status: 500 })
  }
}
