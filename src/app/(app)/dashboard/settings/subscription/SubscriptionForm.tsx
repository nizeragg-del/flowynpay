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
      <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div>
            <h3 className="font-bold">Assinatura configurada</h3>
            <p className="mt-1 text-emerald-700/75">Sua conta esta liberada para criar produtos e receber vendas sem taxa da Flowyn.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800 ring-1 ring-orange-100">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Cobranca segura via Asaas
        </div>
        <p className="mt-2 leading-6 text-orange-800/75">
          A Flowyn nao salva numero, CVV ou validade do cartao. Os dados sao usados apenas para configurar sua assinatura.
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
        <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60">
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
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="h-12 w-full rounded-xl border-0 bg-[#f4f4f6] px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
      />
    </label>
  )
}
