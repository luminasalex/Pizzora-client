import { createAuthClient } from "better-auth/react"

// Single client instance shared by every auth UI. The auth API is served by
// `app/api/auth/[...all]/route.ts` on this same origin, so no baseURL is
// needed. Do NOT pass `process.env.BETTER_AUTH_URL` here — that key is
// server-only and is undefined in the browser bundle.
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
