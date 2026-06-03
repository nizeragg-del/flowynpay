"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'

type CourseLessonFormProps = {
  moduleId: string
  userId: string
  createLesson: (formData: FormData) => Promise<void>
}

export function CourseLessonForm({ moduleId, userId, createLesson }: CourseLessonFormProps) {
  const [videoFilePath, setVideoFilePath] = useState('')
  const [materialFilePaths, setMaterialFilePaths] = useState<string[]>([])

  return (
    <form action={createLesson} className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-2">
      <input type="hidden" name="module_id" value={moduleId} />
      <input type="hidden" name="video_file_path" value={videoFilePath} />
      <input type="hidden" name="material_file_paths" value={JSON.stringify(materialFilePaths)} />

      <Input name="title" placeholder="Título da aula" required />
      <Input name="duration_minutes" placeholder="Duração em minutos" type="number" />
      <Input name="video_url" placeholder="URL externa do vídeo" />
      <Input name="content_url" placeholder="Material complementar externo" />

      <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
        <FileUpload
          mode="video"
          label="Vídeo nativo Flowyn"
          hint="MP4, WebM ou MOV. O aluno verá em player protegido por URL assinada."
          userId={userId}
          folder="lesson-videos"
          currentUrl={videoFilePath}
          onUpload={(path) => setVideoFilePath(path)}
          onRemove={() => setVideoFilePath('')}
        />
        <FileUpload
          mode="file"
          label="Materiais nativos"
          hint="PDF, ZIP, EPUB ou arquivos de apoio."
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

      <textarea name="description" placeholder="Descrição da aula" className="md:col-span-2 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00e88a]" />
      <label className="flex items-center gap-2 text-sm font-semibold text-white/50">
        <input type="checkbox" name="is_free_preview" className="accent-[#00e88a]" />
        Aula preview grátis
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black transition hover:bg-[#04f294]">
        <Plus className="h-4 w-4" />
        Adicionar aula
      </button>
    </form>
  )
}

function Input({
  name,
  placeholder,
  type = 'text',
  required = false,
}: {
  name: string
  placeholder: string
  type?: string
  required?: boolean
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00e88a]"
      placeholder={placeholder}
    />
  )
}
