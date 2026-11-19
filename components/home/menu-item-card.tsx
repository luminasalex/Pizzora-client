import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Star } from "lucide-react"

export type MenuItem = {
  id: string
  name: string
  category: string
  price: number
  restaurantName: string
  restaurantLocation: string
  image: string
  premium?: boolean
  href: string
}

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#eee5db] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#e7cfc0] hover:shadow-[0_22px_50px_rgba(58,38,22,0.1)]">
      <div className="relative aspect-[1.22/1] overflow-hidden bg-[#f5eadc]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        {item.premium && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#25201d]/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#ffe0ac] uppercase backdrop-blur-sm">
            <Star size={12} fill="currentColor" /> Premium
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#d62828] uppercase">
              {item.category}
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-[#25201d]">
              {item.name}
            </h3>
          </div>
          <p className="shrink-0 pt-1 text-base font-bold text-[#25201d]">
            ${item.price.toFixed(2)}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#f0e9e1] pt-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#4d433c]">
              {item.restaurantName}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#93877e]">
              <MapPin size={11} /> {item.restaurantLocation}
            </p>
          </div>
          <Link
            href={item.href}
            aria-label={`View details for ${item.name}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff2e4] text-[#d62828] transition-colors hover:bg-[#d62828] hover:text-white"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  )
}
