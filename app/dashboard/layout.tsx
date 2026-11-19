"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"
import type { UserRole } from "@/lib/auth-client"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const requiredRole: UserRole | undefined = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/vendor")
      ? "vendor"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : undefined

  return <RouteGuard requiredRole={requiredRole}>{children}</RouteGuard>
}
