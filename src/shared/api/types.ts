export type ApiErrorBody = {
  detail?: string | string[] | Record<string, unknown>
  code?: string
  [key: string]: unknown
}

function firstMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value
  if (Array.isArray(value) && value.length > 0) return firstMessage(value[0])
  if (typeof value === "object" && value !== null) {
    for (const nested of Object.values(value)) {
      const found = firstMessage(nested)
      if (found) return found
    }
  }
  return null
}

export function getErrorMessage(error: unknown, fallback = "Ocurrió un error"): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as { response?: { data?: ApiErrorBody } }).response?.data
    if (data) {
      const fromDetail = firstMessage(data.detail)
      if (fromDetail) return fromDetail
      const fromNonField = firstMessage(data.non_field_errors)
      if (fromNonField) return fromNonField
      for (const [key, nested] of Object.entries(data)) {
        if (key === "detail" || key === "code" || key === "status") continue
        const found = firstMessage(nested)
        if (found) return found
      }
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
