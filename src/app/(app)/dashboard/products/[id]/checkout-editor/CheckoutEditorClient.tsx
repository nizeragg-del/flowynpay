"use client"

import { useState, useTransition } from 'react'
import { Check, CreditCard, Eye, Lock, Mail, MapPin, Monitor, Phone, Save, ShieldCheck, Smartphone, Sparkles, UploadCloud, User } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import type { CheckoutCustomizationConfig } from '@/lib/checkout-customization'
import { publishCheckout, saveCheckoutDraft } from './actions'

type CheckoutEditorClientProps = {
  productId: string
  userId: string
  product: any
  plans: any[]
  initialConfig: CheckoutCustomizationConfig
  publishedAt: string | null
}

export function CheckoutEditorClient({
  productId,
  userId,
  product,
  plans,
  initialConfig,
  publishedAt,
}: CheckoutEditorClientProps) {
  const [config, setConfig] = useState(initialConfig)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [isPending, startTransition] = useTransition()
  const plan = plans[0]
  const orderBumpEnabled = Boolean(product.order_bump_price)

  function update<K extends keyof CheckoutCustomizationConfig>(key: K, value: CheckoutCustomizationConfig[K]) {
    setConfig(current => ({ ...current, [key]: value }))
  }

  function updateBlock(key: keyof CheckoutCustomizationConfig['blocks'], value: boolean) {
    setConfig(current => ({ ...current, blocks: { ...current.blocks, [key]: value } }))
  }

  function updateList(key: 'benefits', value: string) {
    update(key, value.split('\n').map(item => item.trim()).filter(Boolean))
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-20 z-20 rounded-3xl border border-white/10 bg-[#111]/95 p-4 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00e88a]/25 bg-[#00e88a]/10 px-3 py-1 text-xs font-black text-[#00e88a]">
              <Sparkles className="h-3.5 w-3.5" />
              Checkout transparente
            </div>
            <h2 className="mt-2 text-xl font-black text-white">Construtor visual</h2>
            <p className="mt-1 text-xs text-white/40">
              {publishedAt ? `Publicado em ${new Date(publishedAt).toLocaleString('pt-BR')}` : 'Edite o rascunho e publique quando estiver pronto'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-white/10 bg-black/20 p-1">
              <button onClick={() => setViewport('desktop')} className={`rounded-lg p-2 ${viewport === 'desktop' ? 'bg-[#00e88a] text-black' : 'text-white/45'}`} title="Desktop">
                <Monitor className="h-4 w-4" />
              </button>
              <button onClick={() => setViewport('mobile')} className={`rounded-lg p-2 ${viewport === 'mobile' ? 'bg-[#00e88a] text-black' : 'text-white/45'}`} title="Mobile">
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => saveCheckoutDraft(productId, config))}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Salvar rascunho
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => publishCheckout(productId, config))}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-5 py-3 text-sm font-black text-black transition hover:bg-[#04f294] disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Publicar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">

        <Panel title="Imagens">
          <FileUpload
            mode="image"
            label="Banner do checkout"
            hint="Imagem horizontal para o topo do checkout"
            userId={userId}
            folder="checkout-assets"
            currentUrl={config.bannerImageUrl}
            onUpload={(url) => update('bannerImageUrl', url)}
            onRemove={() => update('bannerImageUrl', '')}
          />
          <FileUpload
            mode="image"
            label="Mockup do produto"
            hint="Arraste ou anexe uma imagem do produto"
            userId={userId}
            folder="checkout-assets"
            currentUrl={config.mockupImageUrl}
            onUpload={(url) => update('mockupImageUrl', url)}
            onRemove={() => update('mockupImageUrl', '')}
          />
          {orderBumpEnabled && (
            <FileUpload
              mode="image"
              label="Imagem do order bump"
              hint="Imagem usada na oferta extra"
              userId={userId}
              folder="checkout-assets"
              currentUrl={config.orderBumpImageUrl}
              onUpload={(url) => update('orderBumpImageUrl', url)}
              onRemove={() => update('orderBumpImageUrl', '')}
            />
          )}
        </Panel>

        <Panel title="Copy">
          <Field label="Headline" value={config.headline} onChange={(value) => update('headline', value)} />
          <Field label="Subheadline" value={config.subheadline} onChange={(value) => update('subheadline', value)} textarea />
          <Field label="Texto do botão" value={config.buttonText} onChange={(value) => update('buttonText', value)} />
          <Field label="Selo de segurança" value={config.securityText} onChange={(value) => update('securityText', value)} />
          <Field label="Garantia" value={config.guaranteeText} onChange={(value) => update('guaranteeText', value)} textarea />
        </Panel>

        <Panel title="Estilo">
          <ColorField label="Cor primária" value={config.primaryColor} onChange={(value) => update('primaryColor', value)} />
          <ColorField label="Fundo" value={config.backgroundColor} onChange={(value) => update('backgroundColor', value)} />
        </Panel>

        <Panel title="Blocos">
          {Object.entries(config.blocks).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/65">
              {blockLabel(key)}
              <input type="checkbox" checked={value} onChange={(event) => updateBlock(key as keyof CheckoutCustomizationConfig['blocks'], event.target.checked)} className="accent-[#00e88a]" />
            </label>
          ))}
          <Field label="Benefícios, um por linha" value={config.benefits.join('\n')} onChange={(value) => updateList('benefits', value)} textarea />
        </Panel>

      </aside>

      <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white/60">
            <Eye className="h-4 w-4 text-[#00e88a]" />
            Preview do checkout
          </div>
          <span className="text-xs font-bold uppercase text-white/30">{viewport}</span>
        </div>
        <div className={`mx-auto w-full max-w-full overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-2xl transition-all ${viewport === 'mobile' ? 'max-w-[390px]' : ''}`}>
          <CheckoutPreview config={config} product={product} plan={plan} mobile={viewport === 'mobile'} />
        </div>
      </section>
      </div>
    </div>
  )
}

function CheckoutPreview({ config, product, plan, mobile }: { config: CheckoutCustomizationConfig; product: any; plan: any; mobile: boolean }) {
  const orderBumpEnabled = Boolean(product.order_bump_price)
  const price = Number(plan?.price || 0)
  const bumpPrice = Number(product.order_bump_price || 0)
  const productImage = config.mockupImageUrl || product.logo_url
  const buyerFields = [
    { label: 'Nome completo', icon: User, wide: true, placeholder: 'Seu nome completo' },
    { label: 'E-mail', icon: Mail, wide: true, placeholder: 'seu@email.com' },
    { label: 'CPF/CNPJ', icon: ShieldCheck, placeholder: 'Somente numeros' },
    { label: 'Celular', icon: Phone, placeholder: 'DDD + numero' },
  ]

  return (
    <div style={{ backgroundColor: config.backgroundColor }} className="text-slate-900">
      <div className="border-b border-slate-200 bg-white/95 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {productImage ? (
              <img src={productImage} alt={product.name} className="h-10 w-10 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-sm font-black" style={{ color: config.primaryColor }}>{product.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="text-sm font-black text-slate-950">{product.name}</p>
              <p className="text-xs font-semibold text-slate-500">Checkout seguro Flowyn</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {config.securityText}
          </div>
        </div>
      </div>

      {config.blocks.banner && config.bannerImageUrl && (
        <div className="mx-auto max-w-6xl px-5 pt-6">
          <img src={config.bannerImageUrl} alt="Banner" className="h-40 w-full rounded-[26px] border border-slate-200 object-cover shadow-sm" />
        </div>
      )}

      <div className={`mx-auto grid max-w-6xl gap-5 px-5 py-6 ${mobile ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_300px]'}`}>
        <main className="space-y-6">
          <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                {productImage ? (
                  <img src={productImage} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <UploadCloud className="h-7 w-7 text-slate-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: config.primaryColor }}>
                  Acesso imediato
                </p>
                <h1 className="text-2xl font-black leading-tight text-slate-950">{config.headline}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{config.subheadline}</p>
              </div>
            </div>

            {config.blocks.benefits && config.benefits.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {config.benefits.map(benefit => (
                  <div key={benefit} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: config.primaryColor }} />
                    {benefit}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Pagamento</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Dados do comprador</h2>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">Cartao</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {buyerFields.map(({ label, icon: Icon, wide, placeholder }) => (
                <div key={label} className={wide ? 'sm:col-span-2' : ''}>
                  <p className="mb-2 text-xs font-bold text-slate-700">{label}</p>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-400">
                    <Icon className="h-4 w-4 text-slate-300" />
                    {placeholder}
                  </div>
                </div>
              ))}
            </div>

            {orderBumpEnabled && (
              <div className="mt-5 rounded-2xl border-2 border-dashed bg-slate-50 p-4" style={{ borderColor: `${config.primaryColor}66` }}>
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded border border-slate-300 bg-white" />
                  {config.orderBumpImageUrl && <img src={config.orderBumpImageUrl} alt="Order bump" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />}
                  <div className="min-w-0">
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black uppercase text-red-600">Oferta especial</span>
                    <p className="mt-2 text-sm font-black text-slate-950">{product.order_bump_title || 'Adicionar ao pedido'}</p>
                    <p className="mt-1 text-xs text-slate-500">{product.order_bump_description || 'Adicione este bonus ao pedido.'}</p>
                    <p className="mt-2 text-sm font-black" style={{ color: config.primaryColor }}>R$ {bumpPrice.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
                <CreditCard className="h-4 w-4" style={{ color: config.primaryColor }} />
                Cartao de credito
              </h3>
              <div className="space-y-3">
                <PreviewInput label="Nome impresso no cartao" placeholder="Como aparece no cartao" />
                <PreviewInput label="Numero do cartao" placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-3 gap-3">
                  <PreviewInput label="" placeholder="MM" />
                  <PreviewInput label="" placeholder="AAAA" />
                  <PreviewInput label="" placeholder="CVV" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PreviewInput label="CEP do titular" placeholder="00000000" icon={MapPin} />
                  <PreviewInput label="Numero" placeholder="123" />
                </div>
              </div>
            </div>

            <button style={{ backgroundColor: config.primaryColor }} className="mt-5 w-full rounded-xl px-5 py-4 text-sm font-black text-white shadow-lg">
              <Lock className="mr-2 inline h-4 w-4" />
              {config.buttonText} R$ {price.toFixed(2).replace('.', ',')}
            </button>
            <p className="mt-4 text-center text-xs font-semibold text-slate-400">Pagamento protegido pela Asaas. Os dados do cartao nao sao armazenados pela Flowyn.</p>
          </section>
        </main>

        <aside>
          <div className="sticky top-5 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <div className="border-b border-slate-100 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Resumo do pedido</p>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                {productImage && <img src={productImage} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />}
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{product.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{plan?.name || 'Acesso completo'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-500">Produto</span><strong className="text-right text-slate-900">{product.name}</strong></div>
              <div className="flex justify-between gap-4 text-sm"><span className="text-slate-500">Produtor</span><strong className="text-right text-slate-900">{product.owner?.full_name || 'Anonimo'}</strong></div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><strong>R$ {price.toFixed(2).replace('.', ',')}</strong></div>
                <div className="mt-3 flex justify-between text-sm"><span className="text-slate-500">Taxa Flowyn</span><strong className="text-emerald-600">R$ 0,00</strong></div>
              </div>
              <div className="flex items-end justify-between border-t border-slate-100 pt-5">
                <span className="font-black text-slate-950">Total</span>
                <strong className="text-2xl font-black text-slate-950">R$ {price.toFixed(2).replace('.', ',')}</strong>
              </div>
            </div>
            <div className="space-y-3 bg-slate-50 p-5">
              <div className="rounded-2xl bg-white p-4 text-xs font-bold leading-5 text-slate-500">{config.securityText}. A Flowyn nao armazena os dados do cartao.</div>
              {config.blocks.guarantee && (
                <div className="rounded-2xl bg-white p-4 text-xs font-bold leading-5 text-slate-500">{config.guaranteeText}</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PreviewInput({ label, placeholder, icon: Icon }: { label: string; placeholder: string; icon?: typeof MapPin }) {
  return (
    <div>
      {label && <p className="mb-2 text-xs font-bold text-slate-700">{label}</p>}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">
        {Icon && <Icon className="h-4 w-4 text-slate-300" />}
        {placeholder}
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111] p-5">
      <h3 className="text-sm font-black uppercase text-white/45">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-white/35">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-[#00e88a]" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-[#00e88a]" />
      )}
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold uppercase text-white/35">{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-16 rounded-lg border border-white/10 bg-transparent" />
    </label>
  )
}

function blockLabel(key: string) {
  const labels: Record<string, string> = {
    banner: 'Banner',
    benefits: 'Benefícios',
    testimonials: 'Depoimentos',
    faq: 'FAQ',
    guarantee: 'Garantia',
  }
  return labels[key] || key
}
