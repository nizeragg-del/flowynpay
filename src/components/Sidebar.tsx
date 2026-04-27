"use client"

import Link from 'next/link'
import { signOutAction } from '@/app/(app)/actions'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, Box, Link2, Bell, User, Settings, LogOut, DollarSign, Webhook, CreditCard, BookOpen } from 'lucide-react'

// Receives props from the server layout
export function Sidebar({ isAffiliate, isProducer }: { isAffiliate: boolean, isProducer: boolean }) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="w-full md:w-64 bg-sidebar text-white shadow-xl flex-shrink-0 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3 font-bold text-2xl tracking-tighter cursor-pointer">
         <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
           <span className="text-white">F</span>
         </div>
         Flowyn
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>

        {isAffiliate && (
          <>
            <div className="pt-4 pb-2">
              <span className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Afiliado</span>
            </div>
            <Link href="/market" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/market') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Store className="w-5 h-5" />
              <span className="font-medium text-sm">Mercado</span>
            </Link>
            <Link href="/dashboard/affiliations" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/affiliations') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Link2 className="w-5 h-5" />
              <span className="font-medium text-sm">Minhas Afiliações</span>
            </Link>
            <Link href="/dashboard/sales" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/sales') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <DollarSign className="w-5 h-5" />
              <span className="font-medium text-sm">Minhas Comissões</span>
            </Link>
          </>
        )}

        {isProducer && (
          <>
            <div className="pt-4 pb-2">
              <span className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Produtor</span>
            </div>
            <Link href="/dashboard/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/products') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Box className="w-5 h-5" />
              <span className="font-medium text-sm">Meus Produtos</span>
            </Link>
            <Link href="/dashboard/sales" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/sales') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <DollarSign className="w-5 h-5" />
              <span className="font-medium text-sm">Vendas</span>
            </Link>
            <Link href="/dashboard/webhooks" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/webhooks') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Webhook className="w-5 h-5" />
              <span className="font-medium text-sm">Webhooks</span>
            </Link>
            <Link href="/developers/webhooks" target="_blank" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ml-2 ${isActive('/developers/webhooks') ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <BookOpen className="w-4 h-4 ml-1" />
              <span className="font-medium text-sm">Guia de Integração</span>
            </Link>
          </>
        )}

        <div className="pt-4 pb-2">
          <span className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Configurações</span>
        </div>
        <Link href="/dashboard/settings/payments" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/settings') ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
          <CreditCard className="w-5 h-5" />
          <span className="font-medium text-sm">Pagamentos</span>
        </Link>
        <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/80 hover:bg-white/10 hover:text-white`}>
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Conta</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
         <form action={signOutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sair da Conta</span>
            </button>
         </form>
      </div>
    </aside>
  )
}
