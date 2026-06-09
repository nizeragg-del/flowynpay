import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { TestCookieForm } from './TestCookieForm'

async function cookieAction() {
  'use server'
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    console.log('[cookieAction] Number of cookies:', allCookies.length)

    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return { ok: false, message: `Erro auth: ${error.message}` }
    }

    return { ok: true, message: `Usuário autenticado: ${user?.email || 'N/A'}` }
  } catch (err) {
    console.error('[cookieAction] Error:', err)
    return { ok: false, message: `Erro: ${err instanceof Error ? err.message : 'desconhecido'}` }
  }
}

export default function TestCookiePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Teste de Cookie + Supabase</h1>
      <TestCookieForm cookieAction={cookieAction} />
    </div>
  )
}
