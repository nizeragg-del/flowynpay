import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  Clapperboard,
  Download,
  ExternalLink,
  FileText,
  Play,
  Route,
  Target,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { claimPendingStudentAccess } from '@/lib/student-access'
import { addLessonComment, bookMentorshipSlot, saveIntakeResponses, toggleLessonProgress, toggleMentorshipTask } from './actions'

export const dynamic = 'force-dynamic'

export default async function LearnProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  await claimPendingStudentAccess(user.id, user.email)

  const admin = createAdminClient()
  const { data: access } = await admin
    .from('student_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', id)
    .maybeSingle()

  if (!access) redirect('/learn')

  await admin
    .from('student_access')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('product_id', id)

  const { data: product } = await admin
    .from('products')
    .select('id, name, short_description, description, cover_url, product_type, category, owner:profiles(full_name)')
    .eq('id', id)
    .single()

  if (!product) redirect('/learn')

  if ((product as any).product_type === 'mentoria') {
    return <MentorshipExperience product={product as any} userId={user.id} />
  }

  return <CourseExperience product={product as any} userId={user.id} />
}

async function CourseExperience({ product, userId }: { product: any; userId: string }) {
  const admin = createAdminClient()
  const { data: modules } = await admin
    .from('course_modules')
    .select('*, lessons:course_lessons(*)')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true })

  const { data: progressRows } = await admin
    .from('lesson_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .eq('product_id', product.id)

  const completedLessonIds = new Set((progressRows || []).filter((row: any) => row.completed_at).map((row: any) => row.lesson_id))
  const moduleRows = (modules || []) as any[]
  const lessons = moduleRows.flatMap(module => [...(module.lessons || [])].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)))
  const activeLesson = lessons.find(lesson => !completedLessonIds.has(lesson.id)) || lessons[0]
  const progressPercent = lessons.length > 0 ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0
  let signedVideoUrl: string | null = null
  let signedMaterials: Array<{ label: string; url: string }> = []

  if (activeLesson?.video_file_path) {
    const { data: signed } = await admin.storage
      .from('product-files')
      .createSignedUrl(activeLesson.video_file_path, 60 * 60 * 2)
    signedVideoUrl = signed?.signedUrl || null
  }

  if (Array.isArray(activeLesson?.material_file_paths)) {
    for (const path of activeLesson.material_file_paths) {
      const { data: signed } = await admin.storage
        .from('product-files')
        .createSignedUrl(path, 60 * 60 * 2)
      if (signed?.signedUrl) signedMaterials.push({ label: path.split('/').pop() || 'Material', url: signed.signedUrl })
    }
  }

  const { data: comments } = activeLesson
    ? await admin
        .from('lesson_comments')
        .select('id, body, created_at, user:profiles(full_name)')
        .eq('lesson_id', activeLesson.id)
        .order('created_at', { ascending: true })
    : { data: [] }

  let certificate: any = null
  if (lessons.length > 0 && completedLessonIds.size === lessons.length) {
    const { data } = await admin
      .from('course_certificates')
      .upsert({ product_id: product.id, user_id: userId }, { onConflict: 'product_id,user_id' })
      .select('*')
      .single()
    certificate = data
  } else {
    const { data } = await admin
      .from('course_certificates')
      .select('*')
      .eq('product_id', product.id)
      .eq('user_id', userId)
      .maybeSingle()
    certificate = data
  }

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Biblioteca
      </Link>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
            <div className="relative aspect-video bg-black">
              {signedVideoUrl ? (
                <video controls className="h-full w-full bg-black" src={signedVideoUrl} poster={product.cover_url || undefined} />
              ) : activeLesson?.video_url ? (
                <iframe
                  src={activeLesson.video_url}
                  title={activeLesson.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : product.cover_url ? (
                <img src={product.cover_url} alt={product.name} className="h-full w-full object-cover opacity-70" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgba(0,232,138,0.22),transparent_35%),linear-gradient(135deg,#181818,#050505)]">
                  <Play className="h-16 w-16 text-[#00e88a]" />
                </div>
              )}
              <div className="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-[#00e88a]">
                Flowyn Play
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold uppercase text-[#00e88a]">{product.category || 'Curso'}</p>
              <h1 className="mt-1 text-3xl font-black text-white">{activeLesson?.title || product.name}</h1>
              <p className="mt-2 text-sm leading-6 text-white/55">{activeLesson?.description || product.short_description || product.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
              {activeLesson?.content_url && (
                <a href={activeLesson.content_url} target="_blank" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white">
                  <Download className="h-4 w-4" />
                  Material complementar
                </a>
              )}
              {signedMaterials.map(material => (
                <a key={material.url} href={material.url} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white">
                  <Download className="h-4 w-4" />
                  {material.label}
                </a>
              ))}
              </div>
            </div>
          </div>

          {activeLesson && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#111] p-6">
              <h2 className="text-lg font-black text-white">Comentários da aula</h2>
              <div className="mt-4 space-y-3">
                {(comments || []).length === 0 ? (
                  <p className="text-sm text-white/35">Nenhuma dúvida ou comentário ainda.</p>
                ) : (
                  (comments || []).map((comment: any) => (
                    <div key={comment.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-white/75">{comment.body}</p>
                      <p className="mt-2 text-xs text-white/35">{comment.user?.full_name || 'Aluno'} · {new Date(comment.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  ))
                )}
              </div>
              <form action={addLessonComment.bind(null, product.id, activeLesson.id)} className="mt-4 flex gap-3">
                <input name="body" required placeholder="Escreva uma dúvida ou comentário" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00e88a]" />
                <button className="rounded-xl bg-[#00e88a] px-5 py-3 text-sm font-black text-black">Enviar</button>
              </form>
            </div>
          )}
        </div>

        <aside className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{product.name}</h2>
              <span className="text-sm font-black text-[#00e88a]">{progressPercent}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-[#00e88a]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {certificate && (
            <div className="rounded-3xl border border-[#00e88a]/25 bg-[#00e88a]/10 p-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <CheckCircle2 className="h-5 w-5 text-[#00e88a]" />
                Certificado liberado
              </h2>
              <p className="mt-2 text-sm text-[#c7ffe3]">Código: {certificate.certificate_code}</p>
              <Link href={`/learn/${product.id}/certificate`} className="mt-4 inline-flex rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black">
                Ver certificado
              </Link>
            </div>
          )}

          <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
            {moduleRows.map((module, moduleIndex) => {
              const sortedLessons = [...(module.lessons || [])].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
              return (
                <div key={module.id} className="rounded-3xl border border-white/10 bg-[#111] p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#00e88a]/10 text-xs text-[#00e88a]">{moduleIndex + 1}</span>
                    {module.title}
                  </h3>
                  <div className="space-y-2">
                    {sortedLessons.map((lesson) => {
                      const completed = completedLessonIds.has(lesson.id)
                      const action = toggleLessonProgress.bind(null, product.id, lesson.id, !completed)
                      return (
                        <form key={lesson.id} action={action} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                          <button className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${completed ? 'border-[#00e88a] bg-[#00e88a] text-black' : 'border-white/15 text-white/30'}`}>
                            {completed ? <Check className="h-4 w-4" /> : <Play className="h-3.5 w-3.5" />}
                          </button>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">{lesson.title}</p>
                            <p className="text-xs text-white/35">{lesson.duration_minutes ? `${lesson.duration_minutes} min` : 'Aula'}</p>
                          </div>
                        </form>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </section>
    </div>
  )
}

async function MentorshipExperience({ product, userId }: { product: any; userId: string }) {
  const admin = createAdminClient()
  const { data: program } = await admin
    .from('mentorship_programs')
    .select('*')
    .eq('product_id', product.id)
    .maybeSingle()

  const { data: sessions } = await admin
    .from('mentorship_sessions')
    .select('*')
    .eq('product_id', product.id)
    .or(`student_id.is.null,student_id.eq.${userId}`)
    .order('sort_order', { ascending: true })

  const { data: tasks } = await admin
    .from('mentorship_tasks')
    .select('*')
    .eq('product_id', product.id)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  const { data: intake } = await admin
    .from('mentorship_intake_responses')
    .select('*')
    .eq('product_id', product.id)
    .eq('student_id', userId)
    .maybeSingle()

  const { data: slots } = await admin
    .from('mentorship_availability_slots')
    .select('*')
    .eq('product_id', product.id)
    .is('booked_by', null)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(8)

  const sessionRows = (sessions || []) as any[]
  const taskRows = (tasks || []) as any[]
  const completedTasks = taskRows.filter(task => task.completed_at).length
  const questions = Array.isArray(program?.intake_questions) ? program.intake_questions : []
  const answers = (intake?.answers || {}) as Record<string, string>
  const slotRows = (slots || []) as any[]

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Biblioteca
      </Link>

      <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] min-h-[360px]">
        {product.cover_url ? (
          <img src={product.cover_url} alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,232,138,0.25),transparent_32%),linear-gradient(135deg,#171717,#050505)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/75 to-transparent" />
        <div className="relative flex min-h-[360px] max-w-3xl flex-col justify-end p-8 md:p-10">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-[#00e88a]">
            <Route className="h-3.5 w-3.5" />
            Flowyn Journey
          </div>
          <h1 className="text-4xl font-black text-white md:text-5xl">{program?.headline || product.name}</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">{program?.promise || product.short_description || product.description}</p>
          {program?.meeting_url && (
            <a href={program.meeting_url} target="_blank" className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[#00e88a] px-5 py-3 text-sm font-black text-black transition hover:bg-[#04f294]">
              Entrar na sala <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#111] p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-white">
            <Target className="h-5 w-5 text-[#00e88a]" />
            Mapa da jornada
          </h2>
          <div className="space-y-4">
            {sessionRows.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 p-8 text-sm text-white/45">Seu mentor ainda está configurando as etapas.</p>
            ) : (
              sessionRows.map((session, index) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00e88a]/10 font-black text-[#00e88a]">{index + 1}</div>
                    <div>
                      <h3 className="font-black text-white">{session.title}</h3>
                      {session.description && <p className="mt-1 text-sm text-white/45">{session.description}</p>}
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-white/40">
                        <span className="rounded-full bg-white/5 px-3 py-1">{session.status}</span>
                        {session.scheduled_at && <span className="rounded-full bg-white/5 px-3 py-1">{new Date(session.scheduled_at).toLocaleString('pt-BR')}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-5">
          {questions.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <FileText className="h-5 w-5 text-[#00e88a]" />
                Diagnóstico
              </h2>
              <form action={saveIntakeResponses.bind(null, product.id)} className="mt-4 space-y-3">
                {questions.map((question: string, index: number) => (
                  <label key={index} className="block">
                    <span className="mb-2 block text-xs font-bold uppercase text-white/35">{question}</span>
                    <textarea
                      name={`question_${index}`}
                      defaultValue={answers[String(index)] || ''}
                      required
                      className="min-h-20 w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00e88a]"
                    />
                  </label>
                ))}
                <button className="w-full rounded-xl bg-[#00e88a] px-4 py-3 text-sm font-black text-black">
                  {intake?.submitted_at ? 'Atualizar diagnóstico' : 'Enviar diagnóstico'}
                </button>
              </form>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <CalendarClock className="h-5 w-5 text-[#00e88a]" />
              Agendar sessão
            </h2>
            <div className="mt-4 space-y-2">
              {slotRows.length === 0 ? (
                <p className="text-sm text-white/35">Nenhum horário disponível no momento.</p>
              ) : (
                slotRows.map(slot => (
                  <form key={slot.id} action={bookMentorshipSlot.bind(null, product.id, slot.id)} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">{new Date(slot.starts_at).toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-white/35">Duração até {new Date(slot.ends_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <button className="rounded-xl bg-[#00e88a] px-3 py-2 text-xs font-black text-black">Reservar</button>
                    </div>
                  </form>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <CheckCircle2 className="h-5 w-5 text-[#00e88a]" />
              Execução
            </h2>
            <p className="mt-2 text-sm text-white/45">{completedTasks}/{taskRows.length} tarefas concluídas</p>
            <div className="mt-4 space-y-2">
              {taskRows.length === 0 ? (
                <p className="text-sm text-white/35">Nenhuma tarefa atribuída ainda.</p>
              ) : (
                taskRows.map(task => {
                  const completed = Boolean(task.completed_at)
                  const action = toggleMentorshipTask.bind(null, product.id, task.id, !completed)
                  return (
                    <form key={task.id} action={action} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <button className="flex w-full items-start gap-3 text-left">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${completed ? 'border-[#00e88a] bg-[#00e88a] text-black' : 'border-white/15 text-transparent'}`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-white">{task.title}</span>
                          {task.description && <span className="mt-1 block text-xs text-white/40">{task.description}</span>}
                        </span>
                      </button>
                    </form>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <CalendarClock className="h-5 w-5 text-[#00e88a]" />
              Próxima sessão
            </h2>
            <p className="mt-2 text-sm text-white/45">Use esta área para acompanhar sua evolução e próximos encontros.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
