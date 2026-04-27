import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DollarSign, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isProducer = profile?.role === 'producer'

  let orders: any[] = []

  if (isProducer) {
    // Producer sees all orders for their products
    const { data: myProducts } = await supabase
      .from('products')
      .select('id')
      .eq('owner_id', user.id)

    const productIds = myProducts?.map(p => p.id) || []

    if (productIds.length > 0) {
      const { data } = await supabase
        .from('orders')
        .select('*, product:products(name), plan:plans(name), affiliate:profiles(full_name)')
        .in('product_id', productIds)
        .order('created_at', { ascending: false })

      orders = data || []
    }
  } else {
    // Affiliate sees orders attributed to them
    const { data } = await supabase
      .from('orders')
      .select('*, product:products(name), plan:plans(name)')
      .eq('affiliate_id', user.id)
      .order('created_at', { ascending: false })

    orders = data || []
  }

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((acc, o) => acc + Number(o.amount), 0)
  const totalCommissions = orders.filter(o => o.status === 'paid').reduce((acc, o) => acc + Number(o.commission_amount), 0)
  const paidCount = orders.filter(o => o.status === 'paid').length
  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="w-full pb-12">
      <main className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProducer ? 'Relatório de Vendas' : 'Minhas Comissões'}
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            {isProducer ? 'Acompanhe todas as transações dos seus produtos.' : 'Veja todas as vendas atribuídas a você.'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {isProducer ? 'Faturamento Total' : 'Comissões Ganhas'}
              </p>
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              R$ {(isProducer ? totalRevenue : totalCommissions).toFixed(2).replace('.', ',')}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {isProducer ? 'Comissões Geradas' : 'Volume Gerado'}
              </p>
              <div className="bg-primary/10 text-primary p-2 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              R$ {(isProducer ? totalCommissions : totalRevenue).toFixed(2).replace('.', ',')}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Vendas Aprovadas</p>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{paidCount}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pendentes</p>
              <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{pendingCount}</h3>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Histórico de Transações</h3>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-900 mb-1">Nenhuma transação ainda</h4>
              <p className="text-slate-500 text-sm">
                {isProducer 
                  ? 'Quando alguém comprar seus produtos, as vendas aparecerão aqui.'
                  : 'Quando você gerar vendas com seus links, elas aparecerão aqui.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold">Cliente</th>
                    <th className="text-left px-6 py-4 font-semibold">Produto / Plano</th>
                    {isProducer && <th className="text-left px-6 py-4 font-semibold">Afiliado</th>}
                    <th className="text-right px-6 py-4 font-semibold">Valor</th>
                    <th className="text-right px-6 py-4 font-semibold">Comissão</th>
                    <th className="text-center px-6 py-4 font-semibold">Status</th>
                    <th className="text-right px-6 py-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{order.customer_name}</p>
                          <p className="text-xs text-slate-500">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{order.product?.name || '—'}</p>
                        <p className="text-xs text-slate-500">{order.plan?.name || '—'}</p>
                      </td>
                      {isProducer && (
                        <td className="px-6 py-4">
                          <span className="text-slate-700">{order.affiliate?.full_name || '—'}</span>
                          {order.tracking_id && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{order.tracking_id}</p>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        R$ {Number(order.amount).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        R$ {Number(order.commission_amount).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Pago
                          </span>
                        ) : order.status === 'refunded' ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle className="w-3 h-3" /> Reembolsado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
