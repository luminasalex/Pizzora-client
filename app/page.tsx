import HomePage from "@/components/home/home-page"

type HomeRouteProps = {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function Page({ searchParams }: HomeRouteProps) {
  const { category, q } = await searchParams

  return <HomePage selectedCategory={category} searchQuery={q} />
}
