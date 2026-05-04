import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Building2, Link as LinkIcon, Image as ImageIcon, Percent, HelpCircle, Sparkles } from 'lucide-react'

export default async function NewSaaSPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'producer') {
    redirect('/dashboard')
  }

  async function createProduct(formData: FormData) {
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

    const { data, error } = await supabase
      .from('products')
      .insert({
        owner_id: user.id,
        name,
        site_url,
        logo_url,
        commission_rate: parseFloat(commission_rate) || 50
      })
      .select('id')
      .single()

    if (!error && data) {
      redirect(`/dashboard/products/${data.id}/plans`)
    }
  }

  return (
    <div className="w-full pb-12">
      <main className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="p-2.5 bg-[#111111] border border-white/10 rounded-xl hover:bg-white/5 transition-colors shadow-xl">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Cadastrar novo produto</h1>
            <p className="text-white/50 text-sm mt-0.5">Preencha as informações abaixo para colocar seu SaaS no mercado de afiliados.</p>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-10 flex gap-3 shadow-xl">
          <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-500 mb-1">Atenção: Ativação do Produto</h4>
            <p className="text-sm text-amber-500/80 leading-relaxed">
              Para garantir a segurança e a entrega do seu SaaS, seu produto só ficará ativo para receber afiliados e processar vendas reais <strong className="text-amber-500">após você concluir a configuração técnica (Webhook)</strong> e nós registrarmos pelo menos 1 entrega com sucesso. Você não poderá gerar links de checkout até lá.
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={createProduct}>

          {/* Section 1: Basic Info */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#00e88a]/10 flex items-center justify-center border border-[#00e88a]/20">
                <Building2 className="w-4 h-4 text-[#00e88a]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Informações Básicas</h2>
                <p className="text-xs text-white/50">Dados essenciais do seu produto</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white/70 mb-2">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#00e88a]/20 focus:border-[#00e88a] transition-all outline-none shadow-xl" 
                  placeholder="Ex: MeuApp CRM, AutoBot Pro..." 
                />
                <p className="text-xs text-white/40 mt-1.5">Este é o nome que aparecerá no Marketplace para os afiliados.</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-white/70 mb-2">
                  Descrição Curta
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#00e88a]/20 focus:border-[#00e88a] transition-all outline-none shadow-xl resize-none"
                  placeholder="Descreva em poucas palavras o que o seu SaaS faz..."
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10 mb-10" />

          {/* Section 2: Links & Media */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#00e88a]/10 flex items-center justify-center border border-[#00e88a]/20">
                <LinkIcon className="w-4 h-4 text-[#00e88a]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Links e Mídia</h2>
                <p className="text-xs text-white/50">Página de vendas e identidade visual</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="site_url" className="block text-sm font-semibold text-white/70 mb-2">
                  Página de Vendas
                </label>
                <input 
                  type="url" 
                  id="site_url" 
                  name="site_url" 
                  className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#00e88a]/20 focus:border-[#00e88a] transition-all outline-none shadow-xl" 
                  placeholder="https://seuapp.com" 
                />
              </div>
              <div>
                <label htmlFor="logo_url" className="block text-sm font-semibold text-white/70 mb-2">
                  URL da Logo
                </label>
                <input 
                  type="url" 
                  id="logo_url" 
                  name="logo_url" 
                  className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#00e88a]/20 focus:border-[#00e88a] transition-all outline-none shadow-xl" 
                  placeholder="https://seuapp.com/logo.png" 
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10 mb-10" />

          {/* Section 3: Commission */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#00e88a]/10 flex items-center justify-center border border-[#00e88a]/20">
                <Percent className="w-4 h-4 text-[#00e88a]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Comissão para Afiliados</h2>
                <p className="text-xs text-white/50">Defina quanto seus afiliados ganharão por cada venda</p>
              </div>
            </div>

            <div className="max-w-sm">
              <label htmlFor="commission_rate" className="block text-sm font-semibold text-white/70 mb-2">
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
                  defaultValue="40" 
                  required 
                  className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 px-4 pr-12 text-white text-lg font-bold focus:ring-2 focus:ring-[#00e88a]/20 focus:border-[#00e88a] transition-all outline-none shadow-xl" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-lg">%</span>
              </div>
            </div>
            
            {/* Commission Tip Card */}
            <div className="mt-5 bg-gradient-to-r from-[#00e88a]/10 to-[#00e88a]/5 border border-[#00e88a]/20 rounded-xl p-5">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5">
                  <Sparkles className="w-5 h-5 text-[#00e88a]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Dica de performance</h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Plataformas como Braip e Hotmart indicam comissões entre <strong className="text-white">30% e 50%</strong> para SaaS recorrentes. 
                    Comissões acima de 40% atraem afiliados de alto nível e geram maior volume de vendas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Link href="/dashboard" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 bg-[#00e88a] hover:bg-[#00e88a]/90 text-black font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(0,232,138,0.2)] hover:shadow-[0_0_20px_rgba(0,232,138,0.3)] hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              Salvar e Configurar Planos
            </button>
          </div>
        </form>

      </main>
    </div>
  )
}
