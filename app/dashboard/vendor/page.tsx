"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Building, Award, TrendingUp, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { DashboardStats } from "@/lib/dashboard.types"

interface VendorDashboardStats {
  totalItems: number
  activeItems: number
  pendingOrders: number
  acceptedOrders: number
}

export default function VendorDashboard() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  // If not a vendor, redirect
  if (role !== "vendor") {
    // In a real app, we'd use router.push('/dashboard/customer') or similar
    return <div className="p-8">Access denied: Vendor dashboard only.</div>
  }

  const stats: VendorDashboardStats = {
    totalItems: 5,
    activeItems: 3,
    pendingOrders: 2,
    acceptedOrders: 1,
  }

  useEffect(() => {
    // Update navbar role display when page loads
    const handleVisibilityChange = () => {
      const title = document.title
      // Could update breadcrumb or page title based on role
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
            Loading your vendor dashboard...
          </motion.div>
        ) : user ? (
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Vendor Dashboard
              </h1>
              <p className="text-[--chartjs-color-6]">
                Welcome back! Manage your restaurant and orders.
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Total Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalItems}</div>
                  <p className="text-muted-foreground">items published</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Active Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.activeItems}</div>
                  <p className="text-muted-foreground">currently active</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
                  <p className="text-muted-foreground">awaiting acceptance</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Accepted Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.acceptedOrders}</div>
                  <p className="text-muted-foreground">being prepared</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Recent Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCustomer>Customer</TableCustomer>
                    <TableItem>Item</TableItem>
                    <TableStatus>Status</TableStatus>
                    <TableAction>Action</TableAction>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0">
                          <div className="text-xs font-bold">C</div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">30 min ago</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">Margherita Pizza</TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#f0e7dc] text-[--chartjs-color-1]">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell className="p-4">
                      <button
                        className="px-3 py-1.5 text-sm font-medium text-[--chartjs-color-1] hover:text-white bg-[--chartjs-color-1]/10 rounded"
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium ml-2 text-red-600 hover:text-white bg-red-600/10 rounded"
                      >
                        Reject
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Add Menu Item
                </button>
                <button
                  className="flex-1 rounded-md bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                >
                  View All Orders
                </button>
                <button
                  className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                >
                  Manage Subscription
                </button>
                <button
                  className="flex-1 rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/90"
                >
                  Profile Settings
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