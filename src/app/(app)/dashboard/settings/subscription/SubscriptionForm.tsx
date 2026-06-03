"use client"

import { useState } from 'react'
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, XCircle } from 'lucide-react'

type SubscriptionFormProps = {
  defaultName: string
  defaultEmail: string
  hasActiveSubscription: boolean
}

export function SubscriptionForm({ defaultName, defaultEmail, hasActiveSubscription }: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      cpfCnpj: String(form.get('cpfCnpj') || ''),
      phone: String(form.get('phone') || ''),
      postalCode: String(form.get('postalCode') || ''),
      addressNumber: String(form.get('addressNumber') || ''),
      addressComplement: String(form.get('addressComplement') || ''),
      card: {
        holderName: String(form.get('holderName') || ''),
        number: String(form.get('cardNumber') || ''),
        expiryMonth: String(form.get('expiryMonth') || ''),
        expiryYear: String(form.get('expiryYear') || ''),
        ccv: String(form.get('ccv') || ''),
      },
    }

    const response = await fetch('/api/platform/subscription', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error || 'Nao foi possivel ativar a assinatura.')
      return
    }

    setMessage('Assinatura Flowyn Pro configurada. A primeira cobranca acontece ao fim dos 7 dias gratis.')
    window.location.reload()
  }

  if (hasActiveSubscription) {
    return (
      <div className="rounded-2xl border border-[#00e88a]/25 bg-[#00e88a]/10 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#00e88a]" />
          <div>
            <h3 className="font-bold text-white">Assinatura configurada</h3>
            <p className="mt-1 text-sm text-white/55">
              Sua conta esta liberada para criar produtos e receber vendas sem taxa da Flowyn.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <ShieldCheck className="h-4 w-4 text-[#00e88a]" />
          Cobrança segura via Asaas
        </div>
        <p className="mt-2 text-sm text-white/50">
          Os dados do cartao sao enviados diretamente para criar sua assinatura mensal. A Flowyn nao salva numero, CVV ou validade.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome completo" name="name" defaultValue={defaultName} />
        <Field label="E-mail" name="email" type="email" defaultValue={defaultEmail} />
        <Field label="CPF/CNPJ" name="cpfCnpj" placeholder="Somente numeros" />
        <Field label="Telefone" name="phone" placeholder="DDD + numero" />
        <Field label="CEP" name="postalCode" placeholder="Somente numeros" />
        <Field label="Numero" name="addressNumber" />
        <div className="md:col-span-2">
          <Field label="Complemento" name="addressComplement" required={false} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome no cartao" name="holderName" defaultValue={defaultName} />
        <Field label="Numero do cartao" name="cardNumber" placeholder="0000 0000 0000 0000" />
        <Field label="Mes" name="expiryMonth" placeholder="MM" maxLength={2} />
        <Field label="Ano" name="expiryYear" placeholder="AAAA" maxLength={4} />
        <Field label="CVV" name="ccv" placeholder="123" maxLength={4} />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-start gap-2 rounded-xl border border-[#00e88a]/30 bg-[#00e88a]/10 px-4 py-3 text-sm text-[#a7ffd7]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-5 py-4 text-sm font-black text-black transition hover:bg-[#04f294] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Ativar Flowyn Pro por R$49/mes
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue = '',
  placeholder,
  required = true,
  maxLength,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-white/45">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-[#00e88a] focus:ring-2 focus:ring-[#00e88a]/20"
      />
    </label>
  )
}
