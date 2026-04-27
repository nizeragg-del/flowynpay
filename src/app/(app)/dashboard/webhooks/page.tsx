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
    return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando logs de webhook...</div>
  }

  return (
    <div className="w-full pb-12">
      <main className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Webhook Monitor</h2>
            <p className="text-slate-500 text-sm mt-0.5">Acompanhe todas as notificações enviadas para seu SaaS.</p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total</p>
              <div className="bg-slate-100 text-slate-600 p-2 rounded-xl">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Entregues</p>
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600">{stats.delivered}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Falharam</p>
              <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-600">{stats.failed}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pendentes</p>
              <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-900">Histórico de Entregas</h3>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16">
              <Webhook className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-900 mb-1">Nenhum webhook enviado</h4>
              <p className="text-slate-500 text-sm">Quando uma venda for processada, as tentativas de entrega aparecerão aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold">Pedido</th>
                    <th className="text-left px-6 py-4 font-semibold">Produto</th>
                    <th className="text-left px-6 py-4 font-semibold">URL</th>
                    <th className="text-center px-6 py-4 font-semibold">Tentativa</th>
                    <th className="text-center px-6 py-4 font-semibold">HTTP</th>
                    <th className="text-center px-6 py-4 font-semibold">Status</th>
                    <th className="text-right px-6 py-4 font-semibold">Data</th>
                    <th className="text-center px-6 py-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{log.order?.customer_name || '—'}</p>
                          <p className="text-xs text-slate-400 font-mono">{log.order_id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{log.product?.name || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                          {log.webhook_url?.replace(/^https?:\/\//, '').slice(0, 30)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700">#{log.attempt_number}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {log.response_status ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                            log.response_status < 300 ? 'bg-emerald-50 text-emerald-700' :
                            log.response_status < 500 ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {log.response_status}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle className="w-3 h-3" /> Falhou
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs">
                        {new Date(log.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!log.success && log.order?.webhook_status === 'failed' && (
                          <button
                            onClick={() => handleRetry(log.order_id)}
                            disabled={retrying === log.order_id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
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
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Webhooks falhando?</h4>
              <p className="text-sm text-slate-600">
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
