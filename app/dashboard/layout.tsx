"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"
import { useSession, type UserRole } from "@/lib/auth-client"

const navigationByRole: Record<
  UserRole,
  { label: string; href: string }[]
> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Manage menu items", href: "/dashboard/admin#manage-menu-items" },
    { label: "Manage users", href: "/dashboard/admin#manage-users" },
    { label: "Transactions", href: "/dashboard/admin#transactions" },
    { label: "Profile settings", href: "/profile" },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor" },
    { label: "My menu items", href: "/dashboard/vendor/menu" },
    { label: "Customer orders", href: "/dashboard/vendor/orders" },
    { label: "Subscription", href: "/dashboard/vendor/subscription" },
    { label: "Profile settings", href: "/profile" },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "Browse menu", href: "/menu" },
    { label: "Profile settings", href: "/profile" },
  ],
}

function isUserRole(role: string | null | undefined): role is UserRole {
  return role === "admin" || role === "vendor" || role === "customer"
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role
  const requiredRole: UserRole | undefined = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/vendor")
      ? "vendor"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : undefined

  const navigation = isUserRole(role) ? navigationByRole[role] : []

  return (
    <RouteGuard requiredRole={requiredRole}>
      <div className="min-h-[70vh] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
          <aside className="h-fit shrink-0 rounded-2xl border border-[#eee5db] bg-white p-3 lg:sticky lg:top-24 lg:w-64">
            <p className="px-3 py-2 text-xs font-bold tracking-[0.16em] text-[#d62828] uppercase">
              {role ? `${role} workspace` : "Workspace"}
            </p>
            <nav
              aria-label="Dashboard navigation"
              className="flex gap-1 overflow-x-auto lg:flex-col"
            >
              {navigation.map((item) => {
                const path = item.href.split("#")[0]
                const isSectionLink = item.href.includes("#")
                const active =
                  !isSectionLink &&
                  (pathname === path ||
                    (path !== "/dashboard/admin" &&
                      path !== "/dashboard/vendor" &&
                      path !== "/dashboard/customer" &&
                      pathname.startsWith(path)))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#fff2e4] text-[#a4161a]"
                        : "text-[#5f554e] hover:bg-[#faf6f0] hover:text-[#25201d]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </RouteGuard>
  )
}
