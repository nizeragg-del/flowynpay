import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'invalid_token', error_description: 'Missing or invalid Bearer token' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = await createClient()

    // 1. Verify the access token
    const { data: accessToken, error: tokenError } = await supabase
      .from('oauth_access_tokens')
      .select('customer_user_id, order_id, expires_at')
      .eq('token', token)
      .single()

    if (tokenError || !accessToken) {
      return NextResponse.json({ error: 'invalid_token', error_description: 'Invalid access token' }, { status: 401 })
    }

    if (new Date(accessToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'invalid_token', error_description: 'Access token expired' }, { status: 401 })
    }

    // 2. We need admin rights to get the user email directly from auth.users (unless we have it in public.users)
    // Wait, the regular createClient() uses anon or current session. Since this is an API call, it has no session.
    // So `accessToken.customer_user_id` is just the UUID. We can get the order details which contains customer_email and customer_name.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('product_id, customer_email, customer_name, status, plans(id, name, plan_identifier)')
      .eq('id', accessToken.order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'invalid_token', error_description: 'Associated order not found' }, { status: 401 })
    }

    // 3. Return standard UserInfo response
    return NextResponse.json({
      sub: accessToken.customer_user_id,
      email: order.customer_email,
      name: order.customer_name,
      purchase: {
        product_id: order.product_id,
        plan_id: (order.plans as any)?.id,
        plan_name: (order.plans as any)?.name,
        plan_identifier: (order.plans as any)?.plan_identifier,
        status: order.status
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'server_error', error_description: 'Internal Server Error' }, { status: 500 })
  }
}
