"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Bell, User, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface AppLayoutUIProps {
  children: React.ReactNode
  profile: any
  user: any
  isAffiliate: boolean
  isProducer: boolean
}

export function AppLayoutUI({ children, profile, user, isAffiliate, isProducer }: AppLayoutUIProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row relative">
      
      {/* Background Noise for the whole dashboard */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0 z-20">
        <Sidebar isAffiliate={isAffiliate} isProducer={isProducer} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden flex"
              onClick={(e) => {
                // If they click a link inside the sidebar, close the menu
                if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).closest('a')) {
                  setIsMobileMenuOpen(false)
                }
              }}
            >
              <Sidebar isAffiliate={isAffiliate} isProducer={isProducer} />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-[-48px] w-10 h-10 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Top Navigation */}
        <header className="h-16 md:h-20 bg-[#111111]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>
             {/* Left side spacer */}
           </div>
           
           <div className="flex items-center gap-4 md:gap-6">
             <button className="text-white/60 hover:text-white transition-colors relative">
               <Bell className="w-5 h-5 md:w-6 md:h-6" />
               <span className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-[#00e88a] rounded-full shadow-[0_0_8px_#00e88a]"></span>
             </button>
             
             <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
               <div className="hidden md:block text-right">
                 <p className="font-bold text-sm text-white leading-none">{profile?.full_name || user.email}</p>
                 <p className="text-xs text-[#00e88a] mt-1 capitalize">{profile?.role || 'User'}</p>
               </div>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#00e88a]/10 flex items-center justify-center border border-[#00e88a]/20">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-[#00e88a]" />
               </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
