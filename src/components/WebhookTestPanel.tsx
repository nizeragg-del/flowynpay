'use client'

import { useState } from 'react'
import { Play, Activity, Clock, CheckCircle2, XCircle, AlertTriangle, ShoppingCart } from 'lucide-react'
import { testWebhookAction, simulatePurchaseAction } from '@/app/(app)/dashboard/products/[id]/integrations/actions'

export function WebhookTestPanel({ productId, currentUrl, plans }: { productId: string, currentUrl: string, plans: any[] }) {
  const [loading, setLoading] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState<{ status: number | null, timeMs: number, success: boolean, error?: string, body?: string } | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '')

  async function handleTest() {
    if (!currentUrl) return alert('Configure uma URL de webhook primeiro.')
    
    setLoading(true)
    setResult(null)
    try {
      const res = await testWebhookAction(productId, currentUrl)
      setResult({
        status: res.status ?? null,
        timeMs: res.timeMs ?? 0,
        success: res.success ?? false,
        error: res.error,
        body: res.body
      })
    } catch (e: any) {
      setResult({
        status: null,
        timeMs: 0,
        success: false,
        error: e.message || 'Erro de rede'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSimulate() {
    if (!currentUrl) return alert('Configure uma URL de webhook primeiro.')
    if (!selectedPlanId) return alert('Você precisa criar um plano de venda primeiro para simular uma compra.')

    setSimulating(true)
    try {
      const res = await simulatePurchaseAction(productId, selectedPlanId)
      if (res.success) {
        alert('Simulação de compra enviada com sucesso! Verifique os logs de webhook abaixo.')
      } else {
        alert('Falha na simulação: ' + res.error)
      }
    } catch (e: any) {
      alert('Erro na simulação: ' + e.message)
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-10 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Testes e Simulação
        </h3>
        <p className="text-sm text-slate-500">
          Valide a sua integração antes de receber clientes reais.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Ping */}
        <div className="space-y-4 border-r-0 md:border-r border-slate-100 md:pr-6">
          <h4 className="font-semibold text-slate-800 text-sm">1. Ping Test (Payload Fictício)</h4>
          <p className="text-xs text-slate-500 mb-4">
            Dispara um evento de teste na sua URL instantaneamente para validar conectividade e tempo de resposta.
          </p>
          <button 
            onClick={handleTest}
            disabled={loading || !currentUrl}
            className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? 'Disparando...' : 'Enviar Payload de Teste'}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded-xl border ${result.success ? (result.timeMs > 3000 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200') : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                {result.success ? (
                  result.timeMs > 3000 ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-bold text-sm ${result.success ? (result.timeMs > 3000 ? 'text-amber-700' : 'text-emerald-700') : 'text-red-700'}`}>
                  {result.success ? 'Conexão Bem-sucedida' : 'Falha na Conexão'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-white/60 rounded p-2 border border-black/5">
                  <span className="block text-slate-500 font-medium mb-0.5">Status HTTP</span>
                  <span className={`font-bold ${result.success ? 'text-emerald-600' : 'text-red-600'}`}>{result.status || 'N/A'}</span>
                </div>
                <div className="bg-white/60 rounded p-2 border border-black/5">
                  <span className="block text-slate-500 font-medium mb-0.5">Tempo de Resposta</span>
                  <span className={`font-bold ${result.timeMs > 3000 ? 'text-amber-600' : 'text-slate-700'}`}>{result.timeMs}ms</span>
                </div>
              </div>

              {result.error && (
                <div className="text-xs text-red-600 bg-white/60 p-2 rounded border border-red-100 mb-2">
                  <span className="font-bold">Erro: </span> {result.error}
                </div>
              )}
              
              {result.body && (
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Body da Resposta</span>
                  <pre className="text-[10px] text-slate-600 bg-white/60 p-2 rounded border border-black/5 max-h-24 overflow-y-auto whitespace-pre-wrap">
                    {result.body}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sandbox Simulation */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 text-sm">2. Simulação End-to-End (Sandbox)</h4>
          <p className="text-xs text-slate-500 mb-4">
            Simula uma compra real no sistema (R$ 0,00). Útil para testar se o seu SaaS cadastra e provisiona o cliente corretamente com o `plan_identifier`.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Plano para Simular</label>
              <select 
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
              >
                {plans.length === 0 && <option value="">Nenhum plano criado</option>}
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.plan_identifier || 'Sem identifier'})</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleSimulate}
              disabled={simulating || plans.length === 0 || !currentUrl}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              {simulating ? <Clock className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {simulating ? 'Simulando...' : 'Simular Venda Completa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
