import { TestForm } from './TestForm'

async function testAction() {
  'use server'
  console.log('[testAction] Server action called successfully')
  return { ok: true, message: 'Server action funcionou!' }
}

export default function TestActionPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Teste de Server Action</h1>
      <TestForm testAction={testAction} />
    </div>
  )
}
