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
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-emerald-500/5 rounded-2xl p-8 mb-8 border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Marketplace Flowyn</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Vitrine de Produtos</h2>
              <p className="text-slate-600 font-medium">
                {productCount} {productCount === 1 ? 'produto disponível' : 'produtos disponíveis'} para afiliação. Promova e ganhe comissões recorrentes.
              </p>
            </div>
            {isAffiliate && (
              <Link href="/dashboard/affiliations" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-sm">
                Minhas Afiliações
              </Link>
            )}
          </div>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-24">
             <Store className="w-20 h-20 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Vitrine Vazia</h3>
             <p className="text-slate-500 max-w-md mx-auto">Nenhum produtor cadastrou um SaaS ainda. Quando novos produtos forem lançados, eles aparecerão aqui.</p>
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
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                    
                    {/* Product Identity */}
                    <div className="flex items-center gap-4 lg:w-80 flex-shrink-0">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200 flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                          <span className="font-extrabold text-white text-2xl">{p.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-sm text-slate-500">
                          por <span className="font-medium text-slate-700">{p.owner?.full_name || 'Anônimo'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 lg:gap-10 flex-1">
                      {/* Commission Badge */}
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Comissão</p>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-extrabold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {p.commission_rate}%
                        </span>
                      </div>

                      {/* Price Range */}
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Preço</p>
                        {minPrice ? (
                          <span className="text-sm font-bold text-slate-900">
                            R$ {minPrice.toFixed(2).replace('.', ',')}
                            {maxPrice && maxPrice !== minPrice && (
                              <span className="text-slate-400 font-normal"> — R$ {maxPrice.toFixed(2).replace('.', ',')}</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">Sem planos</span>
                        )}
                      </div>

                      {/* Affiliate Count */}
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Afiliados</p>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {affiliateCount}
                        </span>
                      </div>

                      {/* Tipo */}
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-slate-500 font-medium mb-1">Tipo</p>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                          Recorrente
                        </span>
                      </div>

                      {p.site_url && (
                        <div className="text-center hidden lg:block">
                          <p className="text-xs text-slate-500 font-medium mb-1">Site</p>
                          <a href={p.site_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Visitar
                          </a>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0 lg:w-48">
                      {isAffiliated ? (
                        <Link href="/dashboard/affiliations" className="w-full inline-flex justify-center items-center gap-2 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors text-sm">
                          ✅ Afiliado
                        </Link>
                      ) : (
                        <form action={promoteProduct}>
                          <input type="hidden" name="product_id" value={p.id} />
                          <button 
                            type="submit"
                            disabled={!isAffiliate}
                            className="w-full inline-flex justify-center items-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
