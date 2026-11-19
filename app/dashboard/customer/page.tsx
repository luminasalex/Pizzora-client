"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

interface CustomerDashboardStats {
  totalOrders: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
}

export default function CustomerDashboard() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  // If not a customer, redirect
  if (role !== "customer") {
    return <div className="p-8">Access denied: Customer dashboard only.</div>
  }

  const stats: CustomerDashboardStats = {
    totalOrders: 8,
    pendingOrders: 1,
    acceptedOrders: 3,
    rejectedOrders: 2,
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Could update page title or breadcrumbs
    }
    const visibilityChange = "onvisibilitychange" in document ? "visibilitychange" : "onpagehide" in document ? "pagehide" : ""
    if (visibilityChange) {
      document.addEventListener(visibilityChange, handleVisibilityChange)
    }
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange)
    }
  }, [])

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
            Loading your customer dashboard...
          </motion.div>
        ) : user ? (
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Customer Dashboard
              </h1>
              <p className="text-[--chartjs-color-6]">
                Your order history and statistics.
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalOrders}</div>
                  <p className="text-muted-foreground">placed</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
                  <p className="text-muted-foreground">awaiting delivery</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Accepted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.acceptedOrders}</div>
                  <p className="text-muted-foreground">being prepared</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.rejectedOrders}</div>
                  <p className="text-muted-foreground">cancelled by restaurant</p>
                </CardContent>
              </Card>
            </div>

            {/* My Orders Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">My Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Pizza</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-bg bg-[#f3e8e5] flex items-center justify-center shrink-0">
                          <div className="text-sm font-bold">🍕</div>
                        </div>
                        <div>
                          <p className="font-medium">Margherita</p>
                          <p className="text-xs text-muted-foreground">from Vittorio's</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">Vittorio's Pizzeria</TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#f0e7dc] text-[--chartjs-color-1]">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell className="p-4">Nov 20, 2026</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-bg bg-[#f3e8e5] flex items-center justify-center shrink-0">
                          <div className="text-sm font-bold">🍕</div>
                        </div>
                        <div>
                          <p className="font-medium">Pepperoni</p>
                          <p className="text-xs text-muted-foreground">from Vittorio's</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">Vittorio's Pizzeria</TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#dcffdd] text-green-600">
                        Accepted
                      </span>
                    </TableCell>
                    <TableCell className="p-4">Nov 18, 2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* Order Actions */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Place New Order
                </button>
                <button
                  className="flex-1 rounded-md bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                >
                  View Order History
                </button>
              </div>
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
            Sign in to view your dashboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}