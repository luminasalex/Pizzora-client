import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export type UserRole = "customer" | "vendor" | "admin"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  plugins: [
    inferAdditionalFields<
      undefined,
      {
        user: {
          role: { type: "string" }
          businessName: { type: "string"; required: false }
          isBlocked: { type: "boolean"; required: false }
        }
      }
    >(),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient

export function getDashboardPath(role: string | null | undefined) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}

export function getSafeRedirectPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return null
  }
  return path
}
