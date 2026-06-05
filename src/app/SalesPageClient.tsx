'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  FileArchive,
  GalleryHorizontalEnd,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  MousePointerClick,
  PackageCheck,
  PlayCircle,
  Receipt,
  Route,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
  Webhook,
} from 'lucide-react'

const screenshotMap = {
  checkout: '/sales/checkout-real.webp',
  editor: '/sales/editor-checkout.webp',
  payments: '/sales/pagamentos-asaas.webp',
  course: '/sales/produto-conteudo-curso.webp',
  ebook: '/sales/entrega-digital-ebook.webp',
  dashboard: '/sales/dashboard-vendas.webp',
  student: '/sales/area-aluno.webp',
}

const problemCards = [
  ['Percentual sobre faturamento', 'Cada venda aumenta o custo da plataforma, justamente quando sua operacao cresce.'],
  ['Entrega manual', 'Cliente paga, mas voce ainda precisa liberar arquivo, acesso, link ou aula no improviso.'],
  ['Checkout sem controle', 'Sua oferta fica presa ao padrao visual e comercial de outra ferramenta.'],
]

const flowSteps = [
  ['Trafego do produtor', 'Instagram, anuncios, WhatsApp, comunidade ou landing propria.'],
  ['Checkout Flowyn', 'Pagina privada por produto, com copy, order bump e pagamento.'],
  ['Pagamento Asaas', 'Processamento financeiro na conta/carteira conectada do produtor.'],
  ['Entrega automatica', 'E-book, curso, mentoria, arquivos ou webhook liberados apos aprovacao.'],
]

const checkoutTabs = [
  {
    key: 'editor',
    label: 'Editor visual',
    image: screenshotMap.editor,
    title: 'Edite antes de publicar',
    text: 'Banner, mockup, headline, beneficios, cores, garantia e order bump em uma tela de controle.',
  },
  {
    key: 'checkout',
    label: 'Checkout publicado',
    image: screenshotMap.checkout,
    title: 'Veja o checkout real',
    text: 'Preview real do checkout, no formato que o comprador encontra na hora de pagar.',
  },
]

const deliveryTabs = [
  {
    key: 'ebook',
    label: 'E-book',
    icon: FileArchive,
    image: screenshotMap.ebook,
    title: 'Entrega digital sem gambiarra',
    text: 'Anexe PDFs, ZIPs, arquivos de apoio ou informe um link externo. O comprador recebe acesso apos a confirmacao.',
  },
  {
    key: 'course',
    label: 'Curso online',
    icon: GraduationCap,
    image: screenshotMap.course,
    title: 'Flowyn Play para cursos',
    text: 'Organize modulos, aulas, videos, materiais, comentarios e certificados em uma area de aluno propria.',
  },
  {
    key: 'mentoria',
    label: 'Mentoria',
    icon: Route,
    image: screenshotMap.student,
    title: 'Jornada de acompanhamento',
    text: 'Configure diagnostico, sessoes, tarefas e acompanhamento do aluno para vender mentorias com mais estrutura.',
  },
]

const featureItems = [
  ['Checkout transparente', MousePointerClick],
  ['Editor visual', Eye],
  ['Order bump', Receipt],
  ['Pixels por plano', BarChart3],
  ['Webhooks', Webhook],
  ['Area do aluno', BookOpen],
  ['Upload de videos', Upload],
  ['Certificados', BadgeCheck],
  ['Comentarios por aula', MessageSquareText],
  ['Mentoria com tarefas', Route],
  ['Diagnostico do aluno', LayoutDashboard],
  ['Carteira Asaas', WalletCards],
] as const

const gallery = [
  ['Checkout real', screenshotMap.checkout],
  ['Editor de checkout', screenshotMap.editor],
  ['Entrega digital', screenshotMap.ebook],
  ['Curso online', screenshotMap.course],
  ['Meus acessos', screenshotMap.student],
  ['Pagamentos Asaas', screenshotMap.payments],
  ['Dashboard de vendas', screenshotMap.dashboard],
]

const faq = [
  ['A Flowyn cobra taxa por venda?', 'Nao. A Flowyn cobra mensalidade fixa. Quem cobra as tarifas financeiras do pagamento e a Asaas.'],
  ['Eu recebo direto na minha conta?', 'Voce conecta sua conta/carteira Asaas. O recebimento financeiro segue as regras da Asaas.'],
  ['A Flowyn substitui uma pagina de vendas?', 'Nao. A Flowyn e focada no checkout. Voce pode vender a partir de uma landing page propria, anuncios, Instagram, WhatsApp, comunidade ou qualquer canal.'],
  ['Posso vender curso, e-book e mentoria?', 'Sim. Cada tipo de produto tem uma entrega adequada dentro da plataforma.'],
  ['O comprador recebe acesso automaticamente?', 'Sim. Depois do pagamento aprovado, a Flowyn libera o acesso configurado e envia e-mail ao comprador.'],
]

export function SalesPageClient() {
  const [checkoutTab, setCheckoutTab] = useState(checkoutTabs[0])
  const [deliveryTab, setDeliveryTab] = useState(deliveryTabs[0])
  const [ticket, setTicket] = useState(100)
  const [sales, setSales] = useState(50)
  const [percentage, setPercentage] = useState(8.99)
  const [fixedFee, setFixedFee] = useState(2.49)

  const calculator = useMemo(() => {
    const revenue = Math.max(0, ticket) * Math.max(0, sales)
    const competitor = revenue * (Math.max(0, percentage) / 100) + Math.max(0, sales) * Math.max(0, fixedFee)
    const flowyn = 49
    return { revenue, competitor, flowyn, difference: Math.max(0, competitor - flowyn) }
  }, [ticket, sales, percentage, fixedFee])

  return (
    <main className="min-h-screen bg-[#070908] text-white">
      <Header />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(0,232,138,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.02fr_.98fr] md:items-center md:py-24">
          <div className="sales-reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00e88a]/25 bg-[#00e88a]/10 px-3 py-1.5 text-xs font-black uppercase text-[#00e88a]">
              <Sparkles className="h-3.5 w-3.5" />
              Checkout para infoprodutores que querem margem e controle
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl md:text-6xl">
              Venda infoprodutos sem entregar um percentual de cada venda para a plataforma.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              Crie produtos digitais, publique um checkout transparente, receba pela sua conta Asaas e entregue cursos, e-books e mentorias automaticamente. A Flowyn cobra mensalidade fixa. As tarifas de pagamento continuam sendo da Asaas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-6 py-4 text-base font-black text-black transition hover:-translate-y-0.5 hover:bg-[#05f294]">
                Comecar teste gratis <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#custos" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-4 text-base font-black text-white transition hover:bg-white/5">
                Ver como os custos funcionam
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-white/55 sm:grid-cols-3">
              <TrustItem icon={ShieldCheck} text="Taxa Flowyn por venda: R$ 0" />
              <TrustItem icon={WalletCards} text="Recebimento via Asaas" />
              <TrustItem icon={LockKeyhole} text="Checkout privado" />
            </div>
          </div>

          <div className="sales-float relative">
            <ScreenshotFrame
              src={screenshotMap.checkout}
              title="Checkout real"
              fallback="Adicione public/sales/checkout-real.webp para exibir o print real do checkout."
              light
            />
            <FloatingBadge className="-left-3 top-8" label="Venda aprovada" value="R$ 297,00" />
            <FloatingBadge className="-right-3 top-32" label="Taxa Flowyn" value="R$ 0" />
            <FloatingBadge className="bottom-8 left-8" label="Entrega" value="Acesso liberado" />
          </div>
        </div>
      </section>

      <Section id="problema" eyebrow="O problema" title="Quando sua plataforma cobra por venda, ela fica mais cara justamente quando voce cresce." text="Taxas percentuais parecem pequenas no comeco. Mas quando voce vende mais, elas viram um custo recorrente que acompanha todo lancamento, toda campanha e todo produto novo.">
        <div className="grid gap-4 md:grid-cols-3">
          {problemCards.map(([title, text], index) => (
            <div key={title} className="sales-feature rounded-2xl border border-white/10 bg-[#101412] p-6" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">{index + 1}</div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="como-funciona" eyebrow="O conceito" title="A Flowyn fixa o custo da plataforma. O seu crescimento fica com voce." text="A Flowyn organiza o checkout, entrega e gestao. O pagamento acontece via Asaas, e as tarifas financeiras continuam sendo cobradas pela Asaas. A diferenca e que a Flowyn nao adiciona um percentual proprio em cada venda." muted>
        <div className="grid gap-3 lg:grid-cols-4">
          {flowSteps.map(([title, text], index) => (
            <div key={title} className="relative rounded-2xl border border-white/10 bg-[#101412] p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00e88a]/10 text-sm font-black text-[#00e88a]">{index + 1}</span>
                {index < flowSteps.length - 1 && <ChevronRight className="hidden h-5 w-5 text-white/18 lg:block" />}
              </div>
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="checkout" eyebrow="Checkout" title="Um checkout limpo, direto e feito para vender." text="Personalize banner, mockup, copy, order bump, beneficios e cores. Antes de publicar, veja o checkout real como o comprador vai enxergar.">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
          <div className="space-y-3">
            {checkoutTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setCheckoutTab(tab)}
                className={`w-full rounded-2xl border p-5 text-left transition ${checkoutTab.key === tab.key ? 'border-[#00e88a] bg-[#00e88a]/10' : 'border-white/10 bg-[#101412] hover:border-white/20'}`}
              >
                <span className="font-black text-white">{tab.label}</span>
                <span className="mt-2 block text-sm leading-6 text-white/45">{tab.text}</span>
              </button>
            ))}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-white/55">
              <CheckLine>Editor visual do checkout</CheckLine>
              <CheckLine>Preview real antes de publicar</CheckLine>
              <CheckLine>Order bump nativo</CheckLine>
              <CheckLine>Checkout branco e familiar</CheckLine>
            </div>
          </div>
          <ScreenshotFrame src={checkoutTab.image} title={checkoutTab.title} fallback={`Adicione ${checkoutTab.image} para exibir este print real.`} light={checkoutTab.key === 'checkout'} />
        </div>
      </Section>

      <Section id="asaas" eyebrow="Recebimento" title="Venda pela Flowyn. Receba pela sua conta Asaas." text="O produtor conecta uma carteira Asaas CPF ou CNPJ. A Flowyn usa essa conexao para processar o checkout e registrar a venda sem cobrar taxa propria por transacao." muted>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <ScreenshotFrame src={screenshotMap.payments} title="Tela de pagamentos Asaas" fallback="Adicione public/sales/pagamentos-asaas.webp para exibir o print real da conexao Asaas." />
          <div className="space-y-4">
            {['CPF ou CNPJ', 'Wallet Asaas', 'Sem taxa Flowyn por venda', 'Painel de saldo na Asaas'].map(item => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101412] p-4">
                <WalletCards className="h-5 w-5 text-[#00e88a]" />
                <span className="font-bold text-white/75">{item}</span>
              </div>
            ))}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100/80">
              Importante: tarifas de cartao, Pix, boleto, antecipacao ou regras financeiras sao cobradas pela Asaas. A Flowyn nao substitui essas tarifas; ela elimina a taxa extra de plataforma por venda.
            </div>
          </div>
        </div>
      </Section>

      <Section id="custos" eyebrow="Custos honestos" title="O custo da plataforma nao precisa crescer junto com seu faturamento." text="Existem dois tipos de custo: tarifa financeira e taxa de plataforma. A tarifa financeira e do meio de pagamento. A taxa de plataforma e o que muitas ferramentas cobram alem disso. A Flowyn trabalha com mensalidade fixa.">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-[#101412] p-6">
            <div className="mb-5 flex items-center gap-2 text-lg font-black">
              <Calculator className="h-5 w-5 text-[#00e88a]" />
              Calculadora de taxa da plataforma
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Preco medio" prefix="R$" value={ticket} onChange={setTicket} />
              <NumberField label="Vendas no mes" value={sales} onChange={setSales} />
              <NumberField label="Percentual da plataforma" suffix="%" value={percentage} onChange={setPercentage} step="0.1" />
              <NumberField label="Fixo por venda" prefix="R$" value={fixedFee} onChange={setFixedFee} step="0.01" />
            </div>
            <div className="mt-6 grid gap-3">
              <CostRow label="Volume bruto vendido" value={formatCurrency(calculator.revenue)} />
              <CostRow label="Taxa estimada da plataforma com percentual" value={formatCurrency(calculator.competitor)} />
              <CostRow label="Mensalidade Flowyn" value={formatCurrency(calculator.flowyn)} highlight />
              <CostRow label="Diferenca na camada plataforma" value={formatCurrency(calculator.difference)} />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101412]">
            <table className="w-full text-left text-sm">
              <tbody>
                {[
                  ['Volume bruto vendido', 'R$ 5.000', 'R$ 5.000'],
                  ['Taxa da plataforma', 'R$ 49 fixos', 'Ex: 8,99% + R$ 2,49/venda'],
                  ['Percentual Flowyn', 'R$ 0', 'Varia conforme venda'],
                  ['Tarifas financeiras', 'Asaas cobra separadamente', 'Meio de pagamento cobra separadamente'],
                  ['Previsibilidade', 'Alta', 'Custo cresce com faturamento'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-white/10 last:border-b-0">
                    <td className="px-5 py-4 text-white/45">{row[0]}</td>
                    <td className="px-5 py-4 font-black text-[#00e88a]">{row[1]}</td>
                    <td className="px-5 py-4 text-white/45">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-white/10 bg-black/20 p-5 text-sm leading-6 text-white/55">
              Esta comparacao considera apenas a camada da plataforma. Tarifas financeiras da Asaas continuam existindo e variam por meio de pagamento, prazo e configuracao da conta.
            </div>
          </div>
        </div>
      </Section>

      <Section id="entrega" eyebrow="Entrega digital" title="O comprador pagou. A entrega acontece sem voce correr atras." text="Configure a entrega de acordo com o tipo do produto: e-book, arquivo, curso online, mentoria ou link externo." muted>
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="space-y-3">
            {deliveryTabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setDeliveryTab(tab)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${deliveryTab.key === tab.key ? 'border-[#00e88a] bg-[#00e88a]/10' : 'border-white/10 bg-[#101412] hover:border-white/20'}`}
                >
                  <Icon className="mb-4 h-5 w-5 text-[#00e88a]" />
                  <span className="font-black text-white">{tab.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-white/45">{tab.text}</span>
                </button>
              )
            })}
          </div>
          <ScreenshotFrame src={deliveryTab.image} title={deliveryTab.title} fallback={`Adicione ${deliveryTab.image} para exibir este print real.`} />
        </div>
      </Section>

      <Section id="gestao" eyebrow="Painel de gestao" title="Acompanhe vendas, produtos e alunos sem planilha improvisada." text="Veja pedidos, receita, status de pagamento, produtos vendidos e acessos liberados em um painel focado no produtor.">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <ScreenshotFrame src={screenshotMap.dashboard} title="Dashboard de vendas" fallback="Adicione public/sales/dashboard-vendas.webp para exibir o print real do dashboard." />
          <div className="space-y-3">
            {['Minhas vendas', 'Meus produtos', 'Relatorios por produto', 'Status de pagamento', 'Acesso do aluno'].map(item => (
              <CheckLine key={item}>{item}</CheckLine>
            ))}
          </div>
        </div>
      </Section>

      <Section id="recursos" eyebrow="Recursos" title="O essencial para operar um produto digital de verdade." text="Uma estrutura enxuta para publicar checkout, receber, entregar e acompanhar sem montar tudo na mao." muted>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map(([feature, Icon]) => (
            <div key={feature} className="sales-feature rounded-2xl border border-white/10 bg-[#101412] p-5">
              <Icon className="h-5 w-5 text-[#00e88a]" />
              <p className="mt-4 text-sm font-bold leading-6 text-white/70">{feature}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="prints" eyebrow="Prova visual" title="Veja a Flowyn por dentro." text="A pagina esta pronta para usar screenshots reais da plataforma. Quando os arquivos forem adicionados em public/sales, eles aparecem automaticamente nestas molduras.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map(([label, src]) => (
            <ScreenshotFrame key={label} src={src} title={label} fallback={`Adicionar ${src}`} compact />
          ))}
        </div>
      </Section>

      <section className="border-y border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1fr_390px] md:items-center md:py-20">
          <div>
            <p className="text-sm font-black uppercase text-[#00e88a]">Flowyn Pro</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Uma mensalidade simples para parar de pagar taxa de plataforma por venda.</h2>
            <p className="mt-4 max-w-2xl text-white/60">Teste a Flowyn, publique um checkout e compare a diferenca entre pagar uma mensalidade fixa e entregar uma parte de cada venda.</p>
          </div>
          <div className="sales-price-card rounded-3xl border border-[#00e88a]/35 bg-[#101412] p-6">
            <p className="text-sm font-black text-[#00e88a]">Flowyn Pro</p>
            <div className="mt-3 flex items-baseline gap-2"><span className="text-5xl font-black">R$ 49</span><span className="text-white/45">/mes</span></div>
            <p className="mt-2 text-sm text-white/50">7 dias gratis para testar.</p>
            <div className="mt-5 space-y-2 text-sm text-white/65">
              {['R$ 0 de taxa Flowyn por venda', 'Checkout enquanto assinatura ativa', 'Produtos digitais', 'Entrega automatica', 'Area do aluno', 'Asaas CPF/CNPJ'].map(item => (
                <CheckLine key={item}>{item}</CheckLine>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100/80">Tarifas financeiras da Asaas nao estao inclusas na mensalidade Flowyn.</p>
            <Link href="/register" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-5 py-3 font-black text-black transition hover:bg-[#05f294]">Comecar teste gratis <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <Section id="duvidas" eyebrow="FAQ" title="Perguntas que um produtor esperto faria.">
        <div className="mx-auto grid max-w-5xl gap-4">
          {faq.map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-white/10 bg-[#101412] p-6">
              <h3 className="font-black text-white">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">{answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-[#00e88a] text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">Se sua margem importa, sua plataforma nao deveria virar socio invisivel.</h2>
            <p className="mt-2 max-w-2xl font-semibold text-black/65">Crie seu primeiro produto, publique o checkout e compare a conta no fim do mes.</p>
          </div>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-black text-white transition hover:bg-black/85">
            Criar minha conta gratis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#070908]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <img src="/logo2.png" alt="Flowyn" className="h-16 w-auto opacity-90" />
          <p>Checkout para infoprodutores via Asaas.</p>
        </div>
      </footer>
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070908]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo2.png" alt="Flowyn" className="h-20 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/55 md:flex">
          <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
          <a href="#checkout" className="transition hover:text-white">Checkout</a>
          <a href="#custos" className="transition hover:text-white">Custos</a>
          <a href="#recursos" className="transition hover:text-white">Recursos</a>
          <a href="#duvidas" className="transition hover:text-white">Duvidas</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-bold text-white/65 transition hover:text-white sm:inline">Entrar</Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#05f294]">
            Comecar gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Section({ id, eyebrow, title, text, muted = false, children }: { id: string; eyebrow: string; title: string; text?: string; muted?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`border-b border-white/10 ${muted ? 'bg-[#0b0e0d]' : 'bg-[#070908]'}`}>
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-black uppercase text-[#00e88a]">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">{title}</h2>
          {text && <p className="mt-4 text-base leading-7 text-white/60">{text}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function ScreenshotFrame({ src, title, fallback, light = false, compact = false }: { src: string; title: string; fallback: string; light?: boolean; compact?: boolean }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${light ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#101412]'} shadow-2xl`}>
      <div className={`flex items-center justify-between border-b px-4 py-3 text-xs font-black uppercase ${light ? 'border-slate-200 text-slate-500' : 'border-white/10 text-white/35'}`}>
        <span>{title}</span>
        <span className={light ? 'text-[#00a866]' : 'text-[#00e88a]'}>Flowyn</span>
      </div>
      {!failed ? (
        <img
          src={src}
          alt={title}
          onError={() => setFailed(true)}
          className={`block w-full object-cover ${compact ? 'h-56' : 'min-h-[360px] max-h-[620px]'}`}
        />
      ) : (
        <div className={`flex ${compact ? 'min-h-56' : 'min-h-[420px]'} flex-col items-center justify-center p-8 text-center ${light ? 'text-slate-500' : 'text-white/45'}`}>
          <GalleryHorizontalEnd className={`mb-4 h-10 w-10 ${light ? 'text-slate-300' : 'text-white/20'}`} />
          <p className="max-w-sm text-sm font-bold leading-6">{fallback}</p>
        </div>
      )}
    </div>
  )
}

function FloatingBadge({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className={`absolute hidden rounded-2xl border border-white/15 bg-[#101412]/95 px-4 py-3 shadow-2xl backdrop-blur md:block ${className}`}>
      <p className="text-[10px] font-black uppercase text-white/35">{label}</p>
      <p className="mt-1 text-sm font-black text-[#00e88a]">{value}</p>
    </div>
  )
}

function TrustItem({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <Icon className="h-4 w-4 text-[#00e88a]" />
      {text}
    </div>
  )
}

function CheckLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-white/65">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00e88a]" />
      {children}
    </div>
  )
}

function NumberField({ label, value, onChange, prefix, suffix, step = '1' }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string; step?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase text-white/35">{label}</span>
      <div className="flex items-center rounded-xl border border-white/10 bg-black/20 px-3">
        {prefix && <span className="text-sm font-bold text-white/35">{prefix}</span>}
        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={event => onChange(Number(event.target.value))}
          className="w-full bg-transparent px-2 py-3 text-sm font-bold text-white outline-none"
        />
        {suffix && <span className="text-sm font-bold text-white/35">{suffix}</span>}
      </div>
    </label>
  )
}

function CostRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${highlight ? 'border-[#00e88a]/30 bg-[#00e88a]/10' : 'border-white/10 bg-black/20'}`}>
      <span className="text-sm text-white/55">{label}</span>
      <span className={`font-black ${highlight ? 'text-[#00e88a]' : 'text-white'}`}>{value}</span>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}
