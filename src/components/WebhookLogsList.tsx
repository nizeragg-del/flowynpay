import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export function WebhookLogsList({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center text-white/50 text-sm shadow-xl">
        Nenhum webhook foi enviado ainda. Realize uma simulação ou aguarde vendas reais.
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-xl overflow-hidden mb-10">
      <div className="p-5 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Histórico de Entregas</h3>
          <p className="text-xs text-white/50">Últimos {logs.length} eventos disparados</p>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0a0a0a] text-white/40 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Evento</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Código HTTP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00e88a]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-medium ${log.success ? 'text-[#00e88a]' : 'text-red-500'}`}>
                      {log.success ? 'Entregue' : 'Falhou'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-full text-xs font-semibold">
                    {log.request_payload?.event || 'purchase.created'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {log.order_id ? (
                    <span className="font-mono text-xs text-white/50">{log.order_id.split('-')[0]}...</span>
                  ) : (
                    <span className="bg-[#00e88a]/10 border border-[#00e88a]/20 text-[#00e88a] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Teste Ping</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {log.response_status ? (
                    <span className={`font-mono text-xs px-2 py-1 rounded ${log.response_status >= 200 && log.response_status < 300 ? 'bg-[#00e88a]/10 text-[#00e88a]' : 'bg-red-500/10 text-red-500'}`}>
                      HTTP {log.response_status}
                    </span>
                  ) : (
                    <span className="text-white/40 text-xs italic">Timeout/Error</span>
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
