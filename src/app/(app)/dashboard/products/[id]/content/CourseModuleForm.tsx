'use client'

import type { ReactNode } from 'react'
import { useActionState, useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle2, Layers, Plus } from 'lucide-react'
import type { CourseContentFormState } from './form-state'
import { initialCourseContentFormState } from './form-state'

type CourseModuleFormProps = {
  createModule: (state: CourseContentFormState, formData: FormData) => Promise<CourseContentFormState>
}

export function CourseModuleForm({ createModule }: CourseModuleFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(createModule, initialCourseContentFormState)

  useEffect(() => {
    if (state.ok) formRef.current?.reset()
  }, [state.ok, state.message])

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#00e88a]/10 p-2.5 text-[#00e88a]">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Novo modulo</h2>
          <p className="mt-1 text-xs leading-5 text-white/45">Use modulos para organizar a trilha do aluno em etapas claras.</p>
        </div>
      </div>

      <form ref={formRef} action={action} className="mt-5 space-y-4">
        <Field label="Nome do modulo" required hint="Ex: Boas-vindas, Fundamentos, Aulas praticas">
          <input
            name="title"
            required
            minLength={3}
            className={inputClass}
            placeholder="Digite o nome do modulo"
          />
        </Field>

        <Field label="Descricao curta" hint="Opcional. Ajuda o aluno a entender o objetivo do modulo.">
          <textarea
            name="description"
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="O que o aluno vai aprender aqui?"
          />
        </Field>

        <FormMessage state={state} />

        <button
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#04f294] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Plus className="h-4 w-4" />}
          {pending ? 'Criando modulo...' : 'Criar modulo'}
        </button>
      </form>
    </div>
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

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00e88a] focus:ring-2 focus:ring-[#00e88a]/20'
