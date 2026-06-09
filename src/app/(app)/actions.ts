'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOutAction() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[signOutAction] Erro:', error)
    }
  } catch (err) {
    console.error('[signOutAction] Erro inesperado:', err)
  }
  redirect('/')
}
