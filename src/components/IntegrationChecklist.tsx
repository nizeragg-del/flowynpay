import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export async function IntegrationChecklist({ productId }: { productId: string }) {
  const supabase = await createClient()

  // Fetch product data
  const { data: product } = await supabase
    .from('products')
    .select('*, plans(*), orders(*), webhook_logs(*)')
    .eq('id', productId)
    .single()

  if (!product) return null

  // 1. Product created (always true if we are here)
  const isProductCreated = true

  // 2. Plan created with plan_identifier
  const hasPlan = product.plans && product.plans.some((p: any) => p.plan_identifier)

  // 3. Webhook URL set
  const hasWebhook = !!product.webhook_url

  // 4. Webhook Tested
  const hasWebhookTested = product.webhook_logs && product.webhook_logs.some((l: any) => l.success === true)

  // 5. Test purchase
  const hasTestPurchase = product.orders && product.orders.some((o: any) => o.is_sandbox === true && o.status === 'paid')

  const steps = [
    { label: 'Produto criado', done: isProductCreated, required: true },
    { label: 'Plano com identificador', done: hasPlan, required: true },
    { label: 'URL de Webhook cadastrada', done: hasWebhook, required: true },
    { label: 'Webhook testado com sucesso', done: hasWebhookTested, required: true },
    { label: 'Compra teste simulada', done: hasTestPurchase, required: true }
  ]

  const requiredSteps = steps.filter(s => s.required)
  const completedRequired = requiredSteps.filter(s => s.done).length
  const progressPercent = Math.round((completedRequired / requiredSteps.length) * 100)

  const isReady = completedRequired === requiredSteps.length

  return (
    <div className="bg-[#111111] rounded-2xl border border-white/10 shadow-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Progresso da Integração</h2>
          <p className="text-sm text-white/50">Conclua os passos abaixo para começar a receber afiliados e vender.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${isReady ? 'bg-[#00e88a]/20 text-[#00e88a]' : 'bg-white/10 text-white/70'}`}>
            {isReady ? 'Pronto para vender!' : `${progressPercent}% Concluído`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#0a0a0a] border border-white/5 h-2 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${isReady ? 'bg-[#00e88a]' : 'bg-indigo-500'}`} 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-[#00e88a]" />
              ) : (
                <Circle className="w-5 h-5 text-white/20" />
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-white/50'}`}>
                {step.label} {(!step.required) && <span className="text-xs text-white/30 font-normal ml-1">(Opcional)</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {!isReady && (
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <Link href={`/dashboard/products/${productId}/integrations`} className="text-sm font-bold text-[#00e88a] flex items-center gap-2 hover:underline">
            Continuar Integração
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
