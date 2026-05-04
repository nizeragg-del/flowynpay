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
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isProducer ? 'Relatório de Vendas' : 'Minhas Comissões'}
          </h2>
          <p className="text-white/60 mt-1 font-medium">
            {isProducer ? 'Acompanhe todas as transações dos seus produtos.' : 'Veja todas as vendas atribuídas a você.'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#00e88a]/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e88a]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00e88a]/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                {isProducer ? 'Faturamento Total' : 'Comissões Ganhas'}
              </p>
              <div className="bg-[#00e88a]/10 text-[#00e88a] p-2 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white relative z-10">
              R$ {(isProducer ? totalRevenue : totalCommissions).toFixed(2).replace('.', ',')}
            </h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#00e88a]/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e88a]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00e88a]/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                {isProducer ? 'Comissões Geradas' : 'Volume Gerado'}
              </p>
              <div className="bg-[#00e88a]/10 text-[#00e88a] p-2 rounded-xl border border-[#00e88a]/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white relative z-10">
              R$ {(isProducer ? totalCommissions : totalRevenue).toFixed(2).replace('.', ',')}
            </h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Vendas Aprovadas</p>
              <div className="bg-blue-500/10 text-blue-400 p-2 rounded-xl border border-blue-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white relative z-10">{paidCount}</h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Pendentes</p>
              <div className="bg-amber-500/10 text-amber-400 p-2 rounded-xl border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white relative z-10">{pendingCount}</h3>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Histórico de Transações</h3>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-1">Nenhuma transação ainda</h4>
              <p className="text-white/50 text-sm">
                {isProducer 
                  ? 'Quando alguém comprar seus produtos, as vendas aparecerão aqui.'
                  : 'Quando você gerar vendas com seus links, elas aparecerão aqui.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0a0a0a] text-white/50 uppercase text-xs tracking-wider border-b border-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Cliente</th>
                    <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Produto / Plano</th>
                    {isProducer && <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Afiliado</th>}
                    <th className="text-right px-6 py-4 font-semibold whitespace-nowrap">Valor</th>
                    <th className="text-right px-6 py-4 font-semibold whitespace-nowrap">Comissão</th>
                    <th className="text-center px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="text-right px-6 py-4 font-semibold whitespace-nowrap">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-white">{order.customer_name}</p>
                          <p className="text-xs text-white/50">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-white">{order.product?.name || '—'}</p>
                        <p className="text-xs text-white/50">{order.plan?.name || '—'}</p>
                      </td>
                      {isProducer && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white/70">{order.affiliate?.full_name || '—'}</span>
                          {order.tracking_id && (
                            <p className="text-[10px] text-white/40 font-mono mt-0.5">{order.tracking_id}</p>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right font-bold text-white whitespace-nowrap">
                        R$ {Number(order.amount).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-[#00e88a] whitespace-nowrap">
                        R$ {Number(order.commission_amount).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {order.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 bg-[#00e88a]/10 text-[#00e88a] border border-[#00e88a]/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Pago
                          </span>
                        ) : order.status === 'refunded' ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle className="w-3 h-3" /> Reembolsado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-white/50 text-xs whitespace-nowrap">
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

