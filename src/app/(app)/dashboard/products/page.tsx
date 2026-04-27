import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Package, ArrowRight, Settings2, Link2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductsListPage() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Você precisa estar logado.</div>
  }

  // Fetch products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meus Produtos</h1>
          <p className="text-slate-500 mt-1">Gerencie os SaaS que você disponibiliza para afiliados.</p>
        </div>
        
        <Link 
          href="/dashboard/products/new" 
          className="flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Novo SaaS
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Erro ao carregar produtos: {error.message}
        </div>
      )}

      {!products || products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mb-6">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Nenhum produto cadastrado</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Você ainda não cadastrou nenhum Software ou SaaS na plataforma. Comece agora mesmo a gerenciar seus afiliados.
          </p>
          <Link 
            href="/dashboard/products/new" 
            className="flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Meu Primeiro SaaS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden">
                  {product.logo_url ? (
                    <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                  SaaS
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link2 className="w-4 h-4" />
                <span className="truncate">{product.site_url || 'Sem site cadastrado'}</span>
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between py-4 border-t border-slate-100 mb-4">
                  <span className="text-sm text-slate-500">Comissão de Afiliado</span>
                  <span className="font-bold text-slate-900">{product.commission_rate}%</span>
                </div>
                
                <Link 
                  href={`/dashboard/products/${product.id}`}
                  className="w-full border border-slate-200 hover:border-black text-slate-700 hover:text-black font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                >
                  <Settings2 className="w-4 h-4" />
                  Gerenciar Produto
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
