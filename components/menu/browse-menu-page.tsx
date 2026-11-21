"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import MenuItemCard from "@/components/home/menu-item-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApi } from "@/hooks/use-api"
import type { ApiEnvelope, MenuItemRecord } from "@/lib/menu-types"
import { toMenuCardItem } from "@/lib/menu-types"

const menuCategories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
]

type BrowseMenuPageProps = {
  initialSearch?: string
  initialCategory?: string
  initialLocation?: string
}

export default function BrowseMenuPage({
  initialSearch = "",
  initialCategory = "",
  initialLocation = "",
}: BrowseMenuPageProps) {
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [search, setSearch] = useState(initialSearch)
  const [locationInput, setLocationInput] = useState(initialLocation)
  const [location, setLocation] = useState(initialLocation)
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page: String(page), limit: "9" })
  if (search) params.set("search", search)
  if (category) params.set("category", category)
  if (location) params.set("location", location)
  if (sort) params.set("sort", sort)
  const { data, error, isLoading, refetch } = useApi<ApiEnvelope<MenuItemRecord[]>>(
    `/api/menu-items?${params.toString()}`,
  )

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
    setLocation(locationInput.trim())
  }

  function resetFilters() {
    setSearchInput("")
    setSearch("")
    setLocationInput("")
    setLocation("")
    setCategory("")
    setSort("")
    setPage(1)
  }

  const items = data?.data ?? []
  const pagination = data?.pagination

  return (
    <main className="min-h-screen bg-[#fffdf9]">
      <section className="bg-[#fff8ed] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
            Made fresh by neighborhood kitchens
          </p>
          <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-[#25201d] sm:text-6xl">
            Find your next favorite
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#82776f]">
            Explore approved, freshly prepared menu items from local restaurants.
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <form
            onSubmit={submitFilters}
            className="grid gap-4 rounded-3xl border border-[#eee5db] bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(170px,1fr)_auto]"
          >
            <label className="grid gap-2 text-sm font-semibold text-[#403832]">
              Search
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#93877e]"
                  size={17}
                />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Pizza or menu item"
                  className="h-11 pl-10"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[#403832]">
              Category
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setPage(1)
                }}
                className="h-11 rounded-md border border-input bg-white px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/30"
              >
                <option value="">All categories</option>
                {menuCategories.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[#403832]">
              Location
              <Input
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                placeholder="City or area"
                className="h-11"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[#403832]">
              Sort by
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value)
                  setPage(1)
                }}
                className="h-11 rounded-md border border-input bg-white px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/30"
              >
                <option value="">Recommended</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </label>

            <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
              <Button type="submit" className="h-11 flex-1 bg-[#d62828] hover:bg-[#a4161a]">
                <SlidersHorizontal className="mr-2 size-4" />
                Apply
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-[#82776f]" aria-live="polite">
              {pagination
                ? `${pagination.total} menu item${pagination.total === 1 ? "" : "s"}`
                : "Browse the menu"}
            </p>
            <Link
              href="/#categories"
              className="text-sm font-semibold text-[#d62828] hover:underline"
            >
              Explore categories
            </Link>
          </div>

          {isLoading ? (
            <div
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Loading menu items"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-[390px] animate-pulse rounded-3xl bg-[#f3e8dc]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-semibold text-[#25201d]">
                The menu could not be loaded
              </h2>
              <p className="mt-2 text-sm text-[#82776f]">{error}</p>
              <Button className="mt-5 bg-[#d62828]" onClick={refetch}>
                Try again
              </Button>
            </div>
          ) : items.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={toMenuCardItem(item)} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-[#eee5db] bg-white px-6 py-14 text-center">
              <Image
                src="/pizza-placeholder.svg"
                alt=""
                width={96}
                height={78}
                className="mx-auto"
                unoptimized
              />
              <h2 className="mt-4 text-xl font-semibold text-[#25201d]">
                No menu items found
              </h2>
              <p className="mt-2 text-sm text-[#82776f]">
                Try changing your search or filters.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={resetFilters}
              >
                Clear filters
              </Button>
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <nav
              aria-label="Menu pagination"
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Button
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-[#82776f]">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pagination.pages || isLoading}
                onClick={() =>
                  setPage((current) => Math.min(pagination.pages, current + 1))
                }
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </section>
    </main>
  )
}
