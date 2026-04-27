'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function loginForOAuth(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const client_id = formData.get('client_id') as string
  const redirect_uri = formData.get('redirect_uri') as string
  const state = formData.get('state') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Build the URL to redirect back to
  const params = new URLSearchParams()
  if (client_id) params.append('client_id', client_id)
  if (redirect_uri) params.append('redirect_uri', redirect_uri)
  if (state) params.append('state', state)

  if (error) {
    params.append('error', 'E-mail ou senha inválidos.')
    redirect(`/oauth/authorize?${params.toString()}`)
  }

  // Successfully logged in, go back to authorize page to approve
  redirect(`/oauth/authorize?${params.toString()}`)
}
