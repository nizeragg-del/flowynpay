import Link from 'next/link'
import { Webhook, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Guia de Integração | Flowyn',
  description: 'Conecte seu SaaS a Flowyn em 3 minutos usando o Make.com.',
}

export default function WebhookDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            Flowyn <span className="text-slate-400 font-normal">Developers</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-black transition-colors">Voltar para o Painel</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6 border border-white/20 shadow-2xl">
            <Zap className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Integração Automática de Vendas
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Libere o acesso do seu cliente de forma 100% automática sempre que uma venda for aprovada usando o Make.com em menos de 5 minutos, clicando e arrastando!
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        {/* --- STEP 1 --- */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-lg mb-6">1</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Crie seu Webhook Receptor no Make
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            O Make irá gerar um link mágico para você cadastrar na Flowyn. Tudo que nós mandarmos pra esse link, vai cair na sua mão visualmente.
          </p>
          <ul className="space-y-4 text-slate-600 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Crie uma conta gratuita no <strong>Make.com</strong> e inicie um novo Cenário ("Create a New Scenario").</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Na primeira bolinha (Gatilho), busque por <strong>Webhooks</strong> e escolha <strong>Custom Webhook</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Clique em <em>Add</em>, digite um nome qualquer (Ex: "Vendas Flowyn") e clique em Save.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Ele irá gerar um link (ex: <code className="bg-white border px-1.5 py-0.5 rounded text-sm text-pink-600">https://hook.make.com/xyz123</code>). <strong>Copie esse link!</strong></span>
            </li>
          </ul>
        </div>

        {/* --- STEP 2 --- */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-lg mb-6">2</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Cadastre o Link na Flowyn
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Agora precisamos dizer pro nosso Checkout para onde enviar as informações do cliente quando a faturar bater.
          </p>
          <ul className="space-y-4 text-slate-600 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Volte para o Painel da Flowyn e clique em <strong>Meus Produtos</strong>, depois vá em <strong>Editar</strong> no produto desejado.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Na aba de Configurações, cole aquele link do Make no campo <strong>URL do Webhook</strong> e salve!</span>
            </li>
          </ul>
        </div>

        {/* --- STEP 3 --- */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-lg mb-6">3</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Conecte ao seu Banco de Dados (Supabase, MySQL, etc)
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Volte para o Make. Agora você vai dizer o que o Make deve fazer com o e-mail do cliente que ele acabou de receber.
          </p>
          <ul className="space-y-4 text-slate-600 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Adicione uma segunda bolinha ligada ao Webhook. Procure pelo nome do Banco de Dados que seu SaaS usa (Ex: Supabase, MySQL).</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Selecione a ação <strong>Upsert a Record</strong> (Criar ou Atualizar Usuário) ou <strong>Create a Row</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
              <span>Conecte com seu banco digitando sua chave de acesso. No campo <em>Table</em>, escolha a sua tabela de `assinantes` ou `users`.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>A Mágica:</strong> Pegue o "Email" e o "Nome do Plano" que estão na caixinha do Webhook, e arraste para os campos correspondentes do seu Banco de Dados. Clique em Save e depois em <strong>Turn On (Ligar)</strong> no cantinho inferior esquerdo. Pronto!</span>
            </li>
          </ul>
        </div>

        <div className="py-8 text-center text-slate-500">
          Você automatizou sua empresa sem escrever código. Divirta-se vendo as assinaturas de forma 100% autônoma! 🚀
        </div>

      </main>
    </div>
  )
}
