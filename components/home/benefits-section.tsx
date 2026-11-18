import Image from "next/image"
import {
  ArrowUpRight,
  Compass,
  Heart,
  MapPin,
  PackageCheck,
} from "lucide-react"
import storyImage from "@/app/image/Why-Choose.png"
import { Reveal } from "./reveal"

const benefits = [
  {
    number: "01",
    title: "Local restaurant discovery",
    text: "Meet the neighborhood kitchens making something worth sharing.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Fresh & quality food",
    text: "Handcrafted flavors, honest ingredients, and care in every bake.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Easy ordering",
    text: "Find your next favorite and make it yours in just a few steps.",
    icon: PackageCheck,
  },
  {
    number: "04",
    title: "Order tracking",
    text: "Stay close to the good stuff from the kitchen to your doorstep.",
    icon: MapPin,
  },
]

export default function BenefitsSection() {
  return (
    <section
      id="story"
      className="scroll-mt-24 bg-[#fffdf9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[590px]">
          <div className="relative aspect-[0.95/1] overflow-hidden rounded-[34px] bg-[#f2e7d8]">
            <Image
              src={storyImage}
              alt="A generous spread of fresh appetizers ready to share"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#201712]/45 via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/30 bg-[#fffdf9]/90 p-5 backdrop-blur-sm sm:right-7 sm:bottom-7 sm:left-7 sm:p-6">
              <p className="font-display text-2xl leading-tight font-medium text-[#25201d] sm:text-3xl">
                Every great meal starts with a good neighbor.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#8b7b6e]">
                <span className="size-2 rounded-full bg-[#f77f00]" />
                Made fresh. Shared together.
              </div>
            </div>
          </div>
          <div className="absolute top-8 -left-4 hidden h-28 w-1 rounded-full bg-[#f77f00] sm:block" />
          <div className="absolute -top-5 -right-5 hidden size-24 rounded-full border border-[#e6d3bc] sm:block" />
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
              The PizzaHub difference
            </p>
            <h2 className="font-display max-w-xl text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-[#25201d] sm:text-5xl lg:text-[58px]">
              More than pizza.
              <span className="block text-[#d62828] italic">
                It&apos;s an experience.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#82776f] sm:text-base">
              Good food is about more than what&apos;s in the box. It&apos;s the
              local places, thoughtful details, and little moments that bring us
              back.
            </p>
          </Reveal>

          <div className="mt-8 divide-y divide-[#eee6dc] border-y border-[#eee6dc]">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <Reveal key={benefit.number} delay={index * 0.04}>
                  <div className="group grid grid-cols-[44px_1fr_32px] items-center gap-3 py-5 sm:grid-cols-[52px_1fr_36px] sm:gap-4">
                    <span className="font-display text-sm font-semibold text-[#cbb8a4]">
                      {benefit.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#25201d]">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 max-w-md text-xs leading-5 text-[#82776f] sm:text-sm">
                        {benefit.text}
                      </p>
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#fff4e8] text-[#d62828] transition-colors group-hover:bg-[#d62828] group-hover:text-white">
                      <Icon size={16} />
                    </span>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <a
            href="#how-it-works"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#d62828] transition-all hover:gap-3"
          >
            How PizzaHub works <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
