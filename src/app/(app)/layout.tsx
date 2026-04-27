import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, User } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAffiliate = profile?.role === 'affiliate'
  const isProducer = profile?.role === 'producer'

  return (
    <div className="min-h-screen bg-[#fbf0fb] text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar - Client Component */}
      <Sidebar isAffiliate={isAffiliate} isProducer={isProducer} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
           <div className="flex items-center">
             {/* Left side spacer */}
           </div>
           
           <div className="flex items-center gap-6">
             <button className="text-slate-400 hover:text-slate-700 transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             
             <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
               <div className="hidden md:block text-right">
                 <p className="font-bold text-sm text-slate-900 leading-none">{profile?.full_name || user.email}</p>
                 <p className="text-xs text-slate-500 mt-1 capitalize">{profile?.role || 'User'}</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-5 h-5 text-primary" />
               </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
