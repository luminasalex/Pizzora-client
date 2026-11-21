"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { getErrorMessage, notify } from "@/lib/notifications"
import type { ApiEnvelope } from "@/lib/menu-types"

type CustomerOrder = {
  id: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  deliveryDate: string
  deliveryAddress: string
  createdAt: string
  item: { itemName: string; images: string[]; price: number } | null
  vendor: { name: string } | null
}

type CustomerStats = {
  totalOrders: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
}

export default function CustomerDashboard() {
  const { data: session, isPending: sessionPending } = useSession()
  const isCustomer = session?.user?.role === "customer"
  const statsResult = useApi<ApiEnvelope<CustomerStats>>(
    "/api/dashboard/customer",
    { enabled: isCustomer },
  )
  const ordersResult = useApi<ApiEnvelope<CustomerOrder[]>>(
    "/api/orders/my-orders",
    { enabled: isCustomer },
  )
  const [busyOrder, setBusyOrder] = useState<string | null>(null)

  async function cancelOrder(orderId: string) {
    setBusyOrder(orderId)
    try {
      await apiFetch(`/api/orders/${orderId}/cancel`, { method: "PATCH" })
      ordersResult.refetch()
      statsResult.refetch()
      notify("success", "Order cancelled", "Your pending request was cancelled.")
    } catch (cause) {
      notify("error", "Could not cancel order", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusyOrder(null)
    }
  }

  if (sessionPending || (isCustomer && (statsResult.isLoading || ordersResult.isLoading))) {
    return <main className="p-8 text-center text-muted-foreground">Loading your orders…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to view your orders.</main>
  }
  if (!isCustomer) {
    return <main className="p-8 text-center">This dashboard is for customer accounts.</main>
  }

  const stats = statsResult.data?.data
  const orders = ordersResult.data?.data ?? []

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#d62828]">Your Pizzora account</p>
            <h1 className="mt-2 text-3xl font-bold text-[#25201d]">My orders</h1>
          </div>
          <Link
            href="/menu"
            className="rounded-full bg-[#d62828] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a4161a]"
          >
            Browse menu
          </Link>
        </header>

        {(statsResult.error || ordersResult.error) && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {statsResult.error ?? ordersResult.error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total orders", stats?.totalOrders],
            ["Pending", stats?.pendingOrders],
            ["Accepted", stats?.acceptedOrders],
            ["Rejected", stats?.rejectedOrders],
          ].map(([label, value]) => (
            <Card key={String(label)} className="border-[#eee5db]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#25201d]">{value ?? "—"}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-8 space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-[#eee5db]">
              <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                <Image
                  src={order.item?.images[0] || "/pizza-placeholder.svg"}
                  alt=""
                  width={88}
                  height={88}
                  className="size-[88px] rounded-2xl object-cover"
                  unoptimized
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-bold text-[#25201d]">
                      {order.item?.itemName ?? "Removed menu item"}
                    </h2>
                    <span className="rounded-full bg-[#fff2e4] px-3 py-1 text-xs font-semibold capitalize text-[#8c4a2d]">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#82776f]">
                    {order.vendor?.name ?? "Restaurant"} · Delivery {order.deliveryDate}
                  </p>
                  <p className="mt-2 truncate text-sm text-[#6f655e]">{order.deliveryAddress}</p>
                </div>
                {order.status === "pending" && (
                  <Button
                    variant="outline"
                    disabled={busyOrder === order.id}
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel request
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {!orders.length && (
            <Card className="border-[#eee5db]">
              <CardContent className="py-14 text-center">
                <p className="font-semibold text-[#25201d]">No orders yet</p>
                <p className="mt-2 text-sm text-[#82776f]">
                  Find a local favorite and place your first request.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  )
}
