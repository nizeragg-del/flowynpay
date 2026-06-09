'use server'

export async function simpleAction() {
  console.log('[simpleAction] Server action called successfully')
  return { ok: true, message: 'Server action funcionou!' }
}
