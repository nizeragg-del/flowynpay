"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Code2, Rocket, Link2, ShieldCheck, Zap, FastForward, Blocks, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      {/* Navigation */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-slate-100/50 backdrop-blur-xl fixed top-0 w-full z-50 bg-white/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-black">Flowyn</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-black transition-colors">
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-bold bg-black text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Começar Agora
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-40 pb-20 px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-100 rounded-full blur-3xl opacity-50 -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-sm font-semibold mb-8 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Liberte o Fluxo do seu SaaS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-8 leading-[1.05] text-black">
              O Fluxo de Vendas Perfeito para o seu SaaS.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Transforme visitantes em assinantes sem atrito. A plataforma que coloca o seu MRR no piloto automático com checkout invisível e integrações em 3 minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register?type=producer" 
                className="group flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-black text-white font-bold text-lg hover:bg-slate-900 transition-all shadow-2xl hover:shadow-black/20 w-full sm:w-auto overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10">Criar Conta como Produtor</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/register?type=affiliate" 
                className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-lg hover:border-black/20 hover:bg-slate-50 transition-all w-full sm:w-auto"
              >
                <BarChart3 className="h-5 w-5 text-slate-400" />
                Quero ser Afiliado
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400 font-medium tracking-wide text-center">
              Nenhum cartão de crédito necessário • Sem mensalidades
            </p>
          </motion.div>
        </section>

        {/* Video VSL Section */}
        <section className="px-6 md:px-12 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative aspect-video rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group cursor-pointer">
              {/* Fake Video Player UI */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800/80 to-slate-900 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/20">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/50 text-sm font-medium">
                <span>00:00 / 04:32</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="mt-16 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
                Empresas que confiam no fluxo
              </p>
              <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="text-xl font-black tracking-tighter">Acme Corp</div>
                <div className="text-xl font-bold tracking-tight">Globex</div>
                <div className="text-xl font-semibold tracking-wide">Soylent</div>
                <div className="text-xl font-bold italic">Initech</div>
                <div className="text-xl font-black">Umbrella</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contrast / Pain Section */}
        <section className="bg-black text-white py-32 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Integrações quebradas matam o seu produto.
                </h2>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8">
                  Chega de noites em claro configurando webhooks complexos e cruzando os dedos para o pagamento cair. 
                  A Flowyn tira o "tecniquês" da jogada.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Zap className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">No-Code em 3 Minutos</h4>
                      <p className="text-slate-500 text-sm">Integração nativa de cliques via Make.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Split Financeiro Nativo</h4>
                      <p className="text-slate-500 text-sm">O dinheiro do afiliado e do produtor se separam na raiz.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                <div className="space-y-6 relative z-10">
                   {/* Fake Make.com Flow */}
                   <div className="bg-slate-950 p-4 rounded-2xl flex items-center justify-between border border-slate-800">
                     <div className="flex items-center gap-3">
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="font-mono text-sm text-slate-300">Venda Aprovada (Flowyn)</span>
                     </div>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="w-0.5 h-6 bg-slate-800 mx-auto" />
                   <div className="bg-slate-950 p-4 rounded-2xl flex items-center justify-between border border-slate-800">
                     <span className="font-mono text-sm text-slate-300 pl-5">Rotear Pagamento</span>
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="w-0.5 h-6 bg-slate-800 mx-auto" />
                   <div className="bg-[#1A1A1A] p-4 rounded-2xl flex items-center justify-between border border-slate-700 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                     <div className="flex items-center gap-3">
                       <Blocks className="w-5 h-5 text-emerald-400" />
                       <span className="font-bold text-white tracking-wide">Criar Acesso no Supabase</span>
                     </div>
                     <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">SUCCESS</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-32 px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-black">Pronto para acelerar?</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">Crie sua conta agora e lance seu primeiro produto ou comece a promover plataformas de alta conversão hoje mesmo.</p>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-black text-white font-black text-xl hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
          >
            Entrar no Fluxo
            <ArrowRight className="h-6 w-6" />
          </Link>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
          <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-black">Flowyn</span>
        </div>
        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Flowyn. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
