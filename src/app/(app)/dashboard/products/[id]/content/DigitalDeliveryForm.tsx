'use client'

import type { ReactNode } from 'react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, PackageCheck, Save } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import type { CourseContentFormState } from './form-state'
import { initialCourseContentFormState } from './form-state'

type DigitalDeliveryFormProps = {
  userId: string
  product: {
    delivery_type?: string | null
    delivery_url?: string | null
    deliverable_file_paths?: string[] | null
  }
  updateDigitalDelivery: (state: CourseContentFormState, formData: FormData) => Promise<CourseContentFormState>
}

export function DigitalDeliveryForm({ userId, product, updateDigitalDelivery }: DigitalDeliveryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [deliveryType, setDeliveryType] = useState(product.delivery_type || 'external')
  const [filePaths, setFilePaths] = useState<string[]>(Array.isArray(product.deliverable_file_paths) ? product.deliverable_file_paths : [])
  const [state, action, pending] = useActionState(updateDigitalDelivery, initialCourseContentFormState)

  useEffect(() => {
    if (state.ok) formRef.current?.querySelector<HTMLInputElement>('input[name="delivery_url"]')?.blur()
  }, [state.ok, state.message])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-white/10 bg-[#111] p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-2xl bg-[#00e88a]/10 p-3 text-[#00e88a]">
            <PackageCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Entrega digital</h2>
            <p className="mt-1 text-sm leading-6 text-white/45">
              Configure o que o comprador recebe automaticamente depois do pagamento aprovado.
            </p>
          </div>
        </div>

        <form ref={formRef} action={action} className="space-y-5">
          <input type="hidden" name="delivery_type" value={deliveryType} />
          <input type="hidden" name="deliverable_file_paths" value={JSON.stringify(filePaths)} />

          <div>
            <span className="mb-2 block text-sm font-semibold text-white/75">Modo de entrega</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <ModeButton active={deliveryType === 'external'} onClick={() => setDeliveryType('external')} title="Link externo" text="Use Drive, Notion, Hotmart Club externo ou outra URL." />
              <ModeButton active={deliveryType === 'platform'} onClick={() => setDeliveryType('platform')} title="Arquivos Flowyn" text="Hospede PDFs, ZIPs e materiais dentro da Flowyn." />
            </div>
          </div>

          <Field label="Link de acesso" required={deliveryType === 'external'} hint={deliveryType === 'external' ? 'Obrigatorio para entrega por link externo.' : 'Opcional se voce tambem quiser enviar um link junto dos arquivos.'}>
            <input
              name="delivery_url"
              type="url"
              defaultValue={product.delivery_url || ''}
              className={inputClass}
              placeholder="https://..."
            />
          </Field>

          <FileUpload
            mode="file"
            label="Arquivos de entrega"
            hint="PDF, ZIP, EPUB, planilhas ou materiais de apoio. Opcional para link externo."
            userId={userId}
            folder="product-files"
            multiple
            currentUrls={filePaths}
            onUpload={(paths) => setFilePaths(paths)}
            onRemove={(index) => {
              if (index === undefined) return
              setFilePaths(paths => paths.filter((_, idx) => idx !== index))
            }}
          />

          <FormMessage state={state} />

          <button
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#04f294] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Save className="h-4 w-4" />}
            {pending ? 'Salvando entrega...' : 'Salvar entrega digital'}
          </button>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <h3 className="text-lg font-black text-white">Checklist</h3>
          <div className="mt-5 space-y-3 text-sm text-white/55">
            <CheckItem done={deliveryType === 'platform' || Boolean(product.delivery_url)}>Modo de entrega definido</CheckItem>
            <CheckItem done={deliveryType === 'external' ? Boolean(product.delivery_url) : filePaths.length > 0}>Conteudo anexado ou link preenchido</CheckItem>
            <CheckItem done>Envio automatico apos pagamento</CheckItem>
          </div>
        </div>
        <div className="rounded-3xl border border-[#00e88a]/20 bg-[#00e88a]/10 p-5 text-sm leading-6 text-[#c7ffe3]">
          Para e-books e materiais digitais, o aluno recebe o acesso por e-mail e tambem encontra o produto em Meus Acessos quando criar a senha.
        </div>
      </aside>
    </div>
  )
}

function ModeButton({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${active ? 'border-[#00e88a] bg-[#00e88a]/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}
    >
      <span className="block font-black text-white">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-white/40">{text}</span>
    </button>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-white/75">
        {label}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${required ? 'bg-[#00e88a]/10 text-[#00e88a]' : 'bg-white/5 text-white/35'}`}>
          {required ? 'Obrigatorio' : 'Opcional'}
        </span>
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-white/35">{hint}</span>}
    </label>
  )
}

function FormMessage({ state }: { state: CourseContentFormState }) {
  if (!state.message) return null
  return (
    <div className={`flex items-start gap-2 rounded-2xl border px-3 py-2 text-sm ${state.ok ? 'border-[#00e88a]/25 bg-[#00e88a]/10 text-[#baffdd]' : 'border-red-500/25 bg-red-500/10 text-red-200'}`}>
      {state.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00e88a]" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />}
      {state.message}
    </div>
  )
}

function CheckItem({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className={`h-4 w-4 ${done ? 'text-[#00e88a]' : 'text-white/20'}`} />
      {children}
    </div>
  )
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00e88a] focus:ring-2 focus:ring-[#00e88a]/20'
