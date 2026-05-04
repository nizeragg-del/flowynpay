import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile, changePassword } from '@/app/auth/actions'
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
} from 'lucide-react'

export default async function ProfilePage(props: {
  searchParams: Promise<{ error?: string; success?: string; tab?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const activeTab = searchParams.tab === 'security' ? 'security' : 'profile'

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Minha Conta</h1>
        <p className="text-white/50 text-sm mt-1">Gerencie seus dados pessoais e segurança</p>
      </div>

      {/* Global banners */}
      {searchParams.success === 'profile_updated' && activeTab === 'profile' && (
        <div className="bg-[#00e88a]/10 text-[#00e88a] p-4 rounded-xl text-sm flex items-start gap-3 border border-[#00e88a]/30 mb-6">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Perfil atualizado!</p>
            <p className="text-[#00e88a]/70 text-xs mt-0.5">Suas informações foram salvas com sucesso.</p>
          </div>
        </div>
      )}
      {searchParams.success === 'password_changed' && activeTab === 'security' && (
        <div className="bg-[#00e88a]/10 text-[#00e88a] p-4 rounded-xl text-sm flex items-start gap-3 border border-[#00e88a]/30 mb-6">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Senha alterada com sucesso! 🔒</p>
            <p className="text-[#00e88a]/70 text-xs mt-0.5">Sua nova senha já está ativa.</p>
          </div>
        </div>
      )}
      {searchParams.error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-500/20 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {searchParams.error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-[#0a0a0a] rounded-xl border border-white/5">
        <a
          href="/dashboard/settings/profile"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-[#111111] text-white border border-white/10 shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          <User className="w-4 h-4" />
          Dados Pessoais
        </a>
        <a
          href="/dashboard/settings/profile?tab=security"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-[#111111] text-white border border-white/10 shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Shield className="w-4 h-4" />
          Segurança
        </a>
      </div>

      {/* ─── TAB: Dados Pessoais ─── */}
      {activeTab === 'profile' && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#00e88a]/10 border border-[#00e88a]/20 flex items-center justify-center">
              <User className="w-5 h-5 text-[#00e88a]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Informações Pessoais</h2>
              <p className="text-white/40 text-xs">Esses dados são usados em contratos e notas fiscais</p>
            </div>
          </div>

          {/* Read-only: e-mail */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">E-mail da conta</label>
            <div className="block w-full rounded-xl border border-white/5 bg-[#0a0a0a]/50 px-4 py-3 text-white/40 text-sm font-medium cursor-not-allowed select-none">
              {user.email}
            </div>
            <p className="text-xs text-white/30 mt-1.5">O e-mail da conta não pode ser alterado por aqui.</p>
          </div>

          {/* Read-only: role */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Tipo de conta</label>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${
                profile?.role === 'producer'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : 'bg-[#00e88a]/10 text-[#00e88a] border-[#00e88a]/20'
              }`}>
                {profile?.role === 'producer' ? 'Produtor' : 'Afiliado'}
              </span>
            </div>
          </div>

          <form action={updateProfile} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Nome Completo
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={profile?.full_name ?? ''}
                required
                className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium text-sm"
                placeholder="João da Silva"
              />
            </div>

            <div>
              <label htmlFor="document_number" className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                CPF / CNPJ
              </label>
              <input
                id="document_number"
                name="document_number"
                type="text"
                defaultValue={profile?.document_number ?? ''}
                className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium text-sm"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Telefone / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile?.phone ?? ''}
                className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#00e88a] px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,232,138,0.2)] hover:shadow-[0_0_30px_rgba(0,232,138,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── TAB: Segurança ─── */}
      {activeTab === 'security' && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#00e88a]/10 border border-[#00e88a]/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#00e88a]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Alterar Senha</h2>
              <p className="text-white/40 text-xs">Sua nova senha deve ter pelo menos 6 caracteres</p>
            </div>
          </div>

          <form action={changePassword} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Nova senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Confirmar nova senha
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                minLength={6}
                className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all"
              >
                <Lock className="w-4 h-4" />
                Alterar senha
              </button>
            </div>
          </form>

          {/* Recuperação por e-mail */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-white/30 mb-3">Esqueceu sua senha atual?</p>
            <a
              href="/forgot-password"
              className="text-sm text-[#00e88a]/70 hover:text-[#00e88a] transition-colors font-medium"
            >
              Recuperar senha por e-mail →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
