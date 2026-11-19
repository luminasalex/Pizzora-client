import HomePage from "@/components/home/home-page"
import { getApiBaseUrl } from "@/lib/api"
import type { ApiEnvelope, MenuItemRecord } from "@/lib/menu-types"
import { toMenuCardItem } from "@/lib/menu-types"

type HomeRouteProps = {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

const categoryNames: Record<string, string> = {
  classic: "Classic Pizzas",
  vegetarian: "Vegetarian Pizzas",
  "meat-lovers": "Meat Lovers",
  specialty: "Specialty / Gourmet Pizzas",
  sides: "Sides & Appetizers",
  drinks: "Beverages & Desserts",
}

export default async function Page({ searchParams }: HomeRouteProps) {
  const { category, q } = await searchParams
  const query = new URLSearchParams()
  if (q?.trim()) query.set("search", q.trim())
  if (category && categoryNames[category]) {
    query.set("category", categoryNames[category])
  }

  let featuredItems: ReturnType<typeof toMenuCardItem>[] = []
  let error: string | undefined
  try {
    const endpoint = query.size
      ? `/api/menu-items?${query.toString()}&limit=6`
      : "/api/menu-items/featured"
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("The menu service is temporarily unavailable.")
    const payload = (await response.json()) as ApiEnvelope<MenuItemRecord[]>
    featuredItems = payload.data.map(toMenuCardItem)
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "The menu service is temporarily unavailable."
  }

  return (
    <HomePage
      selectedCategory={category}
      searchQuery={q}
      featuredItems={featuredItems}
      error={error}
    />
  )
}