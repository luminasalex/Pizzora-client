"use client"

import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

type UseApiOptions = {
  enabled?: boolean
  method?: string
  body?: unknown
}

export function useApi<T>(path: string, options: UseApiOptions = {}) {
  const { enabled = true, method = "GET", body } = options
  const bodyText = body === undefined ? undefined : JSON.stringify(body)
  const [requestNumber, setRequestNumber] = useState(0)
  const requestKey = `${method}:${path}:${bodyText ?? ""}:${requestNumber}`
  const [result, setResult] = useState<{
    key: string
    data: T | null
    error: string | null
  } | null>(null)

  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()

    apiFetch<T>(path, {
      method,
      body: bodyText,
      signal: controller.signal,
    })
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setResult({
          key: requestKey,
          data: null,
          error: cause instanceof Error ? cause.message : "The request failed.",
        })
      })

    return () => controller.abort()
  }, [bodyText, enabled, method, path, requestKey])

  const refetch = useCallback(() => {
    setRequestNumber((current) => current + 1)
  }, [])

  const currentResult = result?.key === requestKey ? result : null
  return {
    data: currentResult?.data ?? null,
    error: currentResult?.error ?? null,
    isLoading: enabled && currentResult === null,
    refetch,
  }
}
