import BrowseMenuPage from "@/components/menu/browse-menu-page"

type MenuRouteProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    location?: string
  }>
}

export default async function MenuRoute({ searchParams }: MenuRouteProps) {
  const params = await searchParams
  return (
    <BrowseMenuPage
      initialSearch={params.q}
      initialCategory={params.category}
      initialLocation={params.location}
    />
  )
}
