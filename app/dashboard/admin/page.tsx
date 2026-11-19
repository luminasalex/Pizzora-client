"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Building, Award, TrendingUp, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

interface AdminDashboardStats {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
}

export default function AdminDashboard() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  // If not an admin, redirect
  if (role !== "admin") {
    return <div className="p-8">Access denied: Admin dashboard only.</div>
  }

  const stats: AdminDashboardStats = {
    totalUsers: 128,
    totalVendors: 24,
    totalCustomers: 104,
    totalMenuItems: 342,
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Could update page title or analytics
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
            Loading admin dashboard...
          </motion.div>
        ) : user ? (
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-[--chartjs-color-6]">
                Platform management and analytics.
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalUsers}</div>
                  <p className="text-muted-foreground">registered accounts</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Total Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalVendors}</div>
                  <p className="text-muted-foreground">restaurant partners</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalCustomers}</div>
                  <p className="text-muted-foreground">active customers</p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[--chartjs-color-1]">{stats.totalMenuItems}</div>
                  <p className="text-muted-foreground">approved items</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Recent Activity</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableUser>User</TableUser>
                    <TableAction>Action</TableAction>
                    <TableItem>Item</TableItem>
                    <TableDate>Date</TableDate>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0">
                          <div className="text-xs font-bold">A</div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">Admin User</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#f0e7dc] text-[--chartjs-color-1]">
                        Login
                      </span>
                    </TableCell>
                    <TableCell className="p-4">System</TableCell>
                    <TableCell className="p-4">Nov 19, 2026</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0">
                          <div className="text-xs font-bold">V</div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium">Vendor User</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#dcffdd] text-green-600">
                        Approved
                      </span>
                    </TableCell>
                    <TableCell className="p-4">Menu Item</TableCell>
                    <TableCell className="p-4">Nov 18, 2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* Management Sections */}
            <section className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <h3 className="text-semibold mb-3">Manage Users</h3>
                <p className="text-muted-foreground text-sm">
                  View, search, block, or unblock platform users.
                </p>
                <button
                  className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Go to User Management
                </button>
              </div>
              <div>
                <h3 className="text-semibold mb-3">Manage Menu Items</h3>
                <p className="text-muted-foreground text-sm">
                  Approve, reject, or review menu items from vendors.
                </p>
                <button
                  className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Go to Menu Management
                </button>
              </div>
            </section>

            {/* Transactions */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Recent Transactions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableVendor>Vendor</TableVendor>
                    <TablePlan>Plan</TablePlan>
                    <TableAmount>Amount</TableAmount>
                    <TableStatus>Status</TableStatus>
                    <TableDate>Date</TableDate>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-4">Vittorio's Pizzeria</TableCell>
                    <TableCell className="p-4">Premium</TableCell>
                    <TableCell className="p-4">$29.99</TableCell>
                    <TableCell className="p-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#dcffdd] text-green-600">
                        Successful
                      </span>
                    </TableCell>
                    <TableCell className="p-4">Nov 15, 2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
            Sign in to view admin dashboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}