"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardPath, useSession } from "@/lib/auth-client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    router.replace(
      session?.user ? getDashboardPath(session.user.role) : "/sign-in",
    )
  }, [isPending, router, session])

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 text-sm text-muted-foreground">
      Finishing sign in…
    </main>
  )
}
