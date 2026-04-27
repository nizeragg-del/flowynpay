import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Building2, Link as LinkIcon, Image as ImageIcon, Percent, Webhook, CreditCard } from 'lucide-react'
import { IntegrationChecklist } from '@/components/IntegrationChecklist'

export const dynamic = 'force-dynamic'

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!product) {
    redirect('/dashboard/products')
  }

  async function updateProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const site_url = formData.get('site_url') as string
    const logo_url = formData.get('logo_url') as string
    const commission_rate = formData.get('commission_rate') as string
    const description = formData.get('description') as string

    if (!name) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('products')
      .update({
        name,
        site_url,
        logo_url,
        commission_rate: parseFloat(commission_rate) || 50
      })
      .eq('id', id)
      .eq('owner_id', user.id)

    redirect('/dashboard/products')
  }

  return (
    <div className="w-full pb-12">
      <main className="max-w-4xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gerenciar: {product.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Edite as informações ou acesse as configurações avançadas.</p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex bg-white rounded-2xl border border-slate-200 p-2 gap-2 mb-10 overflow-x-auto shadow-sm">
          <Link href={`/dashboard/products/${id}`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl">
            <Building2 className="w-4 h-4" />
            Detalhes do Produto
          </Link>
          <Link href={`/dashboard/products/${id}/plans`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-colors">
            <CreditCard className="w-4 h-4" />
            Planos de Venda
          </Link>
          <Link href={`/dashboard/products/${id}/integrations`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-colors">
            <Webhook className="w-4 h-4" />
            Webhooks / Integração
          </Link>
        </div>

        {/* Integration Checklist */}
        <IntegrationChecklist productId={id} />

        {/* Form */}
        <form action={updateProduct} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

          {/* Section 1: Basic Info */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-slate-700" />
              </span>
              Informações Básicas
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  defaultValue={product.name}
                  required 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-black/20 focus:border-black transition-all outline-none shadow-sm" 
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Section 2: Links & Media */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-slate-700" />
              </span>
              Links e Mídia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="site_url" className="block text-sm font-semibold text-slate-700 mb-2">
                  Página de Vendas
                </label>
                <input 
                  type="url" 
                  id="site_url" 
                  name="site_url" 
                  defaultValue={product.site_url || ''}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-black/20 focus:border-black transition-all outline-none shadow-sm" 
                />
              </div>
              <div>
                <label htmlFor="logo_url" className="block text-sm font-semibold text-slate-700 mb-2">
                  URL da Logo
                </label>
                <input 
                  type="url" 
                  id="logo_url" 
                  name="logo_url" 
                  defaultValue={product.logo_url || ''}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-black/20 focus:border-black transition-all outline-none shadow-sm" 
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* Section 3: Commission */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Percent className="w-4 h-4 text-slate-700" />
              </span>
              Comissão do Afiliado
            </h2>

            <div className="max-w-xs">
              <label htmlFor="commission_rate" className="block text-sm font-semibold text-slate-700 mb-2">
                Taxa de Comissão (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  id="commission_rate" 
                  name="commission_rate" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  defaultValue={product.commission_rate} 
                  required 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 pr-12 text-slate-900 text-lg font-bold focus:ring-2 focus:ring-black/20 focus:border-black transition-all outline-none shadow-sm" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 bg-black hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}
