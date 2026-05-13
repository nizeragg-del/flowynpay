'use client'

import { useEffect, useState } from 'react'
import { 
  CreditCard, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Banknote,
  ShieldCheck,
  Wallet
} from 'lucide-react'
import { Suspense } from 'react'

interface StripeStatus {
  connected: boolean
  onboarding_complete: boolean
  account_id?: string
  email?: string
}

function PaymentsContent() {
  const [status, setStatus] = useState<StripeStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/status')
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      setError('Erro ao verificar status da conta')
    }
    setLoading(false)
  }

  async function handleConnect() {
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/onboarding', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao iniciar onboarding')
      } else if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleGoToDashboard() {
    setActionLoading(true)
    try {
      const res = await fetch('/api/stripe/dashboard', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (err) {
      setError('Erro ao abrir dashboard')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00e88a]" />
      </div>
    )
  }

  const isConnected = status?.connected && status?.onboarding_complete

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-[#00e88a]" />
          Configurações de Pagamento
        </h1>
        <p className="text-white/50 mt-1">
          Conecte sua conta Stripe para receber pagamentos e comissões com a menor taxa do mercado.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className={`px-6 py-5 border-b ${isConnected ? 'bg-[#00e88a]/5 border-white/5' : 'bg-[#0a0a0a] border-white/5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isConnected ? 'bg-[#00e88a]/10' : 'bg-white/5 border border-white/10'}`}>
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00e88a]" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {isConnected ? 'Stripe Conectado' : (status?.connected ? 'Finalizar Cadastro' : 'Stripe não conectado')}
                </h3>
                <p className="text-sm text-white/50">
                  {isConnected 
                    ? `Conta: ${status?.email || status?.account_id}` 
                    : 'Conecte sua conta para começar a vender'}
                </p>
              </div>
            </div>
            <button
              onClick={checkStatus}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {!isConnected ? (
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00e88a]" />
                    Por que usar Stripe Connect?
                  </h4>
                  <ul className="text-sm text-white/50 space-y-2">
                    <li>• Taxas imbatíveis: 3,9% + R$ 1,00 por venda</li>
                    <li>• Recebimento automático de comissões</li>
                    <li>• Onboarding rápido e seguro</li>
                  </ul>
                </div>

                <button 
                  onClick={handleConnect}
                  disabled={actionLoading}
                  className="w-full bg-[#00e88a] hover:bg-[#00e88a]/90 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,232,138,0.3)]"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {status?.connected ? 'Finalizar Configuração Stripe' : 'Conectar minha conta Stripe'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#00e88a]/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[#00e88a]" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Status da Conta</p>
                      <p className="text-white font-medium">Ativa para Recebimentos</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#00e88a]" />
                </div>

                <button 
                  onClick={handleGoToDashboard}
                  disabled={actionLoading}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Ver Painel Financeiro no Stripe
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentsSettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00e88a]" /></div>}>
      <PaymentsContent />
    </Suspense>
  )
}
