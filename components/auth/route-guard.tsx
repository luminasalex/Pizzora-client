"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, getDashboardPath, type UserRole } from "@/lib/auth-client"

type RouteGuardProps = {
  children: ReactNode
  requiredRole?: UserRole
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const user = session?.user

  useEffect(() => {
    if (isPending) return
    if (!user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(getDashboardPath(user.role))
    }
  }, [isPending, pathname, requiredRole, router, user])

  if (isPending || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-5 text-sm text-muted-foreground">
        Checking account access…
      </main>
    )
  }

  if (user.isBlocked) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold text-[#25201d]">Account access suspended</h1>
        <p className="mt-3 text-sm text-[#6f655e]">
          This account is blocked. Contact Pizzora support for help.
        </p>
      </main>
    )
  }

  return children
}
