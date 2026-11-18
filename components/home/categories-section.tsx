import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  CakeSlice,
  Leaf,
  Pizza,
  Sparkles,
  Utensils,
} from "lucide-react"
import classicPizza from "@/app/image/category-classic.png"
import meatPizza from "@/app/image/hero-pizza.png"
import veggiePizza from "@/app/image/pizza-01.png"
import sidesImage from "@/app/image/Why-Choose.png"
import { Reveal } from "./reveal"

const categories = [
  {
    slug: "classic",
    name: "Classic pizzas",
    note: "The timeless favorites",
    image: classicPizza,
    icon: Pizza,
    tone: "bg-[#f3e7d7]",
    size: "md:col-span-2",
    imagePosition: "object-center",
  },
  {
    slug: "vegetarian",
    name: "Vegetarian",
    note: "Garden-fresh goodness",
    image: veggiePizza,
    icon: Leaf,
    tone: "bg-[#e8eee1]",
    size: "",
    imagePosition: "object-center",
  },
  {
    slug: "meat-lovers",
    name: "Meat lovers",
    note: "Big, bold, and satisfying",
    image: meatPizza,
    icon: Utensils,
    tone: "bg-[#f0e2d9]",
    size: "",
    imagePosition: "object-center",
  },
  {
    slug: "specialty",
    name: "Specialty & gourmet",
    note: "A little outside the box",
    image: veggiePizza,
    icon: Sparkles,
    tone: "bg-[#f0e9da]",
    size: "md:col-span-2",
    imagePosition: "object-[center_55%]",
  },
  {
    slug: "sides",
    name: "Sides & appetizers",
    note: "The perfect plus-one",
    image: sidesImage,
    icon: Utensils,
    tone: "bg-[#efe2d1]",
    size: "",
    imagePosition: "object-center",
  },
  {
    slug: "drinks",
    name: "Drinks & desserts",
    note: "Save room for something sweet",
    image: classicPizza,
    icon: CakeSlice,
    tone: "bg-[#f5e8dc]",
    size: "",
    imagePosition: "object-[center_40%]",
  },
]

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      className="scroll-mt-24 bg-[#fff8ed] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#d62828] uppercase">
              Follow your appetite
            </p>
            <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-medium tracking-[-0.045em] text-[#25201d] sm:text-5xl lg:text-[58px]">
              Find your perfect slice
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#82776f]">
            From old-school comfort to something wonderfully unexpected,
            there&apos;s a slice with your name on it.
          </p>
        </Reveal>

        <div className="grid auto-rows-[230px] gap-4 sm:grid-cols-2 md:auto-rows-[250px] md:grid-cols-4 lg:auto-rows-[270px]">
          {categories.map((category, index) => {
            const Icon = category.icon

            return (
              <Reveal
                key={category.slug}
                delay={index * 0.045}
                className={category.size}
              >
                <Link
                  href={`/?category=${category.slug}#featured`}
                  aria-label={`Browse ${category.name}`}
                  className={`group relative flex h-full min-h-[220px] overflow-hidden rounded-[24px] ${category.tone}`}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 35vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${category.imagePosition}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201712]/80 via-[#201712]/15 to-transparent" />
                  <span className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#d62828] shadow-sm backdrop-blur-sm transition-transform group-hover:rotate-6">
                    <Icon size={18} />
                  </span>
                  <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-5 sm:p-6">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase">
                        {category.note}
                      </p>
                      <h3 className="font-display mt-1 text-2xl font-medium text-white sm:text-[28px]">
                        {category.name}
                      </h3>
                    </div>
                    <span className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#25201d] transition-all group-hover:bg-[#d62828] group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
