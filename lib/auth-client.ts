import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  plugins: [
    inferAdditionalFields<
      undefined,
      {
        user: {
          role: { type: "string" }
          businessName: { type: "string"; required: false }
        }
      }
    >(),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
