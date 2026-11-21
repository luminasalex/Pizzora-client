const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/+$/, "")

let cachedToken: string | null = null
let cachedTokenExpiresAt = 0
let tokenRequest: Promise<string | null> | null = null

function getTokenExpiration(token: string) {
  try {
    const payloadSegment = token.split(".")[1]
    if (!payloadSegment) return 0
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/")
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const binary = atob(paddedBase64)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      exp?: unknown
    }
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0
  } catch {
    return 0
  }
}

export function clearCachedApiToken() {
  cachedToken = null
  cachedTokenExpiresAt = 0
}

async function getApiToken() {
  if (cachedToken && cachedTokenExpiresAt > Date.now() + 30_000) {
    return cachedToken
  }
  if (tokenRequest) return tokenRequest

  tokenRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
      credentials: "include",
    })
    if (response.status === 401) return null
    if (!response.ok) {
      throw new Error(`Could not get an API token (status ${response.status}).`)
    }

    const payload = (await response.json()) as { token?: unknown }
    if (typeof payload.token !== "string") {
      throw new Error("The authentication service returned an invalid API token.")
    }

    cachedToken = payload.token
    cachedTokenExpiresAt = getTokenExpiration(payload.token)
    return payload.token
  })().finally(() => {
    tokenRequest = null
  })

  return tokenRequest
}

async function sendApiRequest(path: string, init: RequestInit, token: string | null) {
  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  else headers.delete("Authorization")

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "omit",
    cache: init.cache ?? "no-store",
  })
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const requestInit = { ...init, headers }
  let token = await getApiToken()
  let response = await sendApiRequest(path, requestInit, token)
  if (response.status === 401 && token) {
    clearCachedApiToken()
    token = await getApiToken()
    if (token) response = await sendApiRequest(path, requestInit, token)
  }

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
