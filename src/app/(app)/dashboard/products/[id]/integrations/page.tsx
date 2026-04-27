import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Globe, CheckCircle2, Building2, CreditCard, Webhook } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { IntegrationChecklist } from '@/components/IntegrationChecklist'
import { WebhookTestPanel } from '@/components/WebhookTestPanel'
import { WebhookLogsList } from '@/components/WebhookLogsList'

export default async function IntegrationsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = params.id
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: product } = await supabase
    .from('products')
    .select('*, plans(*)')
    .eq('id', productId)
    .single()

  if (!product || product.owner_id !== user.id) {
    redirect('/dashboard')
  }

  // Fetch Webhook logs
  const { data: webhookLogs } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(50)

  async function updateWebhook(formData: FormData) {
    'use server'
    const webhook_url = formData.get('webhook_url') as string

    if (!webhook_url) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('products')
      .update({ webhook_url })
      .eq('id', productId)
      .eq('owner_id', user.id)

    revalidatePath(`/dashboard/products/${productId}/integrations`)
  }

  return (
    <div className="w-full pb-12">
      <main className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/products" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Webhooks / Integração</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Produto: <span className="font-bold text-slate-900">{product.name}</span>
            </p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex bg-white rounded-2xl border border-slate-200 p-2 gap-2 mb-10 overflow-x-auto shadow-sm">
          <Link href={`/dashboard/products/${productId}`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-colors">
            <Building2 className="w-4 h-4" />
            Detalhes do Produto
          </Link>
          <Link href={`/dashboard/products/${productId}/plans`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-colors">
            <CreditCard className="w-4 h-4" />
            Planos de Venda
          </Link>
          <Link href={`/dashboard/products/${productId}/integrations`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl">
            <Webhook className="w-4 h-4" />
            Webhooks / Integração
          </Link>
        </div>

        {/* Integration Checklist */}
        <IntegrationChecklist productId={productId} />

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-10 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Nível Básico (Obrigatório)</h2>
          <p className="text-slate-300 text-sm">
            Para começar a vender, você só precisa configurar a URL do seu servidor para receber os webhooks de pagamento.
          </p>
        </div>

        {/* Webhook Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Webhook URL</h2>
              <p className="text-xs text-slate-500">Configure o endpoint que receberá notificações de pagamento</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Quando uma assinatura for processada com sucesso, nosso sistema fará automaticamente um <code className="bg-slate-100 px-2 py-0.5 rounded text-primary text-xs font-bold border border-slate-200">POST</code> para a URL abaixo com os dados do cliente.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Segurança: Verificação de Assinatura
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Cada requisição inclui o header <strong>X-Flowyn-Signature</strong>. Você deve validar esse hash usando o Secret abaixo para garantir que a requisição veio da Flowyn.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Webhook Secret (Chave de Assinatura)
            </label>
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 font-mono text-sm text-slate-700 flex justify-between items-center shadow-inner">
              <span>{product.webhook_secret || 'wh_sec_...'}</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded uppercase font-bold text-slate-500">Privado</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Mantenha este secret em seu arquivo <code className="bg-slate-50 px-1 rounded">.env</code>. Ele é usado para gerar o HMAC-SHA256 da assinatura.
            </p>
          </div>

          <form action={updateWebhook} className="space-y-5">
            <div>
              <label htmlFor="webhook_url" className="block text-sm font-semibold text-slate-700 mb-2">
                Endpoint Recebedor
              </label>
              <input 
                type="url" 
                id="webhook_url" 
                name="webhook_url" 
                defaultValue={product.webhook_url || ''}
                required 
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" 
                placeholder="https://api.seusaas.com/webhooks/saasnex" 
              />
              {product.webhook_url && (
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm text-emerald-600 font-medium">Webhook configurado e ativo</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 bg-black hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                Salvar URL
              </button>
            </div>
          </form>
        </div>

        {/* Test Panel */}
        <WebhookTestPanel productId={productId} currentUrl={product.webhook_url} plans={product.plans || []} />

        {/* Webhook Logs */}
        <WebhookLogsList logs={webhookLogs || []} />


      </main>
    </div>
  )
}
