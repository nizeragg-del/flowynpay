import Link from 'next/link'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CreditCard,
  Fingerprint,
  Layers3,
  LineChart,
  MousePointerClick,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  WalletCards,
  Webhook,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'Flowyn - Venda sem pagar porcentagem para a plataforma',
  description: 'Checkout transparente, afiliados e split automatico via Asaas. Teste gratis por 7 dias e depois pague apenas R$ 49 por mes.',
}

const readyFeatures = [
  { icon: MousePointerClick, title: 'Checkout transparente', text: 'Uma compra simples, direta e com a sua oferta em destaque.' },
  { icon: WalletCards, title: 'Split automatico Asaas', text: 'Produtor e afiliado recebem direto em suas wallets Asaas.' },
  { icon: ShoppingBag, title: 'Vitrine de afiliados', text: 'Publique produtos e amplie sua distribuicao com parceiros.' },
  { icon: Layers3, title: 'Order bump nativo', text: 'Aumente o ticket medio com uma oferta complementar no checkout.' },
  { icon: LineChart, title: 'Pixels de conversao', text: 'Conecte Meta, Google e TikTok aos seus planos e afiliacoes.' },
  { icon: Webhook, title: 'Webhooks com logs', text: 'Integre entregas, acompanhe tentativas e reenvie notificacoes.' },
  { icon: PackageCheck, title: 'Entrega automatica', text: 'Envie links e arquivos automaticamente depois da confirmacao.' },
  { icon: BarChart3, title: 'Visao de vendas', text: 'Acompanhe faturamento, comissoes e pedidos por produto.' },
]

const comparisonRows = [
  ['Comissao da plataforma', '0%', 'ate 10% + valor fixo'],
  ['Mensalidade', 'R$ 49', 'geralmente R$ 0'],
  ['Split para afiliados', 'Automatico via Asaas', 'Varia por plataforma'],
  ['Recebimento', 'Wallet Asaas do usuario', 'Saldo interno ou repasse'],
  ['Primeiros dias', '7 dias gratis', 'Varia por plataforma'],
]

const savingsRows = [
  ['Faturamento bruto', 'R$ 5.000,00', 'R$ 5.000,00'],
  ['Taxa da plataforma', 'R$ 49,00', 'R$ 574,00'],
  ['Economia estimada', 'R$ 525,00', '-'],
]

export default function Home() {
  return (
    <main className="sales-page min-h-screen bg-[#070908] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070908]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <img src="/logo2.png" alt="Flowyn" className="h-11 w-auto" />
          <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            <a href="#vantagens" className="hover:text-white">Vantagens</a>
            <a href="#comparativo" className="hover:text-white">Comparativo</a>
            <a href="#recursos" className="hover:text-white">Recursos</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-white/70 hover:text-white sm:inline">Entrar</Link>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#00e88a] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#00d77f]">
              Testar gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div className="sales-reveal">
            <div className="sales-reveal sales-delay-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[#00e88a]/30 bg-[#00e88a]/10 px-3 py-1.5 text-xs font-bold text-[#00e88a]">
              <Sparkles className="h-3.5 w-3.5" /> 7 dias gratis. Depois, R$ 49 por mes.
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Venda mais sem entregar uma porcentagem do seu faturamento.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Checkout transparente, afiliados e split automatico via Asaas. A Flowyn nao cobra taxa por venda: voce paga apenas uma mensalidade previsivel e as tarifas financeiras da Asaas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00e88a] px-6 py-3.5 font-bold text-black hover:bg-[#00d77f]">
                Comecar teste de 7 dias <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#comparativo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3.5 font-bold text-white hover:bg-white/5">
                Ver quanto economizo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> Sem taxa Flowyn por venda</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> Cancele quando quiser</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> CPF ou CNPJ</span>
            </div>
          </div>

          <div className="sales-float sales-reveal sales-delay-2 overflow-hidden rounded-lg border border-white/10 bg-[#101412] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-white/40">Venda aprovada</p>
                <p className="mt-1 text-2xl font-black">R$ 197,00</p>
              </div>
              <div className="rounded-full bg-[#00e88a]/10 p-3 text-[#00e88a]"><BadgeCheck className="h-6 w-6" /></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="mb-4 flex items-center justify-between text-sm"><span className="text-white/50">Split automatico</span><span className="font-bold text-[#00e88a]">Asaas conectado</span></div>
                <div className="space-y-3">
                  <SplitRow label="Produtor" value="R$ 118,20" width="60%" delay="0ms" />
                  <SplitRow label="Afiliado" value="R$ 78,80" width="40%" delay="240ms" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Taxa Flowyn" value="R$ 0,00" />
                <Metric label="Repasse manual" value="Nenhum" />
              </div>
              <p className="text-xs leading-5 text-white/40">Exemplo ilustrativo antes das tarifas financeiras aplicaveis da Asaas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="vantagens" className="border-b border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-[#00e88a]">Conta conectada, dinheiro no fluxo certo</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">A Flowyn organiza a venda. A Asaas movimenta o dinheiro.</h2>
            <p className="mt-4 text-white/60">Cada usuario conecta sua wallet com uma jornada adequada ao tipo de documento. A plataforma nao precisa custodiar o valor integral da venda para repassar depois.</p>
          </div>
          <div className="sales-reveal mt-10 grid gap-4 md:grid-cols-3">
            <FlowStep icon={Fingerprint} number="01" title="Conecte CPF ou CNPJ" text="CPF vincula uma conta Asaas existente. CNPJ cria ou conecta uma subconta empresarial." />
            <FlowStep icon={CreditCard} number="02" title="Venda pelo checkout" text="Seu cliente compra em uma experiencia transparente, com produto e order bump." />
            <FlowStep icon={Zap} number="03" title="Receba com split" text="A Asaas distribui o valor liquido entre produtor e afiliado conforme a comissao." />
          </div>
        </div>
      </section>

      <section id="comparativo" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase text-[#00e88a]">Previsibilidade</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Sua plataforma nao precisa virar socia de cada venda.</h2>
              <p className="mt-4 text-white/60">Um preco fixo mensal fica mais vantajoso conforme seu negocio cresce. As tarifas financeiras da Asaas continuam aplicaveis conforme o meio de pagamento.</p>
              <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/60">
                    <tr><th className="px-4 py-3">Comparacao</th><th className="px-4 py-3 text-[#00e88a]">Flowyn</th><th className="px-4 py-3">Outras plataformas</th></tr>
                  </thead>
                  <tbody>{comparisonRows.map(row => <tr key={row[0]} className="border-t border-white/10"><td className="px-4 py-3 text-white/60">{row[0]}</td><td className="px-4 py-3 font-bold text-white">{row[1]}</td><td className="px-4 py-3 text-white/55">{row[2]}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <div className="rounded-lg border border-[#00e88a]/25 bg-[#00e88a]/5 p-6">
              <p className="text-sm font-bold uppercase text-[#00e88a]">Exemplo pratico</p>
              <h3 className="mt-2 text-2xl font-black">50 vendas de R$ 100 em um mes</h3>
              <p className="mt-2 text-sm text-white/55">Comparacao estimada com uma plataforma que cobra 8,99% + R$ 2,49 por venda. Tarifas financeiras nao incluidas.</p>
              <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-[#0b0e0d]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/60"><tr><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-[#00e88a]">Flowyn</th><th className="px-4 py-3">Outra</th></tr></thead>
                  <tbody>{savingsRows.map(row => <tr key={row[0]} className="border-t border-white/10"><td className="px-4 py-3 text-white/60">{row[0]}</td><td className="px-4 py-3 font-bold text-white">{row[1]}</td><td className="px-4 py-3 text-white/55">{row[2]}</td></tr>)}</tbody>
                </table>
              </div>
              <p className="mt-5 text-xl font-black text-[#00e88a]">R$ 6.300 de economia estimada em 12 meses.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="border-b border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <p className="text-center text-sm font-bold uppercase text-[#00e88a]">Ferramentas para operar de verdade</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-black md:text-4xl">Do checkout ao acompanhamento da venda.</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {readyFeatures.map(({ icon: Icon, title, text }) => (
              <div key={title} className="sales-feature rounded-lg border border-white/10 bg-[#101412] p-5">
                <Icon className="h-5 w-5 text-[#00e88a]" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1fr_360px] md:items-center md:py-20">
          <div>
            <p className="text-sm font-bold uppercase text-[#00e88a]">Um plano simples</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Comece sem risco. Cresca sem punicao.</h2>
            <p className="mt-4 max-w-2xl text-white/60">Use os recursos da Flowyn por 7 dias. Depois, mantenha sua operacao ativa por R$ 49 ao mes, sem comissao adicional da plataforma sobre suas vendas.</p>
          </div>
          <div className="sales-price-card rounded-lg border border-[#00e88a]/35 bg-[#101412] p-6">
            <p className="text-sm font-bold text-[#00e88a]">Flowyn Pro</p>
            <div className="mt-3 flex items-baseline gap-2"><span className="text-5xl font-black">R$ 49</span><span className="text-white/45">/mes</span></div>
            <p className="mt-2 text-sm text-white/50">7 dias gratis para testar.</p>
            <Link href="/register" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00e88a] px-5 py-3 font-bold text-black hover:bg-[#00d77f]">Comecar agora <ArrowRight className="h-4 w-4" /></Link>
            <div className="mt-5 space-y-2 text-sm text-white/60">
              <p className="flex gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> Sem taxa Flowyn por venda</p>
              <p className="flex gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> Produtores e afiliados</p>
              <p className="flex gap-2"><Check className="h-4 w-4 text-[#00e88a]" /> Split automatico Asaas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#00e88a] text-black">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black">Sua margem merece respirar.</h2><p className="mt-2 font-medium text-black/65">Teste a Flowyn por 7 dias e compare na pratica.</p></div>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3.5 font-bold text-white hover:bg-black/85">Criar minha conta <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#070908]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <img src="/logo2.png" alt="Flowyn" className="h-9 w-auto opacity-80" />
          <p>Flowyn. Checkout, afiliados e split automatico via Asaas.</p>
        </div>
      </footer>
    </main>
  )
}

function SplitRow({ label, value, width, delay }: { label: string; value: string; width: string; delay: string }) {
  return <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-white/55">{label}</span><span className="font-bold">{value}</span></div><div className="h-2 rounded-full bg-white/10"><div className="sales-split-bar h-full rounded-full bg-[#00e88a]" style={{ '--split-width': width, animationDelay: delay } as CSSProperties} /></div></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-black/20 p-3"><p className="text-xs text-white/45">{label}</p><p className="mt-1 font-bold">{value}</p></div>
}

function FlowStep({ icon: Icon, number, title, text }: { icon: typeof ShieldCheck; number: string; title: string; text: string }) {
  return <div className="rounded-lg border border-white/10 bg-[#101412] p-5"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-[#00e88a]" /><span className="text-xs font-black text-white/25">{number}</span></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{text}</p></div>
}
