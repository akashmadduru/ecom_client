import { ref } from 'vue'
import { normalizeApiError } from '@/utils/apiError'
import type { ApiError } from '@/interfaces/api'

export function useFormErrors() {
  const fieldErrors = ref<Record<string, string[]>>({})
  const formError = ref<string | null>(null)

  function setFromError(err: unknown): ApiError {
    const apiError = normalizeApiError(err)
    formError.value = apiError.message
    fieldErrors.value = apiError.fieldErrors
    return apiError
  }

  function clear(): void {
    formError.value = null
    fieldErrors.value = {}
  }

  function fieldError(field: string): string | undefined {
    return fieldErrors.value[field]?.[0]
  }

  return { fieldErrors, formError, setFromError, clear, fieldError }
}
