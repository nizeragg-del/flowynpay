'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  CreditCard, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Banknote,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import { Suspense } from 'react'

interface ConnectStatus {
  connected: boolean
  status: string
  onboarding_complete: boolean
  charges_enabled?: boolean
  payouts_enabled?: boolean
}

function PaymentsContent() {
  const searchParams = useSearchParams()
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectLoading, setConnectLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSuccess = searchParams.get('success') === 'true'
  const isRefresh = searchParams.get('refresh') === 'true'

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/connect')
      const data = await res.json()
      setConnectStatus(data)
    } catch (err) {
      setError('Erro ao verificar status da conta')
    }
    setLoading(false)
  }

  async function handleConnect() {
    setConnectLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao iniciar onboarding')
        setConnectLoading(false)
        return
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url
    } catch (err) {
      setError('Erro de conexão')
      setConnectLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const isActive = connectStatus?.status === 'active' && connectStatus?.onboarding_complete

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-violet-600" />
          Configurações de Pagamento
        </h1>
        <p className="text-slate-500 mt-1">
          Configure sua conta Stripe para receber pagamentos e comissões.
        </p>
      </div>

      {/* Success Banner */}
      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-700">
            Conta Stripe conectada com sucesso! Seus pagamentos serão depositados automaticamente.
          </p>
        </div>
      )}

      {/* Refresh Banner */}
      {isRefresh && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700">
              Sessão expirada. Clique abaixo para continuar a configuração.
            </p>
          </div>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Status Header */}
        <div className={`px-6 py-5 border-b ${isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                {isActive ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {isActive ? 'Conta Conectada' : 'Conta não configurada'}
                </h3>
                <p className="text-sm text-slate-500">
                  {isActive 
                    ? 'Você está recebendo pagamentos normalmente' 
                    : 'Configure sua conta para receber pagamentos'}
                </p>
              </div>
            </div>
            <button
              onClick={checkStatus}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Atualizar status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Details */}
        <div className="p-6">
          {isActive ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600 uppercase">Cobranças</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-700">Ativado</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600 uppercase">Saques</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-700">Ativado</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-500" />
                  Seus pagamentos são processados pelo <strong>Stripe</strong> com segurança de nível bancário.
                  Os valores são depositados diretamente na sua conta em até 2 dias úteis.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={connectLoading}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Acessar Painel do Stripe
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Receba de forma automática</h4>
                    <p className="text-sm text-slate-500">Os valores das vendas e comissões são transferidos automaticamente para sua conta bancária.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Segurança total</h4>
                    <p className="text-sm text-slate-500">Processado pelo Stripe, a plataforma de pagamentos mais segura do mundo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Cartão, boleto e Pix</h4>
                    <p className="text-sm text-slate-500">Aceite pagamentos por cartão de crédito e outros métodos populares no Brasil.</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={connectLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connectLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    Conectar Conta Stripe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400">
                Você será redirecionado ao Stripe para configurar sua conta de forma segura.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentsSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    }>
      <PaymentsContent />
    </Suspense>
  )
}
