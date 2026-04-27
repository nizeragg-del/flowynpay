import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Link2, TrendingUp, DollarSign, Store, ExternalLink, Copy } from 'lucide-react'

export default async function AffiliationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'affiliate') {
    redirect('/dashboard')
  }

  const { data: affiliations } = await supabase
    .from('affiliations')
    .select(`
      id,
      tracking_id,
      status,
      created_at,
      product:products(
        id,
        name,
        logo_url,
        commission_rate,
        plans(id, name, price)
      )
    `)
    .eq('affiliate_id', user.id)
    .order('created_at', { ascending: false })

  // Get order stats per product
  const { data: orders } = await supabase
    .from('orders')
    .select('product_id, amount, commission_amount, status')
    .eq('affiliate_id', user.id)

  const ordersByProduct: Record<string, { sales: number; commission: number }> = {}
  orders?.forEach(o => {
    if (o.status === 'paid') {
      if (!ordersByProduct[o.product_id]) ordersByProduct[o.product_id] = { sales: 0, commission: 0 }
      ordersByProduct[o.product_id].sales += Number(o.amount)
      ordersByProduct[o.product_id].commission += Number(o.commission_amount)
    }
  })

  return (
    <div className="w-full pb-12">
      <main className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Minhas Afiliações</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gerencie seus links de divulgação e acompanhe suas vendas por produto.</p>
          </div>
          <Link href="/market" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm">
            <Store className="w-4 h-4" />
            Encontrar Produtos
          </Link>
        </div>

        {!affiliations || affiliations.length === 0 ? (
          <div className="text-center py-24">
            <Link2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma afiliação ainda</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Visite o Marketplace para encontrar produtos de alta conversão e começar a ganhar comissões recorrentes.
            </p>
            <Link href="/market" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-sm">
              Ir para o Mercado
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {affiliations.map((aff) => {
              const product = aff.product as any
              const stats = ordersByProduct[product.id] || { sales: 0, commission: 0 }
              const plans = product.plans as any[] || []
              const minPrice = plans.length > 0 ? Math.min(...plans.map((p: any) => Number(p.price))) : null

              // Use localhost for now, will be the real domain later
              const checkoutBase = `http://localhost:3000`
              const affiliateLinks = plans.map((pl: any) => ({
                planName: pl.name,
                url: `${checkoutBase}/checkout/${pl.id}?ref=${aff.tracking_id}`
              }))

              return (
                <div key={aff.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* Product Header */}
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                      {product.logo_url ? (
                        <img src={product.logo_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                          <span className="font-extrabold text-white text-xl">{product.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${aff.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {aff.status === 'active' ? '● Ativo' : '● Inativo'}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 flex-1">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Comissão</p>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-extrabold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {product.commission_rate}%
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Vendas Geradas</p>
                        <span className="text-sm font-bold text-slate-900">
                          R$ {stats.sales.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Comissões Ganhas</p>
                        <span className="text-sm font-extrabold text-primary">
                          R$ {stats.commission.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-slate-500 font-medium mb-1">Desde</p>
                        <span className="text-sm text-slate-700 font-medium">
                          {new Date(aff.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Links */}
                  <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Seus Links de Divulgação</p>
                    {affiliateLinks.length === 0 ? (
                      <p className="text-sm text-slate-400">Nenhum plano configurado pelo produtor ainda.</p>
                    ) : (
                      <div className="space-y-2">
                        {affiliateLinks.map((link: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                            <span className="text-xs font-bold text-slate-500 w-24 flex-shrink-0">{link.planName}</span>
                            <code className="flex-1 text-xs text-slate-600 font-mono truncate">{link.url}</code>
                            <a href={link.url} target="_blank" className="p-1.5 hover:bg-primary/5 rounded-lg transition-colors" title="Abrir checkout">
                              <ExternalLink className="w-3.5 h-3.5 text-primary" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
