"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { getErrorMessage, notify } from "@/lib/notifications"
import type { ApiEnvelope } from "@/lib/menu-types"

type Order = {
  id: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  deliveryDate: string
  deliveryAddress: string
  message: string
  createdAt: string
  item: { itemName: string; images: string[] } | null
  customer: { name: string; email: string } | null
}

export default function VendorOrders() {
  const { data: session, isPending: sessionPending } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, error, isLoading, refetch } = useApi<ApiEnvelope<Order[]>>(
    "/api/vendor/orders",
    { enabled: isVendor },
  )
  const [busyOrder, setBusyOrder] = useState<string | null>(null)

  async function processOrder(orderId: string, action: "accept" | "reject") {
    setBusyOrder(orderId)
    try {
      await apiFetch(`/api/orders/${orderId}/${action}`, { method: "PATCH" })
      refetch()
      notify(
        "success",
        action === "accept" ? "Order accepted" : "Order rejected",
      )
    } catch (cause) {
      notify("error", "Could not update order", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusyOrder(null)
    }
  }

  if (sessionPending || (isVendor && isLoading)) {
    return <main className="p-8 text-center text-muted-foreground">Loading orders…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to view orders.</main>
  }
  if (!isVendor) {
    return <main className="p-8 text-center">Only restaurant partners can manage orders.</main>
  }

  const orders = data?.data ?? []

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-[#d62828]">Vendor dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-[#25201d]">Customer orders</h1>
          <p className="mt-2 text-muted-foreground">Review and respond to requests for your restaurant.</p>
        </header>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Card className="border-[#eee5db]">
          <CardHeader>
            <CardTitle>All orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Address / message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-medium">{order.customer?.name ?? "Customer"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                    </TableCell>
                    <TableCell>{order.item?.itemName ?? "Removed item"}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate">{order.deliveryAddress}</p>
                      {order.message && (
                        <p className="truncate text-xs text-muted-foreground">{order.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{order.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={busyOrder === order.id}
                            onClick={() => processOrder(order.id, "accept")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyOrder === order.id}
                            onClick={() => processOrder(order.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No action available</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!orders.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
