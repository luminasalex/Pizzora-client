import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import vendorImage from "@/app/image/Vendor.png"
import { Reveal } from "./reveal"

const perks = [
  "Reach more hungry neighbors",
  "Showcase your menu your way",
  "Grow with a local-first platform",
]

export default function VendorSection() {
  return (
    <section
      id="restaurant-partners"
      className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#321512] text-white">
          <div className="pointer-events-none absolute -top-24 -right-16 -z-10 size-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -top-10 -right-2 -z-10 size-56 rounded-full border border-white/10" />
          <div className="grid lg:grid-cols-[1fr_0.95fr]">
            <Reveal className="relative z-10 px-5 py-9 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
              <p className="mb-5 text-[10px] font-bold tracking-[0.22em] text-[#ffb15a] uppercase">
                For the makers & the bakers
              </p>
              <h2 className="font-display max-w-xl text-4xl leading-[1.02] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[58px]">
                Give your restaurant the spotlight it deserves.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                Grow your restaurant&apos;s visibility, showcase your menu, and
                reach more hungry customers with Pizzora Premium.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f77f00]/20 text-[#ffb15a]">
                      <Check size={12} />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-[#f77f00] px-6 text-sm font-bold text-[#261811] transition-all hover:-translate-y-0.5 hover:bg-[#ff9d2f]"
              >
                Become a premium partner <ArrowUpRight size={17} />
              </Link>
              <p className="mt-3 text-xs text-white/45">
                Already with us? Sign in to manage your restaurant.
              </p>
            </Reveal>

            <div className="relative min-h-[280px] overflow-hidden lg:min-h-[520px]">
              <Image
                src={vendorImage}
                alt="A chef preparing a fresh pizza in a restaurant kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-[center_45%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#321512] via-[#321512]/35 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute right-5 bottom-5 rounded-full border border-white/25 bg-[#21100d]/65 px-4 py-2 text-[10px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm sm:right-8 sm:bottom-8">
                Crafted by local hands
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
