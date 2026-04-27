import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { retryWebhook } from '@/lib/webhook'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verify user is a producer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'producer') {
      return NextResponse.json({ error: 'Apenas produtores podem reenviar webhooks' }, { status: 403 })
    }

    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json({ error: 'order_id é obrigatório' }, { status: 400 })
    }

    // Verify the producer owns the product associated with this order
    const { data: order } = await supabase
      .from('orders')
      .select('product_id, product:products(owner_id)')
      .eq('id', order_id)
      .single()

    if (!order || (order.product as any)?.owner_id !== user.id) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const result = await retryWebhook(order_id)

    return NextResponse.json(result)

  } catch (err: any) {
    console.error('[Webhook Retry] Error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
