const DEFAULT_API_BASE_URL = 'http://localhost:3000'

// Resolves a VITE_* env value by trying each key in order, ignoring empty strings.
// Keeps the project compatible with the original repo's variable names while letting
// the local .env names keep working as a fallback.
export const resolveEnv = (...keys: string[]): string => {
  for (const key of keys) {
    const value = import.meta.env[key]

    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }

  return ''
}

// Original repo exposes the API host as VITE_API_URL; the local .env uses VITE_API_BASE_URL.
export const getApiBaseUrl = (): string => {
  const baseUrl = resolveEnv('VITE_API_URL', 'VITE_API_BASE_URL') || DEFAULT_API_BASE_URL
  return baseUrl.replace(/\/$/, '')
}
