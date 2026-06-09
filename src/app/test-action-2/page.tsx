import { simpleAction } from '../test-actions'
import { TestForm } from '../test-action/TestForm'

export default function TestAction2Page() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Teste de Server Action (arquivo separado)</h1>
      <TestForm testAction={simpleAction} />
    </div>
  )
}
