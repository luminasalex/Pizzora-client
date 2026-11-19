const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/+$/, "")

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })

  if (response.status === 204) return undefined as T

  const payload = (await response.json()) as
    | { error?: string; message?: string }
    | T
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? payload.error
        : undefined
    throw new Error(message || `Request failed with status ${response.status}.`)
  }

  return payload as T
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
