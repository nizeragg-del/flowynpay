import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Package, ArrowRight, Settings2, Link2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductsListPage() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div className="p-8 text-center text-white/50">Você precisa estar logado.</div>
  }

  // Fetch products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Meus Produtos</h1>
          <p className="text-white/60 mt-1 font-medium">Gerencie os SaaS que você disponibiliza para afiliados.</p>
        </div>
        
        <Link 
          href="/dashboard/products/new" 
          className="flex items-center justify-center gap-2 bg-[#00e88a] hover:bg-[#00e88a]/90 text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(0,232,138,0.3)] hover:shadow-[0_0_25px_rgba(0,232,138,0.5)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Novo SaaS
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
          Erro ao carregar produtos: {error.message}
        </div>
      )}

      {!products || products.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xl">
          <div className="w-20 h-20 bg-white/5 flex items-center justify-center rounded-full mb-6 border border-white/10">
            <Package className="w-10 h-10 text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nenhum produto cadastrado</h2>
          <p className="text-white/50 max-w-md mx-auto mb-8">
            Você ainda não cadastrou nenhum Software ou SaaS na plataforma. Comece agora mesmo a gerenciar seus afiliados.
          </p>
          <Link 
            href="/dashboard/products/new" 
            className="flex items-center justify-center gap-2 bg-[#00e88a] hover:bg-[#00e88a]/90 text-black px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(0,232,138,0.3)] hover:shadow-[0_0_25px_rgba(0,232,138,0.5)] transition-all"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Meu Primeiro SaaS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-xl hover:border-[#00e88a]/30 transition-all flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e88a]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00e88a]/10 transition-colors" />
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                  {product.logo_url ? (
                    <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-white/40" />
                  )}
                </div>
                <div className="bg-[#00e88a]/10 text-[#00e88a] border border-[#00e88a]/20 text-xs font-bold px-3 py-1 rounded-full">
                  SaaS
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 relative z-10">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm text-white/50 mb-6 relative z-10">
                <Link2 className="w-4 h-4" />
                <span className="truncate">{product.site_url || 'Sem site cadastrado'}</span>
              </div>
              
              <div className="mt-auto relative z-10">
                <div className="flex items-center justify-between py-4 border-t border-white/10 mb-4">
                  <span className="text-sm text-white/50">Comissão de Afiliado</span>
                  <span className="font-bold text-[#00e88a]">{product.commission_rate}%</span>
                </div>
                
                <Link 
                  href={`/dashboard/products/${product.id}`}
                  className="w-full border border-white/10 hover:border-[#00e88a] hover:bg-[#00e88a]/5 text-white/70 hover:text-[#00e88a] font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Settings2 className="w-4 h-4" />
                  Gerenciar Produto
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
