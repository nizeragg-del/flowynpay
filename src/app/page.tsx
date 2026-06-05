import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  PackageCheck,
  Receipt,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'Flowyn - Venda infoprodutos sem taxas abusivas',
  description: 'Checkout transparente, entrega digital e recebimento via Asaas para produtores que querem previsibilidade e margem.',
}

const productPillars = [
  {
    icon: CreditCard,
    title: 'Checkout feito para converter',
    text: 'Pagina branca, objetiva, com order bump, pagamento por cartao e uma experiencia familiar para o comprador.',
  },
  {
    icon: WalletCards,
    title: 'Recebimento via Asaas',
    text: 'Conecte sua conta CPF ou CNPJ e receba pelas vendas sem a Flowyn cobrar percentual por transacao.',
  },
  {
    icon: PackageCheck,
    title: 'Entrega depois do pagamento',
    text: 'Libere e-book, arquivos, cursos, mentorias e acessos automaticamente quando a venda for aprovada.',
  },
]

const features = [
  'Produtos digitais com planos e order bump',
  'Editor visual de checkout',
  'Area do aluno para cursos e mentorias',
  'Upload de arquivos e video nativo',
  'Pixels por plano',
  'Webhooks e logs de entrega',
  'Relatorios de vendas',
  'Carteira Asaas CPF/CNPJ',
]

const comparisonRows = [
  ['Modelo de cobranca', 'Mensalidade fixa', 'Percentual por venda'],
  ['Taxa Flowyn por venda', 'R$ 0,00', 'Cresce junto com seu faturamento'],
  ['Recebimento', 'Via sua conta Asaas', 'Saldo interno ou repasse posterior'],
  ['Controle da oferta', 'Checkout privado por produto', 'Oferta exposta em ecossistema publico'],
  ['Entrega', 'Arquivos, curso, mentoria e webhooks', 'Varia conforme o plano'],
]

const economyRows = [
  ['Vendas no mes', '50 x R$ 100', 'R$ 5.000'],
  ['Custo Flowyn', 'R$ 49 fixos', 'R$ 49'],
  ['Custo estimado em plataforma com taxa', '8,99% + R$ 2,49 por venda', 'R$ 574'],
  ['Margem preservada', 'Estimativa mensal', 'R$ 525'],
]

const objections = [
  {
    title: 'E se eu vender pouco no comeco?',
    text: 'Voce tem 7 dias gratis para testar. O modelo faz mais sentido quando voce quer crescer sem ver a taxa da plataforma comer sua margem.',
  },
  {
    title: 'A Flowyn processa meu dinheiro?',
    text: 'Os pagamentos sao feitos via Asaas. A Flowyn organiza checkout, produto, entrega e acompanhamento.',
  },
  {
    title: 'Preciso de pagina de vendas dentro da plataforma?',
    text: 'Nao. A Flowyn e focada no checkout. Voce pode mandar trafego de onde quiser: Instagram, anuncios, WhatsApp, landing page propria ou comunidade.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070908] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070908]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="inline-flex items-center">
            <img src="/logo2.png" alt="Flowyn" className="h-20 w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/55 md:flex">
            <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
            <a href="#economia" className="transition hover:text-white">Economia</a>
            <a href="#recursos" className="transition hover:text-white">Recursos</a>
            <a href="#duvidas" className="transition hover:text-white">Duvidas</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-bold text-white/65 transition hover:text-white sm:inline">Entrar</Link>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#05f294]">
              Testar gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(0,232,138,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.02fr_.98fr] md:items-center md:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00e88a]/25 bg-[#00e88a]/10 px-3 py-1.5 text-xs font-black uppercase text-[#00e88a]">
              <Sparkles className="h-3.5 w-3.5" />
              7 dias gratis. Depois R$ 49/mes.
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl md:text-6xl">
              Venda infoprodutos e receba diretamente na sua conta sem taxas abusivas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              A Flowyn e o checkout para produtores digitais que querem controlar a oferta, entregar automaticamente e parar de perder margem para taxas que crescem a cada venda.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-6 py-4 text-base font-black text-black transition hover:-translate-y-0.5 hover:bg-[#05f294]">
                Comecar teste gratis <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#economia" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-4 text-base font-black text-white transition hover:bg-white/5">
                Ver exemplo de economia
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-white/55 sm:grid-cols-3">
              <TrustItem icon={ShieldCheck} text="Taxa Flowyn zero por venda" />
              <TrustItem icon={WalletCards} text="Asaas CPF ou CNPJ" />
              <TrustItem icon={LockKeyhole} text="Checkout seguro" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] border border-[#00e88a]/15 bg-[#00e88a]/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101412] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-black uppercase text-white/35">Checkout aprovado</p>
                  <p className="mt-1 text-3xl font-black">R$ 297,00</p>
                </div>
                <div className="rounded-2xl bg-[#00e88a]/10 p-3 text-[#00e88a]">
                  <BadgeCheck className="h-7 w-7" />
                </div>
              </div>
              <div className="grid gap-4 p-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-white/45">Recebimento</span>
                    <span className="font-black text-[#00e88a]">Conta Asaas conectada</span>
                  </div>
                  <div className="space-y-3">
                    <Metric label="Taxa Flowyn" value="R$ 0,00" />
                    <Metric label="Entrega" value="Acesso liberado" />
                    <Metric label="Produto" value="Curso, e-book ou mentoria" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniCard icon={Receipt} label="Order bump" value="+ R$ 47" />
                  <MiniCard icon={BarChart3} label="Relatorio" value="Venda rastreada" />
                </div>
                <p className="text-xs leading-5 text-white/40">
                  Tarifas financeiras da Asaas continuam aplicaveis conforme o meio de pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-b border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-[#00e88a]">O conceito</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">A Flowyn nao quer ser dona da sua venda.</h2>
            <p className="mt-4 text-white/60">
              O produto e seu. O trafego e seu. A audiencia e sua. A Flowyn entra onde faz sentido: checkout, pagamento, entrega e gestao.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {productPillars.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#101412] p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-[#00e88a]" />
                  <span className="text-xs font-black text-white/25">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="economia" className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-start md:py-20">
          <div>
            <p className="text-sm font-black uppercase text-[#00e88a]">Margem previsivel</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Quanto mais voce vende, mais taxa por venda incomoda.</h2>
            <p className="mt-4 text-white/60">
              Plataformas com percentual parecem baratas quando voce ainda vende pouco. Mas conforme a operacao cresce, elas viram uma linha pesada no seu caixa.
            </p>
            <div className="mt-8 rounded-2xl border border-[#00e88a]/25 bg-[#00e88a]/10 p-6">
              <p className="text-sm font-black uppercase text-[#00e88a]">Exemplo</p>
              <p className="mt-2 text-4xl font-black">50 vendas de R$ 100</p>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Em uma plataforma que cobra 8,99% + R$ 2,49 por venda, o custo estimado passa de quinhentos reais no mes. Na Flowyn, o custo da plataforma permanece R$ 49.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101412]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-5 py-4">Cenario</th>
                  <th className="px-5 py-4">Base</th>
                  <th className="px-5 py-4 text-[#00e88a]">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {economyRows.map(row => (
                  <tr key={row[0]} className="border-t border-white/10">
                    <td className="px-5 py-4 text-white/65">{row[0]}</td>
                    <td className="px-5 py-4 text-white/50">{row[1]}</td>
                    <td className="px-5 py-4 font-black text-white">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-white/10 bg-black/20 p-5">
              <p className="text-lg font-black text-[#00e88a]">Estimativa: R$ 6.300 preservados em 12 meses.</p>
              <p className="mt-1 text-xs text-white/40">Exemplo ilustrativo. Tarifas financeiras da Asaas nao estao incluidas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase text-[#00e88a]">Comparacao direta</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Voce paga para usar a ferramenta, nao para dividir cada venda.</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101412]">
              <table className="w-full text-left text-sm">
                <tbody>
                  {comparisonRows.map(row => (
                    <tr key={row[0]} className="border-b border-white/10 last:border-b-0">
                      <td className="px-5 py-4 text-white/45">{row[0]}</td>
                      <td className="px-5 py-4 font-black text-[#00e88a]">{row[1]}</td>
                      <td className="px-5 py-4 text-white/45">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <p className="text-center text-sm font-black uppercase text-[#00e88a]">O que vem junto</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-black md:text-4xl">A estrutura minima para vender sem improviso.</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(feature => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-[#101412] p-5">
                <CheckCircle2 className="h-5 w-5 text-[#00e88a]" />
                <p className="mt-4 text-sm font-bold leading-6 text-white/70">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="duvidas" className="border-b border-white/10 bg-[#0b0e0d]">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <p className="text-center text-sm font-black uppercase text-[#00e88a]">Antes de comecar</p>
          <h2 className="text-center text-3xl font-black md:text-4xl">Perguntas que um produtor esperto faria.</h2>
          <div className="mt-10 grid gap-4">
            {objections.map(item => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-[#101412] p-6">
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#00e88a] text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">Teste sem risco. Venda sem taxa abusiva.</h2>
            <p className="mt-2 max-w-2xl font-semibold text-black/65">
              Crie seu primeiro produto, publique o checkout e compare a conta no fim do mes.
            </p>
          </div>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-black text-white transition hover:bg-black/85">
            Criar conta gratis <ArrowRight className="h-5 w-5" />
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

function TrustItem({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <Icon className="h-4 w-4 text-[#00e88a]" />
      {text}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-white/45">{label}</p>
      <p className="font-black">{value}</p>
    </div>
  )
}

function MiniCard({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <Icon className="h-5 w-5 text-[#00e88a]" />
      <p className="mt-3 text-xs text-white/40">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  )
}
