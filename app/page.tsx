import HomePage from "@/components/home/home-page"
import { useApi } from "@/hooks/use-api"

type HomeRouteProps = {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function Page({ searchParams }: HomeRouteProps) {
  const { category, q } = await searchParams

  // Fetch featured menu items from the API
  const { data: menus, isLoading, error } = useApi('/api/menus', {
    method: 'GET',
    enabled: !!category || !!q,
  })

  // Fetch categories from the API
  const { data: categories } = useApi('/api/categories', {
    method: 'GET',
  })

  // If we have category or search params, fetch menus; otherwise use empty
  const featuredItems = menus ?? []

  return (
    <HomePage
      selectedCategory={category}
      searchQuery={q}
      featuredItems={featuredItems}
      categories={categories}
    />
  )
}