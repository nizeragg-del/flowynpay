"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import { login, signup } from '@/app/auth/actions'

interface ClientAuthPanelProps {
  initialError?: string;
  initialType?: string;
  initialSuccess?: string;
}

export function ClientAuthPanel({ initialError, initialType, initialSuccess }: ClientAuthPanelProps) {
  const [isLogin, setIsLogin] = useState(initialType !== 'register')

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e88a]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl md:h-[660px] min-h-[560px] bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">

        {/* MOBILE: Toggle buttons */}
        <div className="flex md:hidden w-full border-b border-white/10 p-2 gap-2 bg-[#0d0d0d]">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Criar Conta
          </button>
        </div>

        {/* --- SIGN IN FORM --- */}
        <div className={`w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute md:top-0 md:right-0
          ${isLogin ? 'block md:z-20 md:translate-x-0 md:opacity-100' : 'hidden md:flex md:z-10 md:translate-x-[20%] md:opacity-0'}
        `}>
          <div className="w-full max-w-sm mx-auto">
            <Link href="/" className="flex items-center mb-8">
              <img src="/logo2.png" alt="Flowyn" className="h-20 w-auto" />
            </Link>
            <h2 className="text-3xl font-extrabold text-white mb-2">Acesse sua conta</h2>
            <p className="text-sm text-white/50 mb-8">Bem-vindo de volta! Sinta o fluxo do seu negócio.</p>

            <form action={login} className="space-y-6">
              {isLogin && initialSuccess === 'registered' && (
                <div className="bg-[#00e88a]/10 text-[#00e88a] p-4 rounded-xl text-sm flex items-start gap-3 border border-[#00e88a]/30">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Conta criada com sucesso! 🎉</p>
                    <p className="text-[#00e88a]/70 text-xs mt-0.5">Verifique seu e-mail para confirmar a conta.</p>
                  </div>
                </div>
              )}
              {isLogin && initialSuccess === 'email_confirmed' && (
                <div className="bg-[#00e88a]/10 text-[#00e88a] p-4 rounded-xl text-sm flex items-start gap-3 border border-[#00e88a]/30">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">E-mail confirmado! ✅</p>
                    <p className="text-[#00e88a]/70 text-xs mt-0.5">Sua conta está ativa. Faça login para acessar.</p>
                  </div>
                </div>
              )}
              {isLogin && initialSuccess === 'password_reset' && (
                <div className="bg-[#00e88a]/10 text-[#00e88a] p-4 rounded-xl text-sm flex items-start gap-3 border border-[#00e88a]/30">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Senha redefinida! 🔒</p>
                  </div>
                </div>
              )}
              {isLogin && initialError && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {initialError}
                </div>
              )}
              <div>
                <label htmlFor="email_login" className="block text-sm font-semibold text-white/80 mb-2">E-mail</label>
                <input
                  id="email_login"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium"
                  placeholder="voce@email.com"
                />
              </div>
              <div>
                <label htmlFor="password_login" className="block text-sm font-semibold text-white/80 mb-2">Senha</label>
                <input
                  id="password_login"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/20 bg-[#0a0a0a] text-[#00e88a] focus:ring-[#00e88a] h-4 w-4" />
                  Lembrar de mim
                </label>
                <a href="/forgot-password" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Esqueceu a senha?</a>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,232,138,0.3)] hover:shadow-[0_0_30px_rgba(0,232,138,0.5)] hover:-translate-y-0.5 transition-all"
              >
                Entrar na Plataforma
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* --- SIGN UP FORM --- */}
        <div className={`w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute md:top-0 md:left-0
          ${!isLogin ? 'block md:z-20 md:translate-x-0 md:opacity-100' : 'hidden md:flex md:z-10 md:-translate-x-[20%] md:opacity-0'}
        `}>
          <div className="w-full max-w-sm mx-auto">
            <Link href="/" className="flex items-center mb-6">
              <img src="/logo2.png" alt="Flowyn" className="h-20 w-auto" />
            </Link>
            <h2 className="text-3xl font-extrabold text-white mb-2">Crie sua conta grátis</h2>
            <p className="text-sm text-white/50 mb-6">Crie produtos, venda e ganhe comissões — tudo em um lugar.</p>

            {/* Benefits */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Zap className="w-3.5 h-3.5 text-[#00e88a]" />
                <span>Crie produtos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <TrendingUp className="w-3.5 h-3.5 text-[#00e88a]" />
                <span>Ganhe comissões</span>
              </div>
            </div>

            <form action={signup} className="space-y-4">
              {!isLogin && initialError && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {initialError}
                </div>
              )}

              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-white/80 mb-1">Nome Completo</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-2.5 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium"
                  placeholder="João da Silva"
                />
              </div>
              <div>
                <label htmlFor="email_register" className="block text-sm font-semibold text-white/80 mb-1">E-mail</label>
                <input
                  id="email_register"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-2.5 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium"
                  placeholder="voce@email.com"
                />
              </div>
              <div>
                <label htmlFor="password_register" className="block text-sm font-semibold text-white/80 mb-1">Senha</label>
                <input
                  id="password_register"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-2.5 text-white placeholder-white/30 focus:border-[#00e88a] focus:outline-none focus:ring-1 focus:ring-[#00e88a] transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black shadow-lg hover:bg-gray-200 transition-all mt-4"
              >
                Criar conta grátis
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-white/30 text-center">
                Ao criar sua conta você concorda com os nossos <a href="#" className="underline hover:text-white/60">Termos de Uso</a>.
              </p>
            </form>
          </div>
        </div>

        {/* --- DESKTOP ONLY: Sliding Panel --- */}
        <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className={`bg-[#050505] relative h-full w-[200%] transition-transform duration-700 ease-in-out border-l border-r border-white/5 ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#00e88a]/10 blur-[80px]"></div>
              <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#00e88a]/5 blur-[80px]"></div>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}></div>
            </div>
            <div className="absolute inset-0 w-full h-full flex">
              {/* Left Side — shows when login is open */}
              <div className="w-1/2 h-full flex flex-col justify-center items-center text-center p-12 z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLogin ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: isLogin ? 0.3 : 0 }}
                  className="w-full"
                >
                  <h2 className="text-4xl font-extrabold text-white mb-4">Ainda não tem conta?</h2>
                  <p className="text-base text-white/50 mb-8 max-w-sm mx-auto">
                    Crie produtos digitais, curso online, e-books — ou se afilie aos melhores produtos do mercado e ganhe comissões recorrentes.
                  </p>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="border border-white/20 text-white font-bold rounded-xl px-12 py-3 hover:bg-white/10 transition-all"
                  >
                    Cadastre-se grátis
                  </button>
                </motion.div>
              </div>
              {/* Right Side — shows when register is open */}
              <div className="w-1/2 h-full flex flex-col justify-center items-center text-center p-12 z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: !isLogin ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: !isLogin ? 0.3 : 0 }}
                  className="w-full"
                >
                  <h2 className="text-4xl font-extrabold text-white mb-4">Já é membro?</h2>
                  <p className="text-base text-white/50 mb-8 max-w-sm mx-auto">
                    Acesse seu painel para acompanhar comissões, vendas e seus produtos em tempo real.
                  </p>
                  <button
                    onClick={() => setIsLogin(true)}
                    className="border border-white/20 text-white font-bold rounded-xl px-12 py-3 hover:bg-white/10 transition-all"
                  >
                    Entrar na conta
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
