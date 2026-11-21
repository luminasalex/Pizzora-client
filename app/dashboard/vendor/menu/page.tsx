"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { getErrorMessage, notify } from "@/lib/notifications"
import type { ApiEnvelope, MenuItemRecord } from "@/lib/menu-types"

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

const emptyForm = {
  itemName: "",
  category: categories[0],
  description: "",
  price: "",
  location: "",
}

export default function VendorMenuManagement() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, error, isLoading, refetch } = useApi<ApiEnvelope<MenuItemRecord[]>>(
    "/api/vendor/menu-items",
    { enabled: isVendor },
  )
  const [form, setForm] = useState(emptyForm)
  const [imageUrl, setImageUrl] = useState("")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [busyItem, setBusyItem] = useState<string | null>(null)

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (!editingItemId && !imageUrl) throw new Error("Enter a menu item image URL.")
      const isEditing = Boolean(editingItemId)
      await apiFetch(
        editingItemId ? `/api/menu-items/${editingItemId}` : "/api/menu-items",
        {
          method: editingItemId ? "PATCH" : "POST",
          body: JSON.stringify({
            itemName: form.itemName,
            category: form.category,
            description: form.description,
            price: Number(form.price),
            location: form.location,
            ...(imageUrl ? { images: [imageUrl] } : {}),
          }),
        },
      )
      notify(
        "success",
        isEditing ? "Menu item updated" : "Menu item submitted",
        isEditing
          ? "Your changes were sent for approval."
          : "Your menu item is awaiting admin approval.",
      )
      setForm(emptyForm)
      setImageUrl("")
      setEditingItemId(null)
      refetch()
    } catch (cause) {
      const description = getErrorMessage(cause, "Could not save this item.")
      if (description.includes("Upgrade to Premium")) {
        notify("warning", "Premium plan required", description, {
          children: "View plans",
          onClick: () => router.push("/dashboard/vendor/subscription"),
        })
      } else {
        notify("error", "Could not save menu item", description)
      }
    } finally {
      setIsSaving(false)
    }
  }

  function editItem(item: MenuItemRecord) {
    setEditingItemId(item.id)
    setForm({
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      price: String(item.price),
      location: item.location,
    })
    setImageUrl(item.images?.[0] || "")
  }

  function resetForm() {
    setForm(emptyForm)
    setImageUrl("")
    setEditingItemId(null)
  }

  async function updateAvailability(item: MenuItemRecord) {
    setBusyItem(item.id)
    try {
      await apiFetch(`/api/menu-items/${item.id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ availability: !item.availability }),
      })
      notify(
        "success",
        item.availability ? "Menu item paused" : "Menu item made available",
      )
      refetch()
    } catch (cause) {
      notify("error", "Could not update availability", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusyItem(null)
    }
  }

  async function deleteItem(itemId: string) {
    if (!window.confirm("Delete this menu item?")) return
    setBusyItem(itemId)
    try {
      await apiFetch(`/api/menu-items/${itemId}`, { method: "DELETE" })
      notify("success", "Menu item deleted")
      refetch()
    } catch (cause) {
      notify("error", "Could not delete menu item", getErrorMessage(cause, "Please try again."))
    } finally {
      setBusyItem(null)
    }
  }

  if (sessionPending || (isVendor && isLoading)) {
    return <main className="p-8 text-center text-muted-foreground">Loading your menu…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to manage your menu.</main>
  }
  if (!isVendor) {
    return <main className="p-8 text-center">Only restaurant partners can manage menu items.</main>
  }

  const items = data?.data ?? []
  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-[#d62828]">Vendor dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-[#25201d]">Manage your menu</h1>
          <p className="mt-2 text-muted-foreground">New items stay private until an admin approves them.</p>
        </header>

        {error && (
          <p className="mb-5 rounded-xl bg-[#fff2e4] p-4 text-sm text-[#6f3a24]" role="alert">
            {error}
          </p>
        )}

        <Card className="mb-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>{editingItemId ? "Edit menu item" : "Add a menu item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addItem} className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="itemName">Item name</Label>
                <Input
                  id="itemName"
                  value={form.itemName}
                  onChange={(event) => setForm({ ...form, itemName: event.target.value })}
                  maxLength={100}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="h-10 rounded-md border border-input bg-white px-3 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  maxLength={2000}
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (BDT)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0.01"
                  max="100000"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Restaurant location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  maxLength={120}
                  placeholder="Area, city"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Menu item image URL</Label>
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/pizza.png"
                />
                {editingItemId && (
                  <p className="text-xs text-muted-foreground">
                    Enter a new image URL only if you want to replace the current one.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="bg-[#d62828] hover:bg-[#a4161a]" disabled={isSaving}>
                  {isSaving ? "Saving…" : editingItemId ? "Save changes" : "Submit for approval"}
                </Button>
                {editingItemId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <Pencil className="mr-1 size-3.5" />Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-[#eee5db]">
          <CardHeader>
            <CardTitle>Your items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.images[0] || "/pizza-placeholder.svg"}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 rounded-lg object-cover"
                          unoptimized
                        />
                        <span className="font-medium">{item.itemName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>৳{item.price.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{item.status}</TableCell>
                    <TableCell>{item.availability ? "Available" : "Paused"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editItem(item)}
                        >
                          <Pencil className="mr-1 size-3.5" />Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busyItem === item.id || item.status !== "approved"}
                          onClick={() => updateAvailability(item)}
                        >
                          {item.availability ? "Pause" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={busyItem === item.id}
                          onClick={() => deleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
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