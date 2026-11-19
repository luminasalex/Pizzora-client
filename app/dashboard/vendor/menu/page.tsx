"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Building, Award, TrendingUp, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

export default function VendorMenuManagement() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  if (role !== "vendor") {
    return <div className="p-8">Access denied: Vendor menu management only.</div>
  }

  useEffect(() => {
    const handleVisibilityChange = () => {}
    const visibilityChange = "onvisibilitychange" in document ? "visibilitychange" : "onpagehide" in document ? "pagehide" : ""
    if (visibilityChange) {
      document.addEventListener(visibilityChange, handleVisibilityChange)
    }
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange)
    }
  }, [])

  // Sample menu items data
  const [menuItems, setMenuItems] = React.useState([])
  const [isAdding, setIsAdding] = React.useState(false)
  const [newItem, setNewItem] = React.useState({
    name: "",
    category: "Classic",
    description: "",
    price: "",
    location: "",
    image: "",
    status: "pending" as "pending" | "approved" | "rejected",
    availability: true,
  })

  // Sample categories
  const categories = ["Classic", "Vegetarian", "Meat Lovers", "Specialty", "Sides", "Beverages"]

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
            Loading menu management...
          </motion.div>
        ) : user ? (
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Manage Menu Items
              </h1>
              <p className="text-[--chartjs-color-6]">
                Add, edit, and manage your menu items.
              </p>
            </header>

            {/* Add Menu Item Form */}
            <section className="mb-8 card p-6">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Add New Menu Item</h2>
              <form className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Item Name</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="e.g., Margherita Pizza"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue
                        className="h-10 px-3 text-sm"
                        placeholder="Select category"
                      />
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    placeholder="e.g., 12.99"
                    required
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    placeholder="Describe your pizza..."
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    multiline
                    rows={3}
                    className="h-24 p-3 rounded-md border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="e.g., Dhaka, Mirpur"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    placeholder="e.g., https://imgbb.example.com/pizza.jpg"
                    value={newItem.image}
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-3 flex gap-3">
                  <label>
                    <input
                      type="checkbox"
                      checked={newItem.availability}
                      onChange={(e) =>
                        setNewItem({ ...newItem, availability: e.target.checked })
                      }
                      className="rounded-border"
                    />
                    Available
                  </label>
                  <Button
                    type="submit"
                    disabled={isAdding}
                    className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add Menu Item
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 rounded-md bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                    onClick={() => setNewItem({ name: "", category: "Classic", description: "", price: "", location: "", image: "", status: "pending", availability: true })}>
                    Reset
                  </Button>
                </div>
              </form>
            </section>

            {/* Menu Items Table */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Current Menu Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {React.useState(() => [
                    {
                      id: 1,
                      name: "Margherita Pizza",
                      category: "Classic",
                      price: "$12.99",
                      status: "approved",
                      image: "/placeholder-food.svg",
                    },
                    {
                      id: 2,
                      name: "Pepperoni Pizza",
                      category: "Classic",
                      price: "$14.99",
                      status: "approved",
                      image: "/placeholder-food.svg",
                    },
                    {
                      id: 3,
                      name: "Vegetarian Delight",
                      category: "Vegetarian",
                      price: "$13.49",
                      status: "pending",
                      image: "/placeholder-food.svg",
                    },
                    {
                      id: 4,
                      name: "Meat Lovers",
                      category: "Meat Lovers",
                      price: "$16.99",
                      status: "approved",
                      image: "/placeholder-food.svg",
                    },
                    {
                      id: 5,
                      name: "Garlic Bread",
                      category: "Sides",
                      price: "$5.99",
                      status: "approved",
                      image: "/placeholder-food.svg",
                    },
                  ])[0].map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="p-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </TableCell>
                      <TableCell className="p-4">
                        <span className="px-2 py-1 text-xs font-medium bg-[#f0e7dc] text-[--chartjs-color-1]">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">${item.price}</TableCell>
                      <TableCell className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-sm"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-sm ml-1"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-6 flex justify-end">
                <Button size="sm" variant="outline">
                  Prev
                </Button>
                <span className="mx-2">1</span>
                <Button size="sm" variant="outline">2</Button>
                <Button size="sm" variant="outline">3</Button>
                <span className="mx-2">...</span>
                <Button size="sm" variant="outline">5</Button>
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
            Sign in to manage your menu
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}