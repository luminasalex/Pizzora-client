"use client"

import Link from "next/link"
import { Award, ClipboardList, Pizza, Store } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { useSession } from "@/lib/auth-client"
import type { ApiEnvelope } from "@/lib/menu-types"
import { DashboardStatusChart } from "@/components/dashboard/dashboard-status-chart"

type VendorStats = {
  totalItems: number
  activeItems: number
  pendingOrders: number
  acceptedOrders: number
  subscriptionPlan: "free" | "premium"
}

const links = [
  { href: "/dashboard/vendor/menu", label: "Manage menu", icon: Pizza },
  { href: "/dashboard/vendor/orders", label: "Customer orders", icon: ClipboardList },
  { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Award },
]

export default function VendorDashboard() {
  const { data: session, isPending: sessionPending } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, error, isLoading } = useApi<ApiEnvelope<VendorStats>>(
    "/api/dashboard/vendor",
    { enabled: isVendor },
  )

  if (sessionPending || isLoading) {
    return <main className="p-8 text-center text-muted-foreground">Loading your dashboard…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to view your dashboard.</main>
  }
  if (!isVendor) {
    return <main className="p-8 text-center">This dashboard is for restaurant partners.</main>
  }

  const stats = data?.data
  const cards = [
    { label: "Menu items", value: stats?.totalItems ?? "—", icon: Pizza },
    { label: "Available items", value: stats?.activeItems ?? "—", icon: Store },
    { label: "Pending orders", value: stats?.pendingOrders ?? "—", icon: ClipboardList },
    {
      label: "Subscription",
      value: stats?.subscriptionPlan === "premium" ? "Premium" : "Free",
      icon: Award,
    },
  ]

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-[#d62828]">Restaurant partner</p>
          <h1 className="mt-2 text-3xl font-bold text-[#25201d]">
            Welcome, {session.user.name}
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your menu and customer requests.</p>
        </header>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-[#eee5db]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="size-4 text-[#d62828]" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#25201d]">{value}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="border-[#eee5db]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accepted orders
              </CardTitle>
              <ClipboardList className="size-4 text-[#d62828]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#25201d]">
                {stats?.acceptedOrders ?? "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        <DashboardStatusChart
          title="Restaurant activity"
          data={[
            { label: "Active items", count: stats?.activeItems ?? 0 },
            { label: "Pending orders", count: stats?.pendingOrders ?? 0 },
            { label: "Accepted orders", count: stats?.acceptedOrders ?? 0 },
          ]}
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-[#eee5db] bg-white p-6 font-semibold text-[#25201d] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-[#fff2e4] text-[#d62828]">
                <Icon className="size-5" />
              </span>
              {label}
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
