"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { ApiEnvelope, MenuItemRecord } from "@/lib/menu-types"
import { uploadImage } from "@/lib/uploads"

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
  const { data: session, isPending: sessionPending } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, error, isLoading, refetch } = useApi<ApiEnvelope<MenuItemRecord[]>>(
    "/api/vendor/menu-items",
    { enabled: isVendor },
  )
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [busyItem, setBusyItem] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage(null)
    try {
      if (!imageFile) throw new Error("Choose a menu item image.")
      const imageUrl = await uploadImage(imageFile)
      await apiFetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify({
          itemName: form.itemName,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          location: form.location,
          images: [imageUrl],
        }),
      })
      setForm(emptyForm)
      setImageFile(null)
      setMessage("Menu item submitted for admin approval.")
      refetch()
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not save this item.")
    } finally {
      setIsSaving(false)
    }
  }

  async function updateAvailability(item: MenuItemRecord) {
    setBusyItem(item.id)
    setMessage(null)
    try {
      await apiFetch(`/api/menu-items/${item.id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ availability: !item.availability }),
      })
      refetch()
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not update availability.")
    } finally {
      setBusyItem(null)
    }
  }

  async function deleteItem(itemId: string) {
    if (!window.confirm("Delete this menu item?")) return
    setBusyItem(itemId)
    setMessage(null)
    try {
      await apiFetch(`/api/menu-items/${itemId}`, { method: "DELETE" })
      refetch()
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not delete this item.")
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

        {(error || message) && (
          <p className="mb-5 rounded-xl bg-[#fff2e4] p-4 text-sm text-[#6f3a24]" role="status">
            {message ?? error}
          </p>
        )}

        <Card className="mb-8 border-[#eee5db]">
          <CardHeader>
            <CardTitle>Add a menu item</CardTitle>
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
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="image">Menu item image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  required
                />
              </div>
              <Button type="submit" className="bg-[#d62828] hover:bg-[#a4161a]" disabled={isSaving}>
                {isSaving ? "Submitting…" : "Submit for approval"}
              </Button>
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
                {!items.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No menu items yet. Add your first item above.
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
