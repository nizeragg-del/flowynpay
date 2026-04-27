"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AlertCircle, Rocket, Code2 } from 'lucide-react'
import { login, signup } from '@/app/auth/actions'

interface ClientAuthPanelProps {
  initialError?: string;
  initialType?: string;
}

export function ClientAuthPanel({ initialError, initialType }: ClientAuthPanelProps) {
  // Determine initial state based on type parameter
  const [isLogin, setIsLogin] = useState(initialType !== 'register')
  const [role, setRole] = useState<'affiliate' | 'producer'>(initialType === 'producer' ? 'producer' : 'affiliate')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        
        {/* Sign In Form Panel - Animates to Right */}
        <div className={`absolute top-0 right-0 w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${isLogin ? 'z-20 translate-x-0 opacity-100' : 'z-10 translate-x-[20%] opacity-0'}`}>
          <div className="w-full max-w-sm mx-auto">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary mb-8">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              Flowyn
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Acesse sua conta</h2>
            <p className="text-sm text-slate-500 mb-8">Bem-vindo de volta! Sinta o fluxo do seu negócio.</p>
            
            <form action={login} className="space-y-6">
              {isLogin && initialError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {initialError}
                </div>
              )}
              <div>
                <label htmlFor="email_login" className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  id="email_login"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="voce@email.com"
                />
              </div>
              <div>
                <label htmlFor="password_login" className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
                <input
                  id="password_login"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black h-4 w-4" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-sm font-medium text-slate-500 hover:text-black transition-colors">Esqueceu a senha?</a>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up Form Panel - Animates to Left */}
        <div className={`absolute top-0 left-0 w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${!isLogin ? 'z-20 translate-x-0 opacity-100' : 'z-10 -translate-x-[20%] opacity-0'}`}>
          <div className="w-full max-w-sm mx-auto">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary mb-6">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              Flowyn
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Crie sua conta</h2>
            <p className="text-sm text-slate-500 mb-6">Comece sua jornada de lucro hoje mesmo.</p>

            <form action={signup} className="space-y-4">
              {!isLogin && initialError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {initialError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Como deseja usar a plataforma?</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex cursor-pointer rounded-xl border p-3 transition-colors ${role === 'affiliate' ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <input type="radio" name="role" value="affiliate" className="sr-only" checked={role === 'affiliate'} onChange={() => setRole('affiliate')} />
                    <span className="flex flex-col">
                      <Rocket className={`h-5 w-5 mb-1 ${role === 'affiliate' ? 'text-black' : 'text-slate-400'}`} />
                      <span className="block text-sm font-bold text-slate-900">Afiliado</span>
                    </span>
                  </label>
                  <label className={`relative flex cursor-pointer rounded-xl border p-3 transition-colors ${role === 'producer' ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <input type="radio" name="role" value="producer" className="sr-only" checked={role === 'producer'} onChange={() => setRole('producer')} />
                    <span className="flex flex-col">
                      <Code2 className={`h-5 w-5 mb-1 ${role === 'producer' ? 'text-black' : 'text-slate-400'}`} />
                      <span className="block text-sm font-bold text-slate-900">Produtor</span>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label htmlFor="email_register" className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  id="email_register"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <label htmlFor="password_register" className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
                <input
                  id="password_register"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all mt-6"
              >
                Criar conta grátis
              </button>
            </form>
          </div>
        </div>

        {/* Overlay Container - Animates Left/Right over the forms */}
        <div className={`absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className={`bg-slate-900 relative h-full w-[200%] transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}>
            {/* Visual background details */}
            <div className="absolute inset-0 z-0 overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-slate-700/30 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"></div>
            </div>

            {/* Inner Content that counter-animates to stay centered visually */}
            <div className="absolute inset-0 w-full h-full flex">
              {/* Left Side (Shows when Register is open, Overlay is on Right) 
                  Wait, if isLogin = false, the overlay moves to Right (`translate-x-full`),
                  and the inner container moves Left (`-translate-x-1/2`).
                  So we see the Right half of the inner container.
              */}
              
              <div className="w-1/2 h-full flex flex-col justify-center items-center text-center p-12 z-10">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLogin ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isLogin ? 0.3 : 0 }}
                    className="w-full"
                  >
                    <h2 className="text-4xl font-bold text-white mb-6">Ainda não tem conta?</h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-sm mx-auto">
                      Junte-se à Flowyn e comece sua jornada para aumentar suas conversões B2B.
                    </p>
                    <button 
                      onClick={() => setIsLogin(false)}
                      className="border-2 border-white text-white font-bold rounded-full px-12 py-3 hover:bg-white hover:text-black transition-all"
                    >
                      Cadastre-se
                    </button>
                  </motion.div>
              </div>

              {/* Right Side (Shows when isLogin = false, Overlay is on Right) */}
              <div className="w-1/2 h-full flex flex-col justify-center items-center text-center p-12 z-10">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: !isLogin ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: !isLogin ? 0.3 : 0 }}
                    className="w-full"
                  >
                    <h2 className="text-4xl font-bold text-white mb-6">Já é membro?</h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-sm mx-auto">
                      Gerencie seu MRR em um só lugar com acesso imediato ao seu painel.
                    </p>
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="border-2 border-white text-white font-bold rounded-full px-12 py-3 hover:bg-white hover:text-black transition-all"
                    >
                      Entrar
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
