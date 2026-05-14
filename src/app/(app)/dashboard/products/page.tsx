import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PlusCircle, Box, BookOpen, FileText, Users, Layers, Globe, Lock, Eye, BarChart2, Zap } from 'lucide-react'

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  course:   { label: 'Curso',      color: 'text-blue-400 bg-blue-400/10',    icon: BookOpen },
  ebook:    { label: 'E-book',     color: 'text-purple-400 bg-purple-400/10', icon: FileText },
  mentoria: { label: 'Mentoria',   color: 'text-orange-400 bg-orange-400/10', icon: Users },
  saas:     { label: 'SaaS',       color: 'text-[#00e88a] bg-[#00e88a]/10',   icon: Zap },
  outros:   { label: 'Infoproduto',color: 'text-pink-400 bg-pink-400/10',     icon: Layers },
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, logo_url, cover_url, product_type, is_public, is_flowyn_saas,
      commission_rate, category, created_at,
      plans(id, price),
      affiliations(id)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const { data: sales } = await supabase
    .from('orders')
    .select('product_id, amount')
    .eq('status', 'paid')
    .in('product_id', (products ?? []).map(p => p.id))

  const salesByProduct = (sales ?? []).reduce((acc: Record<string, number>, s) => {
    acc[s.product_id] = (acc[s.product_id] || 0) + (s.amount || 0)
    return acc
  }, {})

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Meus Produtos</h1>
          <p className="text-white/50 text-sm mt-1">{products?.length ?? 0} produto(s) criado(s)</p>
        </div>
        <Link href="/dashboard/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00e88a] text-black font-bold text-sm shadow-[0_0_15px_rgba(0,232,138,0.2)] hover:shadow-[0_0_25px_rgba(0,232,138,0.4)] hover:-translate-y-0.5 transition-all">
          <PlusCircle className="w-4 h-4" />
          Criar Produto
        </Link>
      </div>

      {/* Empty state */}
      {(!products || products.length === 0) && (
        <div className="text-center py-24 bg-[#111111] border border-white/10 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <Box className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum produto criado</h3>
          <p className="text-white/50 text-sm mb-8">Crie seu primeiro produto e comece a vender hoje mesmo.</p>
          <Link href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00e88a] text-black font-bold text-sm">
            <PlusCircle className="w-4 h-4" /> Criar Primeiro Produto
          </Link>
        </div>
      )}

      {/* Products grid */}
      {products && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map(product => {
            const cfg = TYPE_CONFIG[product.product_type] ?? TYPE_CONFIG['outros']
            const Icon = cfg.icon
            const minPrice = product.plans?.length
              ? Math.min(...product.plans.map((p: any) => p.price))
              : null
            const affiliateCount = product.affiliations?.length ?? 0
            const totalRevenue = salesByProduct[product.id] ?? 0

            return (
              <Link key={product.id} href={`/dashboard/products/${product.id}`}
                className="group bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all">

                {/* Cover image */}
                <div className="h-36 bg-gradient-to-br from-white/5 to-white/0 relative overflow-hidden">
                  {product.cover_url ? (
                    <img src={product.cover_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-white/10" />
                    </div>
                  )}
                  {/* Type badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                  {/* Visibility badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${product.is_public ? 'bg-[#00e88a]/10 text-[#00e88a]' : 'bg-white/5 text-white/40'}`}>
                    {product.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {product.is_public ? 'Público' : 'Privado'}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    {product.logo_url ? (
                      <img src={product.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white/30" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{product.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{product.category || 'Sem categoria'}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-0.5">Comissão</p>
                      <p className="text-sm font-bold text-[#00e88a]">{product.commission_rate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-0.5">A partir de</p>
                      <p className="text-sm font-bold text-white">
                        {minPrice !== null ? `R$ ${minPrice.toFixed(2).replace('.', ',')}` : '—'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-0.5">Afiliados</p>
                      <p className="text-sm font-bold text-white">{affiliateCount}</p>
                    </div>
                  </div>

                  {totalRevenue > 0 && (
                    <div className="mt-3 flex items-center gap-2 bg-[#00e88a]/5 rounded-lg px-3 py-2">
                      <BarChart2 className="w-3.5 h-3.5 text-[#00e88a]" />
                      <span className="text-xs text-[#00e88a] font-semibold">
                        R$ {totalRevenue.toFixed(2).replace('.', ',')} em vendas
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
