"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Building, Award, TrendingUp, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { useApi } from "@/hooks/use-api"

export default function VendorOrders() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  if (role !== "vendor") {
    return <div className="p-8">Access denied: Vendor orders only.</div>
  }

  // Fetch orders from API
  const { data: apiOrders, isLoading, error } = useApi('/api/orders?userId=' + (user?.id || ''), {
    method: 'GET',
    enabled: !!user,
  })

  const orders = apiOrders ?? []

  const statusBadges: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#f0e7dc", color: "[--chartjs-color-1]" },
    accepted: { bg: "#dcffdd", color: "green-600" },
    rejected: { bg: "#fee2e2", color: "red-600" },
    cancelled: { bg: "#e5e5e5", color: "gray-600" },
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <AnimatePresence>
        {sessionPending ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            Loading orders...
          </motion.div>
        ) : user ? (
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Customer Orders
              </h1>
              <p className="text-[--chartjs-color-6]">
                Manage orders from your customers.
              </p>
            </header>

            {/* Orders Table */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Pending Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Delivery Date</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((order: any) => order.status === "pending")
                    .map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="p-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0">
                              <div className="text-xs font-bold">{order.customerName.split(" ")[0][0]}</div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <img
                            src={order.itemImage}
                            alt={order.itemName}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <p className="mt-1 font-medium">{order.itemName}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-sm">{order.deliveryDate}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-xs truncated-line">{order.customerMessage}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium ${statusBadges[order.status].bg} ${statusBadges[order.status].color}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <Button
                            size="sm"
                            className="text-[--chartjs-color-1] hover:text-white bg-[--chartjs-color-1]/10 rounded"
                            onClick={() => {
                              // Handle accept
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            className="text-red-600 hover:text-white bg-red-600/10 rounded ml-2"
                            onClick={() => {
                              // Handle reject
                            }}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </section>

            {/* Accepted & Rejected Orders */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Accepted Orders</h2>
              <p className="text-muted-foreground text-sm">
                {orders.filter((o: any) => o.status === "accepted").length} orders currently being prepared
              </p>

              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mt-6 mb-4">Rejected Orders</h2>
              <p className="text-muted-foreground text-sm">
                {orders.filter((o: any) => o.status === "rejected").length} orders rejected
              </p>
            </section>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            Sign in to view orders
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}