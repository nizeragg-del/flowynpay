'use client'

import { useState } from 'react'

export function TestCookieForm({
  cookieAction,
}: {
  cookieAction: () => Promise<{ ok: boolean; message: string }>
}) {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setResult(null)
    setError(null)
    try {
      const res = await cookieAction()
      if (res.ok) {
        setResult(res.message)
      } else {
        setError(res.message)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  return (
    <div>
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          background: '#f97316',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '16px',
        }}
      >
        Testar Server Action com Cookies + Supabase
      </button>
      {result && (
        <p style={{ marginTop: '16px', color: '#16a34a', fontWeight: 600 }}>
          {result}
        </p>
      )}
      {error && (
        <p style={{ marginTop: '16px', color: '#dc2626', fontWeight: 600 }}>
          Erro: {error}
        </p>
      )}
    </div>
  )
}
