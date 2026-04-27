'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, Lock, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react'

function AcceptInviteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [siteUrl, setSiteUrl] = useState<string | null>(null)
  const [productName, setProductName] = useState<string>('')
  const [error, setError] = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Listen for the invite token being processed from the URL hash
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
        setSessionReady(true)
      }
    })

    // Also check if session is already active
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Once session is ready, fetch the product's site_url using the order_id
  useEffect(() => {
    if (!sessionReady || !orderId) return

    const supabase = createClient()
    supabase
      .from('orders')
      .select('id, product:products(name, site_url)')
      .eq('id', orderId)
      .single()
      .then(({ data }) => {
        const product = data?.product as any
        if (product?.site_url) setSiteUrl(product.site_url)
        if (product?.name) setProductName(product.name)
      })
  }, [sessionReady, orderId])

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Erro ao definir a senha: ' + updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)

    // Redirect to producer's SaaS after a short delay
    setTimeout(() => {
      if (siteUrl) {
        window.location.href = siteUrl
      } else {
        router.push('/dashboard')
      }
    }, 2500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Conta ativada com sucesso!
          </h1>
          <p className="text-slate-500 mb-6">
            {siteUrl
              ? `Redirecionando para ${productName || 'o produto'}...`
              : 'Redirecionando para o painel...'}
          </p>
          {siteUrl && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <ExternalLink className="w-4 h-4" />
              <span className="truncate max-w-xs">{siteUrl}</span>
            </div>
          )}
          <div className="mt-6 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full animate-[progress_2.5s_linear_forwards]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Crie sua senha
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {productName
              ? `Defina uma senha para acessar ${productName}`
              : 'Bem-vindo! Defina uma senha segura para acessar sua conta.'}
          </p>
          {siteUrl && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle className="w-3.5 h-3.5" />
              Você será redirecionado após ativar
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSetPassword} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {!sessionReady && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              Verificando seu token de convite...
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nova senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                disabled={!sessionReady}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirmar senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repita a senha"
              disabled={!sessionReady}
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ativando sua conta...
              </>
            ) : (
              'Ativar minha conta'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Ao continuar, você concorda com os termos de uso da plataforma Flowyn.
        </p>
      </div>
    </div>
  )
}

// Suspense boundary needed for useSearchParams
export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    }>
      <AcceptInviteForm />
    </Suspense>
  )
}
