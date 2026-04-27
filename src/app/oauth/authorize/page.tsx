import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { loginForOAuth } from './actions'

export default async function OAuthAuthorizePage(props: {
  searchParams: Promise<{ client_id?: string; redirect_uri?: string; state?: string; error?: string }>
}) {
  const searchParams = await props.searchParams
  const { client_id, redirect_uri, state, error: urlError } = searchParams

  if (!client_id || !redirect_uri) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Parâmetros Inválidos</h1>
          <p className="text-slate-600">A solicitação de login está incompleta. Faltam parâmetros obrigatórios (client_id ou redirect_uri).</p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Verify the client_id exists
  const { data: app, error: appError } = await supabase
    .from('oauth_applications')
    .select('*, products(name)')
    .eq('client_id', client_id)
    .single()

  if (appError || !app) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Aplicativo não encontrado</h1>
          <p className="text-slate-600">O Client ID fornecido é inválido ou o aplicativo foi removido.</p>
        </div>
      </div>
    )
  }

  // If redirect_uri doesn't match the registered ones (basic security check)
  // We should enforce it, but for development we might just allow it if the array is empty
  if (app.redirect_uris && app.redirect_uris.length > 0) {
    if (!app.redirect_uris.includes(redirect_uri)) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Redirect URI Inválida</h1>
            <p className="text-slate-600">A URL de redirecionamento não está autorizada para este aplicativo.</p>
          </div>
        </div>
      )
    }
  }

  const { data: { user } } = await supabase.auth.getUser()

  // If user is NOT logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Entrar com Flowyn</h1>
          <p className="text-slate-500 mt-2">Faça login para continuar para <strong>{app.products?.name}</strong></p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <form action={loginForOAuth} className="space-y-5">
            <input type="hidden" name="client_id" value={client_id} />
            <input type="hidden" name="redirect_uri" value={redirect_uri} />
            {state && <input type="hidden" name="state" value={state} />}

            {urlError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {urlError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Fazer Login
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-xs text-slate-400 max-w-xs text-center">
          Ao fazer login, você concorda com os Termos de Serviço e Política de Privacidade da Flowyn.
        </p>
      </div>
    )
  }

  // User IS logged in. Verify if they have an active purchase for this product.
  // We need to check orders.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, plans(plan_identifier, name)')
    .eq('customer_user_id', user.id)
    .eq('product_id', app.product_id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Acesso Negado</h1>
          <p className="text-slate-600 mb-8">
            Você não possui uma assinatura ou compra ativa para <strong>{app.products?.name}</strong> vinculada à esta conta.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-1">Logado como:</p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
          <div className="mt-6">
             <form action={loginForOAuth} className="inline">
                {/* A hack to allow sign out and retry - we'd need a signout action */}
             </form>
          </div>
        </div>
      </div>
    )
  }

  // The user has access! Render the Authorization approval screen.
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg relative z-10">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <div className="w-12 h-1 bg-slate-200 relative -mx-4 rounded-full">
             <div className="absolute inset-0 bg-gradient-to-r from-black to-primary animate-pulse rounded-full"></div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg relative z-10 text-white font-bold text-xl">
            {app.products?.name?.substring(0, 2).toUpperCase()}
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-2">
          Autorizar Acesso
        </h1>
        <p className="text-slate-500 text-center mb-8">
          <strong>{app.products?.name}</strong> deseja acessar sua conta da Flowyn.
        </p>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            Informações compartilhadas:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Seu nome e endereço de e-mail (<strong>{user.email}</strong>)</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Status da sua assinatura (Plano <strong>{order.plans?.name}</strong>)</span>
            </li>
          </ul>
        </div>

        <form action={`/api/oauth/authorize/approve`} method="POST" className="space-y-3">
          <input type="hidden" name="client_id" value={client_id} />
          <input type="hidden" name="redirect_uri" value={redirect_uri} />
          {state && <input type="hidden" name="state" value={state} />}
          <input type="hidden" name="order_id" value={order.id} />
          
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            Autorizar e Continuar
          </button>
          
          <Link 
            href="/"
            className="block w-full text-center rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  )
}
