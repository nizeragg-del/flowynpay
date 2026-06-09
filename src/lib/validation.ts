export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function isValidPassword(value: string) {
  return String(value || '').trim().length >= 6
}

export function isValidFullName(value: string) {
  return String(value || '').trim().length >= 2
}

export function isValidCpfCnpj(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length === 11 || digits.length === 14
}

export function isValidPhone(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function isValidCardNumber(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length >= 13 && digits.length <= 19
}

export function isValidCvv(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits.length >= 3 && digits.length <= 4
}

export function isSafeRedirectPath(value: string | null | undefined) {
  if (!value) return false
  const trimmed = String(value).trim()
  if (!trimmed.startsWith('/')) return false
  if (trimmed.startsWith('//')) return false
  if (trimmed.includes('\n') || trimmed.includes('\r')) return false
  return true
}
