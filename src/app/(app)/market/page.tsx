import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Store, TrendingUp, Handshake, ExternalLink, Star, Users, Zap, Search } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function MarketPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAffiliate = profile?.role === 'affiliate'

  // Fetch products with plans to show price range
  const { data: products } = await supabase
    .from('products')
    .select('*, owner:profiles(full_name), plans(*)')
    .order('created_at', { ascending: false })

  // Get affiliations count per product
  const { data: affiliationCounts } = await supabase
    .from('affiliations')
    .select('product_id')

  const countMap: Record<string, number> = {}
  affiliationCounts?.forEach(a => {
    countMap[a.product_id] = (countMap[a.product_id] || 0) + 1
  })

  // Get current user affiliations
  const { data: myAffiliations } = await supabase
    .from('affiliations')
    .select('product_id')
    .eq('affiliate_id', user.id)

  const affiliatedProductIds = myAffiliations?.map(a => a.product_id) || []

  async function promoteProduct(formData: FormData) {
    'use server'
    const product_id = formData.get('product_id') as string

    if (!product_id) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('affiliations')
      .insert({
        affiliate_id: user.id,
        product_id: product_id
      })

    revalidatePath('/market')
    redirect('/dashboard/affiliations')
  }

  const productCount = products?.length || 0

  return (
    <div className="w-full pb-12">
      <main className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#00e88a]/10 via-[#00e88a]/5 to-[#00e88a]/5 rounded-2xl p-8 mb-8 border border-[#00e88a]/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-[#00e88a]" />
                <span className="text-xs font-bold text-[#00e88a] uppercase tracking-wider">Marketplace Flowyn</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Vitrine de Produtos</h2>
              <p className="text-white/60 font-medium">
                {productCount} {productCount === 1 ? 'produto disponível' : 'produtos disponíveis'} para afiliação. Promova e ganhe comissões recorrentes.
              </p>
            </div>
            {isAffiliate && (
              <Link href="/dashboard/affiliations" className="inline-flex items-center gap-2 bg-[#111111] border border-white/10 text-white px-5 py-2.5 rounded-xl font-semibold shadow-xl hover:bg-white/5 transition-all text-sm">
                Minhas Afiliações
              </Link>
            )}
          </div>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-24">
             <Store className="w-20 h-20 text-white/20 mx-auto mb-6" />
             <h3 className="text-2xl font-bold text-white mb-2">Vitrine Vazia</h3>
             <p className="text-white/50 max-w-md mx-auto">Nenhum produtor cadastrou um SaaS ainda. Quando novos produtos forem lançados, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => {
              const isAffiliated = affiliatedProductIds.includes(p.id)
              const affiliateCount = countMap[p.id] || 0
              const plans = (p.plans as any[]) || []
              const minPrice = plans.length > 0 ? Math.min(...plans.map((pl: any) => Number(pl.price))) : null
              const maxPrice = plans.length > 0 ? Math.max(...plans.map((pl: any) => Number(pl.price))) : null
              
              return (
                <div key={p.id} className="bg-[#111111] border border-white/10 rounded-2xl shadow-xl hover:border-[#00e88a]/30 transition-all overflow-hidden group">
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                    
                    {/* Product Identity */}
                    <div className="flex items-center gap-4 lg:w-80 flex-shrink-0">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-[#0a0a0a] border border-white/10 flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-xl group-hover:border-[#00e88a]/30 transition-colors">
                          <span className="font-extrabold text-white text-2xl">{p.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#00e88a] transition-colors">{p.name}</h3>
                        <p className="text-sm text-white/50">
                          por <span className="font-medium text-white/70">{p.owner?.full_name || 'Anônimo'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 lg:gap-10 flex-1">
                      {/* Commission Badge */}
                      <div className="text-center">
                        <p className="text-xs text-white/50 font-medium mb-1">Comissão</p>
                        <span className="inline-flex items-center gap-1 bg-[#00e88a]/10 text-[#00e88a] border border-[#00e88a]/20 px-3 py-1.5 rounded-lg text-sm font-extrabold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {p.commission_rate}%
                        </span>
                      </div>

                      {/* Price Range */}
                      <div className="text-center">
                        <p className="text-xs text-white/50 font-medium mb-1">Preço</p>
                        {minPrice ? (
                          <span className="text-sm font-bold text-white">
                            R$ {minPrice.toFixed(2).replace('.', ',')}
                            {maxPrice && maxPrice !== minPrice && (
                              <span className="text-white/40 font-normal"> — R$ {maxPrice.toFixed(2).replace('.', ',')}</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-white/40">Sem planos</span>
                        )}
                      </div>

                      {/* Affiliate Count */}
                      <div className="text-center">
                        <p className="text-xs text-white/50 font-medium mb-1">Afiliados</p>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-white/70">
                          <Users className="w-3.5 h-3.5 text-white/40" />
                          {affiliateCount}
                        </span>
                      </div>

                      {/* Tipo */}
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-white/50 font-medium mb-1">Tipo</p>
                        <span className="text-xs font-bold text-[#00e88a] bg-[#00e88a]/10 px-2.5 py-1 rounded-md border border-[#00e88a]/20">
                          Recorrente
                        </span>
                      </div>

                      {p.site_url && (
                        <div className="text-center hidden lg:block">
                          <p className="text-xs text-white/50 font-medium mb-1">Site</p>
                          <a href={p.site_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#00e88a] hover:text-[#00e88a]/80 hover:underline font-medium">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Visitar
                          </a>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0 lg:w-48">
                      {isAffiliated ? (
                        <Link href="/dashboard/affiliations" className="w-full inline-flex justify-center items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/10 transition-colors text-sm">
                          ✅ Afiliado
                        </Link>
                      ) : (
                        <form action={promoteProduct}>
                          <input type="hidden" name="product_id" value={p.id} />
                          <button 
                            type="submit"
                            disabled={!isAffiliate}
                            className="w-full inline-flex justify-center items-center gap-2 bg-[#00e88a] text-black font-bold py-3 px-4 rounded-xl hover:bg-[#00e88a]/90 transition-all shadow-[0_0_15px_rgba(0,232,138,0.2)] hover:shadow-[0_0_20px_rgba(0,232,138,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:-translate-y-0.5"
                          >
                            <Handshake className="w-4 h-4" />
                            {isAffiliate ? 'Afiliar-se' : 'Apenas Afiliados'}
                          </button>
                        </form>
                      )}
                    </div>

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
