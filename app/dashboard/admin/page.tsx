"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { getErrorMessage, notify } from "@/lib/notifications"
import type { ApiEnvelope } from "@/lib/menu-types"
import { DashboardStatusChart } from "@/components/dashboard/dashboard-status-chart"

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
  status: "pending" | "approved" | "rejected" | "inactive"
  vendor: { id: string; name: string } | null
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
  vendor: { id: string; name: string } | null
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
  const [menuSearch, setMenuSearch] = useState("")
  const [menuQuery, setMenuQuery] = useState("")
  const [menuStatus, setMenuStatus] = useState("")
  const [menuCategory, setMenuCategory] = useState("")
  const [menuPage, setMenuPage] = useState(1)
  const menuParams = new URLSearchParams({ page: String(menuPage), limit: "10" })
  if (menuQuery) menuParams.set("search", menuQuery)
  if (menuStatus) menuParams.set("status", menuStatus)
  if (menuCategory) menuParams.set("category", menuCategory)
  const menuResult = useApi<ApiEnvelope<AdminMenuItem[]>>(
    `/api/admin/menu-items?${menuParams.toString()}`,
    { enabled: isAdmin },
  )
  const [userSearch, setUserSearch] = useState("")
  const [userQuery, setUserQuery] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userPage, setUserPage] = useState(1)
  const userParams = new URLSearchParams({ page: String(userPage), limit: "8" })
  if (userQuery) userParams.set("search", userQuery)
  if (userRole) userParams.set("role", userRole)
  const userResult = useApi<ApiEnvelope<AdminUser[]>>(
    `/api/admin/users?${userParams.toString()}`,
    { enabled: isAdmin },
  )
  const [transactionPage, setTransactionPage] = useState(1)
  const transactionResult = useApi<ApiEnvelope<Transaction[]>>(
    `/api/admin/transactions?page=${transactionPage}&limit=10`,
    { enabled: isAdmin },
  )
  const [busy, setBusy] = useState<string | null>(null)

  async function updateMenuItem(id: string, status: AdminMenuItem["status"]) {
    setBusy(id)
    try {
      await apiFetch(`/api/admin/menu-items/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      menuResult.refetch()
      statsResult.refetch()
      const notice = {
        pending: "Menu item returned to pending review",
        approved: "Menu item approved",
        rejected: "Menu item rejected",
        inactive: "Menu item marked inactive",
      }[status]
      notify("success", notice)
    } catch (cause) {
      notify("error", "Could not update menu item", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusy(null)
    }
  }

  async function deleteMenuItem(item: AdminMenuItem) {
    if (!window.confirm(`Delete "${item.itemName}" permanently?`)) return
    setBusy(item.id)
    try {
      await apiFetch(`/api/admin/menu-items/${item.id}`, { method: "DELETE" })
      menuResult.refetch()
      statsResult.refetch()
      notify("success", "Menu item deleted")
    } catch (cause) {
      notify("error", "Could not delete menu item", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusy(null)
    }
  }

  async function toggleBlocked(user: AdminUser) {
    setBusy(user.id)
    try {
      await apiFetch(`/api/admin/users/${user.id}/${user.isBlocked ? "unblock" : "block"}`, {
        method: "PATCH",
      })
      userResult.refetch()
      notify("success", user.isBlocked ? "User unblocked" : "User blocked")
    } catch (cause) {
      notify("error", "Could not update user", getErrorMessage(cause, "Please try again."))
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

        {(statsResult.error ||
          menuResult.error ||
          userResult.error ||
          transactionResult.error) && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {statsResult.error ??
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

        <DashboardStatusChart
          title="Platform overview"
          data={[
            { label: "Vendors", count: stats?.totalVendors ?? 0 },
            { label: "Customers", count: stats?.totalCustomers ?? 0 },
            { label: "Menu items", count: stats?.totalMenuItems ?? 0 },
            { label: "Transactions", count: stats?.totalTransactions ?? 0 },
          ]}
        />

        <Card id="manage-menu-items" className="mt-8 scroll-mt-24 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Manage menu items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <form
              className="grid gap-3 md:grid-cols-[minmax(200px,1fr)_180px_220px_auto]"
              onSubmit={(event) => {
                event.preventDefault()
                setMenuPage(1)
                setMenuQuery(menuSearch.trim())
              }}
            >
              <Input
                value={menuSearch}
                onChange={(event) => setMenuSearch(event.target.value)}
                placeholder="Search menu item"
                aria-label="Search menu items by name"
              />
              <select
                value={menuStatus}
                onChange={(event) => {
                  setMenuStatus(event.target.value)
                  setMenuPage(1)
                }}
                aria-label="Filter menu items by status"
                className="h-10 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={menuCategory}
                onChange={(event) => {
                  setMenuCategory(event.target.value)
                  setMenuPage(1)
                }}
                aria-label="Filter menu items by category"
                className="h-10 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">All categories</option>
                {[
                  "Classic Pizzas",
                  "Vegetarian Pizzas",
                  "Meat Lovers",
                  "Specialty / Gourmet Pizzas",
                  "Sides & Appetizers",
                  "Beverages & Desserts",
                ].map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
              <Button type="submit" variant="outline">Search</Button>
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(menuResult.data?.data ?? []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.vendor?.name ?? item.vendorId}</TableCell>
                    <TableCell className="capitalize">{item.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status !== "approved" && (
                          <Button
                            size="sm"
                            disabled={busy === item.id}
                            onClick={() => updateMenuItem(item.id, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {item.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy === item.id}
                            onClick={() => updateMenuItem(item.id, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                        {item.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy === item.id}
                            onClick={() => updateMenuItem(item.id, "inactive")}
                          >
                            Set inactive
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busy === item.id}
                          onClick={() => deleteMenuItem(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!menuResult.data?.data.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No menu items match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {menuResult.data?.pagination && menuResult.data.pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={menuPage <= 1}
                  onClick={() => setMenuPage((page) => page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {menuResult.data.pagination.page} of {menuResult.data.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={menuPage >= menuResult.data.pagination.pages}
                  onClick={() => setMenuPage((page) => page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card id="manage-users" className="mt-8 scroll-mt-24 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Manage users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <form
              className="grid max-w-3xl gap-3 sm:grid-cols-[minmax(200px,1fr)_180px_auto]"
              onSubmit={(event) => {
                event.preventDefault()
                setUserPage(1)
                setUserQuery(userSearch.trim())
              }}
            >
              <Input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search name or email"
                aria-label="Search users"
              />
              <select
                value={userRole}
                onChange={(event) => {
                  setUserRole(event.target.value)
                  setUserPage(1)
                }}
                aria-label="Filter users by role"
                className="h-10 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">All roles</option>
                <option value="vendor">Vendors</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
              </select>
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
            {userResult.data?.pagination && userResult.data.pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={userPage <= 1}
                  onClick={() => setUserPage((page) => page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {userResult.data.pagination.page} of {userResult.data.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={userPage >= userResult.data.pagination.pages}
                  onClick={() => setUserPage((page) => page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card id="transactions" className="mt-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Transactions (read-only)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactionResult.data?.data ?? []).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.vendor?.name ?? transaction.vendorId}</TableCell>
                    <TableCell className="capitalize">{transaction.plan}</TableCell>
                    <TableCell>{transaction.currency} {transaction.amount}</TableCell>
                    <TableCell className="capitalize">{transaction.status}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transactionResult.data?.pagination &&
              transactionResult.data.pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    disabled={transactionPage <= 1}
                    onClick={() => setTransactionPage((page) => page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {transactionResult.data.pagination.page} of{" "}
                    {transactionResult.data.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={transactionPage >= transactionResult.data.pagination.pages}
                    onClick={() => setTransactionPage((page) => page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
