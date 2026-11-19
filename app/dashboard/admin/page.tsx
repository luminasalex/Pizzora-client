"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { ApiEnvelope } from "@/lib/menu-types"

type AdminStats = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
  pendingMenuItems: number
  totalTransactions: number
}

type AdminMenuItem = {
  id: string
  itemName: string
  category: string
  vendorId: string
  status: string
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  isBlocked: boolean
}

type Transaction = {
  id: string
  vendorId: string
  plan: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, isPending: sessionPending } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const statsResult = useApi<ApiEnvelope<AdminStats>>("/api/dashboard/admin", {
    enabled: isAdmin,
  })
  const menuResult = useApi<ApiEnvelope<AdminMenuItem[]>>(
    "/api/admin/menu-items?status=pending&limit=8",
    { enabled: isAdmin },
  )
  const [userSearch, setUserSearch] = useState("")
  const [userQuery, setUserQuery] = useState("")
  const userResult = useApi<ApiEnvelope<AdminUser[]>>(
    `/api/admin/users?limit=8${userQuery ? `&search=${encodeURIComponent(userQuery)}` : ""}`,
    { enabled: isAdmin },
  )
  const transactionResult = useApi<ApiEnvelope<Transaction[]>>(
    "/api/admin/transactions?limit=6",
    { enabled: isAdmin },
  )
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function updateMenuItem(id: string, status: "approved" | "rejected") {
    setBusy(id)
    setActionError(null)
    try {
      await apiFetch(`/api/admin/menu-items/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      menuResult.refetch()
      statsResult.refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not update menu item.")
    } finally {
      setBusy(null)
    }
  }

  async function toggleBlocked(user: AdminUser) {
    setBusy(user.id)
    setActionError(null)
    try {
      await apiFetch(`/api/admin/users/${user.id}/${user.isBlocked ? "unblock" : "block"}`, {
        method: "PATCH",
      })
      userResult.refetch()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not update user.")
    } finally {
      setBusy(null)
    }
  }

  if (
    sessionPending ||
    (isAdmin &&
      (statsResult.isLoading ||
        menuResult.isLoading ||
        userResult.isLoading ||
        transactionResult.isLoading))
  ) {
    return <main className="p-8 text-center text-muted-foreground">Loading platform dashboard…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to access the admin dashboard.</main>
  }
  if (!isAdmin) {
    return <main className="p-8 text-center">Administrator access is required.</main>
  }

  const stats = statsResult.data?.data
  const summary = [
    ["Registered users", stats?.totalUsers],
    ["Restaurants", stats?.totalVendors],
    ["Customers", stats?.totalCustomers],
    ["Menu items", stats?.totalMenuItems],
    ["Pending review", stats?.pendingMenuItems],
    ["Transactions", stats?.totalTransactions],
  ]

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-[#d62828]">Platform administration</p>
          <h1 className="mt-2 text-3xl font-bold text-[#25201d]">Admin dashboard</h1>
          <p className="mt-2 text-muted-foreground">Review listings and manage Pizzora accounts.</p>
        </header>

        {(actionError ||
          statsResult.error ||
          menuResult.error ||
          userResult.error ||
          transactionResult.error) && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {actionError ??
              statsResult.error ??
              menuResult.error ??
              userResult.error ??
              transactionResult.error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map(([label, value]) => (
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

        <Card className="mt-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Menu items awaiting review</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead className="text-right">Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(menuResult.data?.data ?? []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="max-w-40 truncate">{item.vendorId}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          disabled={busy === item.id}
                          onClick={() => updateMenuItem(item.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === item.id}
                          onClick={() => updateMenuItem(item.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!menuResult.data?.data.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No menu items need review.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Manage users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <form
              className="flex max-w-lg gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                setUserQuery(userSearch.trim())
              }}
            >
              <Input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search name or email"
                aria-label="Search users"
              />
              <Button type="submit" variant="outline">Search</Button>
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(userResult.data?.data ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.isBlocked ? "Blocked" : "Active"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === user.id || user.id === session.user.id}
                        onClick={() => toggleBlocked(user)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Recent transactions (read-only)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactionResult.data?.data ?? []).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.vendorId}</TableCell>
                    <TableCell className="capitalize">{transaction.plan}</TableCell>
                    <TableCell>{transaction.currency} {transaction.amount}</TableCell>
                    <TableCell className="capitalize">{transaction.status}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
