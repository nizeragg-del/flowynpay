'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2, ShieldCheck, Mail, User as UserIcon, Lock } from 'lucide-react'

// Load Stripe outside of component to avoid recreating it on re-renders
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface OrderBumpData {
  active: boolean
  title: string | null
  description: string | null
  price: number | null
  discountPercent: number | null
  imageUrl: string | null
}

interface CheckoutFormProps {
  planId: string
  productId: string
  amount: number
  commissionRate: number
  affiliateId: string | null
  trackingId: string | null
  pixels: { platform: string; pixel_id: string }[]
  orderBump: OrderBumpData
}

// ─── Inner form that uses Stripe hooks ────────────────────────────────────────

interface PaymentFormProps {
  planId: string
  amount: number
  affiliateId: string | null
  trackingId: string | null
  addOrderBump: boolean
  paymentIntentId: string | null
  orderBump: OrderBumpData
  onOrderBumpChange: (val: boolean) => void
}

function PaymentForm({
  planId,
  amount,
  affiliateId,
  trackingId,
  addOrderBump,
  paymentIntentId,
  orderBump,
  onOrderBumpChange,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate total for display
  const bumpPrice =
    addOrderBump && orderBump.price
      ? orderBump.discountPercent && orderBump.discountPercent > 0
        ? Number(orderBump.price) * (1 - orderBump.discountPercent / 100)
        : Number(orderBump.price)
      : 0
  const totalAmount = amount + bumpPrice

  // Update DOM total amount in the sidebar
  useEffect(() => {
    const el = document.getElementById('checkout-total-amount')
    if (el) {
      el.innerText = `R$ ${totalAmount.toFixed(2).replace('.', ',')}`
    }
  }, [totalAmount])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const origin = window.location.origin

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/checkout/success`,
      },
    })

    // If we reach here, an error occurred (success redirects away)
    if (stripeError) {
      if (stripeError.type !== 'validation_error') {
        setError(stripeError.message || 'Erro ao processar pagamento.')
      }
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Compra Realizada! 🎉</h2>
        <p className="text-slate-500 mb-6">
          Sua compra foi processada com sucesso. Verifique seu e-mail para as instruções de acesso.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
          Em breve você receberá os dados de acesso no seu e-mail.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order Bump Section */}
      {orderBump.active && orderBump.price && (
        <div
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            addOrderBump
              ? 'bg-primary/5 border-primary'
              : 'bg-slate-50 border-slate-200 border-dashed hover:border-primary/50'
          }`}
          onClick={() => onOrderBumpChange(!addOrderBump)}
        >
          <div className="flex gap-3">
            <div className="pt-1 shrink-0">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  addOrderBump ? 'bg-primary border-primary' : 'bg-white border-slate-300'
                }`}
              >
                {addOrderBump && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            {orderBump.imageUrl && (
              <div className="shrink-0">
                <img
                  src={orderBump.imageUrl}
                  alt="Order Bump"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-wider">
                  Oferta Especial
                </span>
              </div>
              <h4 className="font-bold text-slate-900 leading-tight mb-1">
                {orderBump.title || 'Adicionar ao pedido'}
              </h4>
              <p className="text-sm text-slate-600 mb-2">{orderBump.description}</p>
              {orderBump.discountPercent && orderBump.discountPercent > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 line-through">
                    R$ {Number(orderBump.price).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="font-bold text-emerald-600">
                    R$ {(Number(orderBump.price) * (1 - orderBump.discountPercent / 100)).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-emerald-600">
                  R$ {Number(orderBump.price).toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stripe PaymentElement - renders card fields, Apple Pay, Google Pay */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Forma de Pagamento
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: { billingDetails: { name: 'auto', email: 'never' } },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar R$ {totalAmount.toFixed(2).replace('.', ',')}
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 mt-3">
        🔒 Pagamento 100% seguro com criptografia SSL pelo Stripe.
      </p>
    </form>
  )
}

// ─── Outer wrapper: fetches clientSecret and initialises Elements ──────────────

export function CheckoutForm({
  planId,
  productId,
  amount,
  commissionRate,
  affiliateId,
  trackingId,
  pixels,
  orderBump,
}: CheckoutFormProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [addOrderBump, setAddOrderBump] = useState(false)
  const [loadingIntent, setLoadingIntent] = useState(false)
  const [intentError, setIntentError] = useState<string | null>(null)

  // Form fields
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  // When user toggles Order Bump AFTER intent is created, update the existing intent
  useEffect(() => {
    if (!paymentIntentId) return

    const updateAmount = async () => {
      await fetch('/api/checkout/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          customer_email: customerEmail,
          add_order_bump: addOrderBump,
          payment_intent_id: paymentIntentId,
        }),
      })
    }
    updateAmount()
  }, [addOrderBump, paymentIntentId])

  async function handleInfoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingIntent(true)
    setIntentError(null)

    try {
      const res = await fetch('/api/checkout/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          customer_name: customerName,
          customer_email: customerEmail,
          affiliate_id: affiliateId,
          tracking_id: trackingId,
          add_order_bump: addOrderBump,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setIntentError(data.error || 'Erro ao iniciar pagamento.')
        setLoadingIntent(false)
        return
      }

      setClientSecret(data.client_secret)
      setPaymentIntentId(data.payment_intent_id)
      setStep('payment')
    } catch {
      setIntentError('Erro de conexão. Verifique sua internet e tente novamente.')
    }

    setLoadingIntent(false)
  }

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none'

  // Step 1: Personal info + Order Bump selection
  if (step === 'info') {
    // Calculate display total
    const bumpPrice =
      addOrderBump && orderBump.price
        ? orderBump.discountPercent && orderBump.discountPercent > 0
          ? Number(orderBump.price) * (1 - orderBump.discountPercent / 100)
          : Number(orderBump.price)
        : 0
    const totalAmount = amount + bumpPrice

    // Update sidebar total
    if (typeof document !== 'undefined') {
      const el = document.getElementById('checkout-total-amount')
      if (el) el.innerText = `R$ ${totalAmount.toFixed(2).replace('.', ',')}`
    }

    return (
      <form onSubmit={handleInfoSubmit} className="space-y-5">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-semibold text-slate-700 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <UserIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="customer_name"
              required
              placeholder="Seu nome completo"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-semibold text-slate-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="email"
              id="customer_email"
              required
              placeholder="seu@email.com"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Order Bump */}
        {orderBump.active && orderBump.price && (
          <div
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              addOrderBump
                ? 'bg-primary/5 border-primary'
                : 'bg-slate-50 border-slate-200 border-dashed hover:border-primary/50'
            }`}
            onClick={() => setAddOrderBump(!addOrderBump)}
          >
            <div className="flex gap-3">
              <div className="pt-1 shrink-0">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    addOrderBump ? 'bg-primary border-primary' : 'bg-white border-slate-300'
                  }`}
                >
                  {addOrderBump && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              {orderBump.imageUrl && (
                <div className="shrink-0">
                  <img
                    src={orderBump.imageUrl}
                    alt="Order Bump"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-wider">
                    Oferta Especial
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-tight mb-1">
                  {orderBump.title || 'Adicionar ao pedido'}
                </h4>
                <p className="text-sm text-slate-600 mb-2">{orderBump.description}</p>
                {orderBump.discountPercent && orderBump.discountPercent > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400 line-through">
                      R$ {Number(orderBump.price).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="font-bold text-emerald-600">
                      R$ {(Number(orderBump.price) * (1 - orderBump.discountPercent / 100)).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-emerald-600">
                    R$ {Number(orderBump.price).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {intentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {intentError}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingIntent}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-2"
        >
          {loadingIntent ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Carregando pagamento...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Continuar para Pagamento
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-3">
          🔒 Pagamento 100% seguro com criptografia SSL pelo Stripe.
        </p>
      </form>
    )
  }

  // Step 2: Stripe PaymentElement
  if (!clientSecret) return null

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#7c3aed',
      colorBackground: '#f8fafc',
      colorText: '#0f172a',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '12px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #7c3aed',
        boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
      },
      '.Tab': {
        border: '1px solid #e2e8f0',
      },
      '.Tab--selected': {
        border: '1px solid #7c3aed',
        color: '#7c3aed',
      },
    },
  }

  return (
    <div className="space-y-4">
      {/* Back button + summary */}
      <button
        onClick={() => setStep('info')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-2"
      >
        ← Voltar e editar dados
      </button>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 space-y-1">
        <p><span className="font-semibold text-slate-900">Nome:</span> {customerName}</p>
        <p><span className="font-semibold text-slate-900">E-mail:</span> {customerEmail}</p>
      </div>

      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <PaymentForm
          planId={planId}
          amount={amount}
          affiliateId={affiliateId}
          trackingId={trackingId}
          addOrderBump={addOrderBump}
          paymentIntentId={paymentIntentId}
          orderBump={orderBump}
          onOrderBumpChange={setAddOrderBump}
        />
      </Elements>
    </div>
  )
}
