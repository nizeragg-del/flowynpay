"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getResendClient } from '@/lib/resend'
import { learningNotificationEmail } from '@/lib/email-templates'
import { getAppUrl } from '@/lib/app-url'

export async function toggleLessonProgress(productId: string, lessonId: string, completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('lesson_progress').upsert({
    user_id: user.id,
    product_id: productId,
    lesson_id: lessonId,
    completed_at: completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })

  revalidatePath(`/learn/${productId}`)
}

export async function toggleMentorshipTask(productId: string, taskId: string, completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('mentorship_tasks')
    .update({
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('student_id', user.id)

  revalidatePath(`/learn/${productId}`)
}

export async function addLessonComment(productId: string, lessonId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const body = String(formData.get('body') || '').trim()
  if (!body) return

  await supabase.from('lesson_comments').insert({
    product_id: productId,
    lesson_id: lessonId,
    user_id: user.id,
    body,
  })

  revalidatePath(`/learn/${productId}`)
}

export async function saveIntakeResponses(productId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const answers: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('question_')) {
      answers[key.replace('question_', '')] = String(value || '').trim()
    }
  }

  await supabase.from('mentorship_intake_responses').upsert({
    product_id: productId,
    student_id: user.id,
    answers,
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'product_id,student_id' })

  revalidatePath(`/learn/${productId}`)
}

export async function bookMentorshipSlot(productId: string, slotId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const admin = createAdminClient()
  const { data: access } = await admin
    .from('student_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (!access) return

  const { data: slot } = await admin
    .from('mentorship_availability_slots')
    .select('id, starts_at, ends_at, meeting_url, booked_by')
    .eq('id', slotId)
    .eq('product_id', productId)
    .is('booked_by', null)
    .maybeSingle()

  if (!slot) return

  const { data: session } = await admin
    .from('mentorship_sessions')
    .insert({
      product_id: productId,
      student_id: user.id,
      title: 'Sessão agendada',
      description: 'Horário reservado pelo aluno.',
      scheduled_at: slot.starts_at,
      meeting_url: slot.meeting_url,
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (session) {
    const { data: reservedSlot } = await admin
      .from('mentorship_availability_slots')
      .update({
        booked_by: user.id,
        booked_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', slotId)
      .is('booked_by', null)
      .select('id')
      .maybeSingle()

    if (!reservedSlot) {
      await admin.from('mentorship_sessions').delete().eq('id', session.id)
      revalidatePath(`/learn/${productId}`)
      return
    }

    const resendClient = getResendClient()
    if (resendClient && user.email) {
      const { data: product } = await admin.from('products').select('name').eq('id', productId).single()
      const appUrl = getAppUrl()
      await resendClient.emails.send({
        from: 'Flowyn <noreply@flowyn.com.br>',
        to: user.email,
        subject: `Sessão agendada em "${product?.name || 'sua mentoria'}"`,
        html: learningNotificationEmail({
          title: 'Sessão reservada',
          message: `Sua sessão foi marcada para ${new Date(slot.starts_at).toLocaleString('pt-BR')}.`,
          actionLabel: 'Ver jornada',
          actionUrl: `${appUrl}/learn/${productId}`,
        }),
      })
      await admin.from('notification_events').insert({
        user_id: user.id,
        product_id: productId,
        recipient_email: user.email,
        event_type: 'mentorship_session_booked',
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: { session_id: session.id, slot_id: slotId },
      })
    }
  }

  revalidatePath(`/learn/${productId}`)
}
