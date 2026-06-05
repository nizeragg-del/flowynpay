'use client'

import type { ReactNode } from 'react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Plus, Video } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import type { CourseContentFormState } from './form-state'
import { initialCourseContentFormState } from './form-state'

type CourseLessonFormProps = {
  moduleId: string
  userId: string
  createLesson: (state: CourseContentFormState, formData: FormData) => Promise<CourseContentFormState>
}

export function CourseLessonForm({ moduleId, userId, createLesson }: CourseLessonFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [videoFilePath, setVideoFilePath] = useState('')
  const [materialFilePaths, setMaterialFilePaths] = useState<string[]>([])
  const [state, action, pending] = useActionState(createLesson, initialCourseContentFormState)

  useEffect(() => {
    if (!state.ok) return
    formRef.current?.reset()
    setVideoFilePath('')
    setMaterialFilePaths([])
  }, [state.ok, state.message])

  return (
    <form ref={formRef} action={action} className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <input type="hidden" name="module_id" value={moduleId} />
      <input type="hidden" name="video_file_path" value={videoFilePath} />
      <input type="hidden" name="material_file_paths" value={JSON.stringify(materialFilePaths)} />

      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-white/5 p-2.5 text-[#00e88a]">
          <Video className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-black text-white">Adicionar aula</h4>
          <p className="mt-1 text-xs leading-5 text-white/40">Preencha o titulo e adicione video, materiais ou links conforme a entrega.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titulo da aula" required hint="Nome que aparece para o aluno.">
          <input name="title" required minLength={3} className={inputClass} placeholder="Ex: Aula 01 - Introducao" />
        </Field>

        <Field label="Duracao em minutos" hint="Opcional. Ajuda o aluno a planejar o estudo.">
          <input name="duration_minutes" type="number" min="0" className={inputClass} placeholder="Ex: 12" />
        </Field>

        <Field label="URL externa do video" hint="Opcional se voce usar upload nativo.">
          <input name="video_url" type="url" className={inputClass} placeholder="https://..." />
        </Field>

        <Field label="Material complementar externo" hint="Opcional. Link para Notion, Drive, planilha etc.">
          <input name="content_url" type="url" className={inputClass} placeholder="https://..." />
        </Field>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <FileUpload
          mode="video"
          label="Video nativo Flowyn"
          hint="Opcional. MP4, WebM ou MOV com player por URL assinada."
          userId={userId}
          folder="lesson-videos"
          currentUrl={videoFilePath}
          onUpload={(path) => setVideoFilePath(path)}
          onRemove={() => setVideoFilePath('')}
        />
        <FileUpload
          mode="file"
          label="Materiais nativos"
          hint="Opcional. PDF, ZIP, EPUB ou arquivos de apoio."
          userId={userId}
          folder="lesson-materials"
          multiple
          currentUrls={materialFilePaths}
          onUpload={(paths) => setMaterialFilePaths(paths)}
          onRemove={(index) => {
            if (index === undefined) return
            setMaterialFilePaths(paths => paths.filter((_, idx) => idx !== index))
          }}
        />
      </div>

      <div className="mt-4">
        <Field label="Descricao da aula" hint="Opcional. Explique objetivo, contexto ou instrucoes.">
          <textarea name="description" className={`${inputClass} min-h-24 resize-y`} placeholder="Resumo da aula para o aluno" />
        </Field>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-white/50">
          <input type="checkbox" name="is_free_preview" className="accent-[#00e88a]" />
          Aula preview gratis
        </label>

        <button
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#04f294] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Plus className="h-4 w-4" />}
          {pending ? 'Adicionando aula...' : 'Adicionar aula'}
        </button>
      </div>

      <FormMessage state={state} />
    </form>
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
    <div className={`mt-4 flex items-start gap-2 rounded-2xl border px-3 py-2 text-sm ${state.ok ? 'border-[#00e88a]/25 bg-[#00e88a]/10 text-[#baffdd]' : 'border-red-500/25 bg-red-500/10 text-red-200'}`}>
      {state.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00e88a]" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />}
      {state.message}
    </div>
  )
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#00e88a] focus:ring-2 focus:ring-[#00e88a]/20'
