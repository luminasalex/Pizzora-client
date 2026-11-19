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
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    apiFetch<T>(path, {
      method,
      body: bodyText,
      signal: controller.signal,
    })
      .then(setData)
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(
          cause instanceof Error ? cause.message : "The request failed.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [bodyText, enabled, method, path, requestNumber])

  const refetch = useCallback(() => {
    setRequestNumber((current) => current + 1)
  }, [])

  return { data, error, isLoading, refetch }
}
