export type Id = string
export type ISODateString = string

export type PaginationParams = {
  page?: number
  limit?: number
}

export type ApiErrorResponse = {
  message: string | string[]
  error?: string
  statusCode?: number
  [key: string]: unknown
}
