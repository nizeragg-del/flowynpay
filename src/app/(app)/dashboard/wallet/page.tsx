'use client'

import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, AlertCircle, ExternalLink, Clock } from 'lucide-react'

export default function WalletPage() {
  const [balance, setBalance] = useState<{ available: number, pending: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBalance()
  }, [])

  async function fetchBalance() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/balance')
      const data = await res.json()
      
      if (res.ok) {
        setBalance({
          available: data.available,
          pending: data.pending
        })
      } else {
        // Se não houver conta Stripe, mostramos saldo zero em vez de erro
        if (data.error === 'Conta Stripe não encontrada') {
          setBalance({ available: 0, pending: 0 })
        } else {
          setError(data.error || 'Erro ao carregar saldo.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOpenDashboard() {
    try {
      setDashboardLoading(true)
      setError(null)
      
      const res = await fetch('/api/stripe/dashboard', { method: 'POST' })
      const data = await res.json()

      if (res.ok && data.url) {
        window.open(data.url, '_blank')
      } else {
        setError(data.error || 'Erro ao gerar link do dashboard.')
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.')
    } finally {
      setDashboardLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Carteira</h1>
        <p className="text-zinc-400">Gerencie seu saldo e acompanhe seus recebíveis através do Stripe.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Saldo Disponível */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-24 h-24 text-emerald-500" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 text-zinc-400 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-medium">Saldo Disponível</span>
              </div>
              
              {loading ? (
                <div className="animate-pulse h-10 bg-zinc-800 rounded w-1/2 mt-2"></div>
              ) : (
                <div className="text-4xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance?.available || 0)}
                </div>
              )}
              <p className="text-sm text-zinc-500 mt-2">
                Pronto para ser transferido para sua conta bancária.
              </p>
            </div>

            <button
              onClick={handleOpenDashboard}
              disabled={dashboardLoading || loading || balance === null}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-semibold py-3 rounded-lg transition-all transform active:scale-[0.98]"
            >
              {dashboardLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Ver Detalhes e Sacar no Stripe
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card de Saldo Pendente */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-24 h-24 text-amber-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 text-zinc-400 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="font-medium">Saldo Pendente</span>
            </div>
            
            {loading ? (
              <div className="animate-pulse h-10 bg-zinc-800 rounded w-1/2 mt-2"></div>
            ) : (
              <div className="text-4xl font-bold text-zinc-300">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance?.pending || 0)}
              </div>
            )}
            <p className="text-sm text-zinc-500 mt-2">
              Vendas recentes que estão em processamento.
            </p>
          </div>

          <div className="mt-8 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
            <p className="text-xs text-zinc-500 leading-relaxed">
              O prazo de compensação depende do método de pagamento (Pix é imediato, Cartão de Crédito pode levar até 30 dias dependendo da sua configuração no Stripe).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Sobre os saques</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              A Flowyn utiliza o **Stripe Connect Express** para garantir a segurança e agilidade dos seus pagamentos. 
              Ao clicar em "Ver Detalhes", você será redirecionado para o ambiente seguro do Stripe onde poderá configurar a frequência de transferências automáticas para sua conta bancária ou solicitar saques manuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
