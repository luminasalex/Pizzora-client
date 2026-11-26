import Link from "next/link"
import { ArrowRight, UtensilsCrossed } from "lucide-react"
import { Reveal } from "./reveal"
import MenuItemCard, { type MenuItem } from "./menu-item-card"

type FeaturedMenuSectionProps = {
  items?: MenuItem[]
  selectedCategory?: string
  searchQuery?: string
  error?: string
}

const categoryLabels: Record<string, string> = {
  classic: "Classic Pizzas",
  vegetarian: "Vegetarian Pizzas",
  "meat-lovers": "Meat Lovers",
  specialty: "Specialty / Gourmet Pizzas",
  sides: "Sides & Appetizers",
  drinks: "Beverages & Desserts",
}

export default function FeaturedMenuSection({
  items = [],
  selectedCategory,
  searchQuery,
  error,
}: FeaturedMenuSectionProps) {
  const categoryLabel = selectedCategory
    ? categoryLabels[selectedCategory]
    : undefined

  return (
    <section
      id="featured"
      className="scroll-mt-24 bg-[#fffdf9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
              A little something special
            </p>
            <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-[#25201d] sm:text-5xl lg:text-[58px]">
              Today&apos;s delicious picks
            </h2>
            <p className="mt-4 text-base leading-7 text-[#82776f]">
              Handpicked favorites from restaurants around you.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#d62828] transition-all hover:gap-3"
          >
            Explore all categories <ArrowRight size={16} />
          </Link>
        </Reveal>

        {items.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((item, index) => (
              <Reveal key={item.id} delay={index * 0.06} className="min-w-0">
                <MenuItemCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="relative mt-10 overflow-hidden rounded-[28px] border border-[#eee3d7] bg-[#fff8ed] px-6 py-12 text-center sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -top-20 -left-16 size-48 rounded-full border border-[#eedbc5]" />
              <div className="pointer-events-none absolute -right-14 -bottom-20 size-48 rounded-full border border-[#eedbc5]" />
              <span className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-white text-[#d62828] shadow-sm">
                <UtensilsCrossed size={23} />
              </span>
              <p className="relative mt-5 text-[10px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
                {error
                  ? "Menus are taking a little longer"
                  : "Fresh from our local kitchens"}
              </p>
              <h3 className="font-display relative mt-3 text-3xl leading-tight font-medium tracking-tight text-[#25201d] sm:text-4xl">
                {error
                  ? "We couldn't load the menu just yet."
                  : searchQuery
                    ? `We're still finding "&ldquo;${searchQuery}&rdquo;."`
                    : categoryLabel
                      ? `${categoryLabel} are coming soon.`
                      : "A fresh menu is on its way."}
              </h3>
              <p className="relative mx-auto mt-3 max-w-lg text-sm leading-6 text-[#82776f]">
                {error
                  ? error
                  : "We're bringing neighborhood menus together. Browse our food categories while we prepare the next batch."}
              </p>
              <Link
                href="/menu"
                className="relative mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25201d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d62828]"
              >
                Find your perfect slice <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
