export type MenuItemRecord = {
  id: string
  itemName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status?: string
  availability?: boolean
  vendor?: {
    id: string
    name: string
    image?: string
    subscriptionPlan?: string
  } | null
}

export type ApiEnvelope<T> = {
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function toMenuCardItem(item: MenuItemRecord) {
  return {
    id: item.id,
    name: item.itemName,
    category: item.category,
    price: item.price,
    restaurantName: item.vendor?.name ?? "Local restaurant",
    restaurantLocation: item.location,
    image: item.images[0] || "/pizza-placeholder.svg",
    premium: item.vendor?.subscriptionPlan === "premium",
    href: `/menu/${item.id}`,
  }
}
