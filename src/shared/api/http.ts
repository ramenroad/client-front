import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

export type ApiErrorPayload = {
  message?: string | string[]
  error?: string
  statusCode?: number
  [key: string]: unknown
}

export class ApiError extends Error {
  status?: number
  payload?: ApiErrorPayload

  constructor(message: string, status?: number, payload?: ApiErrorPayload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type HttpAuthAdapter = {
  getAccessToken: () => string | null | undefined
  getRefreshToken: () => string | null | undefined
  refreshTokens: (refreshToken: string) => Promise<AuthTokens>
  setTokens: (tokens: AuthTokens) => void
  clearTokens: () => void
  onUnauthorized?: () => void
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000'

let accessToken: string | null = null
let accessTokenProvider: (() => string | null | undefined) | null = null
let authAdapter: HttpAuthAdapter | null = null
let refreshPromise: Promise<AuthTokens> | null = null

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  withCredentials: true,
})

const hasAuthorizationHeader = (headers: InternalAxiosRequestConfig['headers'] | undefined) => {
  const axiosHeaders = AxiosHeaders.from(headers)
  return Boolean(axiosHeaders.get('Authorization'))
}

const shouldSkipTokenRefresh = (url?: string) => {
  if (!url) {
    return true
  }

  return url.includes('/auth/refresh') || url.includes('/auth/signin') || url.includes('/auth/apple')
}

const getAccessToken = () => authAdapter?.getAccessToken() ?? accessTokenProvider?.() ?? accessToken

http.interceptors.request.use((config) => {
  if (hasAuthorizationHeader(config.headers)) {
    return config
  }

  const token = getAccessToken()

  if (token) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !shouldSkipTokenRefresh(originalRequest.url)) {
      originalRequest._retry = true

      if (!authAdapter) {
        return Promise.reject(toApiError(error))
      }

      const refreshToken = authAdapter.getRefreshToken()

      if (!refreshToken) {
        authAdapter.clearTokens()
        authAdapter.onUnauthorized?.()
        return Promise.reject(toApiError(error))
      }

      try {
        refreshPromise ??= authAdapter.refreshTokens(refreshToken)
        const tokens = await refreshPromise
        refreshPromise = null

        authAdapter.setTokens(tokens)

        const headers = AxiosHeaders.from(originalRequest.headers)
        headers.set('Authorization', `Bearer ${tokens.accessToken}`)
        originalRequest.headers = headers

        return http(originalRequest)
      } catch (refreshError) {
        refreshPromise = null
        authAdapter.clearTokens()
        authAdapter.onUnauthorized?.()
        return Promise.reject(toApiError(refreshError))
      }
    }

    return Promise.reject(toApiError(error))
  },
)

export function initializeHttpAuth(adapter: HttpAuthAdapter | null) {
  authAdapter = adapter
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function setAccessTokenProvider(provider: (() => string | null | undefined) | null) {
  accessTokenProvider = provider
}

export function clearAccessToken() {
  accessToken = null
  accessTokenProvider = null
}

export type ApiRequestConfig = Omit<AxiosRequestConfig, 'method' | 'url'>
export type ApiRequestConfigWithoutData = Omit<ApiRequestConfig, 'data'>

export const apiClient = {
  async get<T>(url: string, config?: ApiRequestConfigWithoutData): Promise<T> {
    const { data } = await http.get<T>(url, config)
    return data
  },

  async post<T, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiRequestConfigWithoutData,
  ): Promise<T> {
    const response = await http.post<T>(url, data, config)
    return response.data
  },

  async patch<T, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiRequestConfigWithoutData,
  ): Promise<T> {
    const response = await http.patch<T>(url, data, config)
    return response.data
  },

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    const { data } = await http.delete<T>(url, config)
    return data
  },
}

export function appendIfDefined(
  formData: FormData,
  key: string,
  value: boolean | number | string | null | undefined,
) {
  if (value === undefined || value === null) return
  formData.append(key, String(value))
}

export function appendFiles(formData: FormData, key: string, files?: File[]) {
  files?.forEach((file) => formData.append(key, file))
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data
    const rawMessage = payload?.message
    const message = Array.isArray(rawMessage)
      ? rawMessage.join('\n')
      : rawMessage || error.message || 'API request failed'

    return new ApiError(message, error.response?.status, payload)
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('API request failed')
}
