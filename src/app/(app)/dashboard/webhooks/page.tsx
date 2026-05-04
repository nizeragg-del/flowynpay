'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Webhook, CheckCircle2, XCircle, Clock, RefreshCw, Send, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function WebhooksPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<string | null>(null)
  const [stats, setStats] = useState({ delivered: 0, failed: 0, pending: 0, total: 0 })
  const supabase = createClient()

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'producer') { setLoading(false); return }

    // Get webhook logs for producer's products
    const { data: webhookLogs } = await supabase
      .from('webhook_logs')
      .select('*, order:orders(id, customer_name, customer_email, amount, status, webhook_status), product:products(name)')
      .order('created_at', { ascending: false })
      .limit(100)

    setLogs(webhookLogs || [])

    // Calculate stats from unique orders
    const { data: myProducts } = await supabase.from('products').select('id').eq('owner_id', user.id)
    const productIds = myProducts?.map(p => p.id) || []

    if (productIds.length > 0) {
      const { data: orders } = await supabase
        .from('orders')
        .select('webhook_status')
        .in('product_id', productIds)

      const delivered = orders?.filter(o => o.webhook_status === 'delivered').length || 0
      const failed = orders?.filter(o => o.webhook_status === 'failed').length || 0
      const pending = orders?.filter(o => o.webhook_status === 'pending').length || 0
      setStats({ delivered, failed, pending, total: orders?.length || 0 })
    }

    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  async function handleRetry(orderId: string) {
    setRetrying(orderId)
    try {
      const res = await fetch('/api/webhooks/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
      await res.json()
      // Reload data after retry
      await loadData()
    } catch (err) {
      console.error('Retry failed:', err)
    }
    setRetrying(null)
  }

  if (loading) {
    return <div className="p-8 text-center text-white/50 animate-pulse">Carregando logs de webhook...</div>
  }

  return (
    <div className="w-full pb-12">
      <main className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Webhook Monitor</h2>
            <p className="text-white/60 text-sm mt-0.5">Acompanhe todas as notificações enviadas para seu SaaS.</p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 bg-[#111111] border border-white/10 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all shadow-xl text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-white/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Total</p>
              <div className="bg-white/5 text-white/60 p-2 rounded-xl border border-white/10">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white relative z-10">{stats.total}</h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#00e88a]/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e88a]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00e88a]/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Entregues</p>
              <div className="bg-[#00e88a]/10 text-[#00e88a] p-2 rounded-xl border border-[#00e88a]/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#00e88a] relative z-10">{stats.delivered}</h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-red-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Falharam</p>
              <div className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/20">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-400 relative z-10">{stats.failed}</h3>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Pendentes</p>
              <div className="bg-amber-500/10 text-amber-400 p-2 rounded-xl border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-400 relative z-10">{stats.pending}</h3>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-[#00e88a]" />
              <h3 className="text-lg font-bold text-white">Histórico de Entregas</h3>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16">
              <Webhook className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-1">Nenhum webhook enviado</h4>
              <p className="text-white/50 text-sm">Quando uma venda for processada, as tentativas de entrega aparecerão aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0a0a0a] text-white/50 uppercase text-xs tracking-wider border-b border-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Pedido</th>
                    <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">Produto</th>
                    <th className="text-left px-6 py-4 font-semibold whitespace-nowrap">URL</th>
                    <th className="text-center px-6 py-4 font-semibold whitespace-nowrap">Tentativa</th>
                    <th className="text-center px-6 py-4 font-semibold whitespace-nowrap">HTTP</th>
                    <th className="text-center px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="text-right px-6 py-4 font-semibold whitespace-nowrap">Data</th>
                    <th className="text-center px-6 py-4 font-semibold whitespace-nowrap">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-white">{log.order?.customer_name || '—'}</p>
                          <p className="text-xs text-white/40 font-mono">{log.order_id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-white/70">{log.product?.name || '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs text-white/50 font-mono bg-[#0a0a0a] border border-white/10 px-2 py-1 rounded">
                          {log.webhook_url?.replace(/^https?:\/\//, '').slice(0, 30)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="text-sm font-bold text-white/70">#{log.attempt_number}</span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {log.response_status ? (
                          <span className={`text-xs font-bold px-2 py-1 border rounded-md ${
                            log.response_status < 300 ? 'bg-[#00e88a]/10 text-[#00e88a] border-[#00e88a]/20' :
                            log.response_status < 500 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {log.response_status}
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 bg-[#00e88a]/10 text-[#00e88a] border border-[#00e88a]/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle className="w-3 h-3" /> Falhou
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-white/50 text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {!log.success && log.order?.webhook_status === 'failed' && (
                          <button
                            onClick={() => handleRetry(log.order_id)}
                            disabled={retrying === log.order_id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00e88a] hover:bg-[#00e88a]/10 border border-transparent hover:border-[#00e88a]/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {retrying === log.order_id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Reenviar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Box */}
        {stats.failed > 0 && (
          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white mb-1">Webhooks falhando?</h4>
              <p className="text-sm text-white/60">
                Verifique se sua Webhook URL está acessível publicamente e retorna um código HTTP 2xx. 
                Nosso sistema tenta 3 vezes com intervalos crescentes (5s → 30s → 5min) antes de marcar como falha.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
