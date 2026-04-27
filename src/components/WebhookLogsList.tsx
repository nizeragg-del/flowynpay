import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export function WebhookLogsList({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
        Nenhum webhook foi enviado ainda. Realize uma simulação ou aguarde vendas reais.
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Histórico de Entregas</h3>
          <p className="text-xs text-slate-500">Últimos {logs.length} eventos disparados</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Evento</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Código HTTP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-medium ${log.success ? 'text-emerald-700' : 'text-red-700'}`}>
                      {log.success ? 'Entregue' : 'Falhou'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    {log.request_payload?.event || 'purchase.created'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {log.order_id ? (
                    <span className="font-mono text-xs text-slate-500">{log.order_id.split('-')[0]}...</span>
                  ) : (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Teste Ping</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {log.response_status ? (
                    <span className={`font-mono text-xs px-2 py-1 rounded ${log.response_status >= 200 && log.response_status < 300 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      HTTP {log.response_status}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Timeout/Error</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
