"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Clock, Flame, Store } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import pizzaDetail from "@/app/image/pizza-01.png"

// Image URLs — jehetu URL, tai chaile nijer pochonder URL diye replace korte paro
const FEATURED = [
  {
    name: "Margherita",
    note: "Basil & mozzarella",
    price: "$9",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Pepperoni",
    note: "Crispy & spicy",
    price: "$11",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Veggie Garden",
    note: "Fresh seasonal toppings",
    price: "$10",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Four Cheese",
    note: "Melted & golden",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80",
  },
]

const PERKS = [
  { icon: Clock, label: "30 min delivery" },
  { icon: Flame, label: "Stone-baked" },
  { icon: Store, label: "Local kitchens" },
]

const ease = [0.22, 1, 0.36, 1] as const

function FloatCard({
  item,
  className,
  delay,
  reduceMotion,
}: {
  item: (typeof FEATURED)[number]
  className: string
  delay: number
  reduceMotion: boolean | null
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease }}
      className={`absolute z-10 hidden lg:block ${className}`}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{
          duration: 5 + delay * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-3 rounded-full bg-white/95 p-2 pr-6 text-[#28201c] shadow-[0_14px_36px_rgba(54,8,7,0.3)] backdrop-blur"
      >
        <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-4 ring-[#ffd21c]">
          <Image
            src={item.image}
            alt={`${item.name} pizza`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-extrabold">{item.name}</span>
          <span className="block text-xs text-[#6b5a50]">{item.note}</span>
          <span className="mt-0.5 block text-sm font-black text-[#c8201f]">
            {item.price}
          </span>
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative isolate min-h-[720px] overflow-hidden bg-[#a4161a] px-5 pt-10 pb-28 text-white sm:min-h-[780px] sm:px-8 sm:pt-14 lg:min-h-[820px] lg:px-12"
    >
      {/* Background: warm radial glow + dotted texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_75%,#ef4a2c_0%,#b81e1c_45%,#850f15_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/15 to-transparent" />

      {/* Oversized ghost word behind the pizza */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[34%] -z-10 select-none text-center text-[clamp(8rem,28vw,24rem)] leading-none font-black tracking-[-0.08em] text-white/[0.05]"
      >
        HOT
      </span>

      {/* Main copy */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease }}
        className="relative z-10 mx-auto max-w-[900px] text-center"
      >
        <p className="font-display text-3xl leading-none text-[#ffd21c] italic sm:text-4xl">
          Original
        </p>
        <h1 className="mt-2 text-[clamp(4.5rem,15vw,10rem)] leading-[0.82] font-black tracking-[-0.075em] text-white [text-shadow:0_6px_0_rgba(80,10,10,0.18)]">
          PIZZA
        </h1>
        <p className="mx-auto mt-5 max-w-[460px] text-sm leading-6 text-white/90 sm:text-base">
          Handcrafted flavors, made fresh by your favorite local kitchens.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#ffd21c] px-6 py-3 text-sm font-extrabold text-[#34210a] shadow-[0_8px_0_#b88a00] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_0_#b88a00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#a4161a] focus-visible:outline-none active:translate-y-1 active:shadow-[0_3px_0_#b88a00]"
          >
            Order pizza <ArrowRight size={16} />
          </Link>
          <Link
            href="/#restaurant-partners"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            Discover local restaurants <ArrowUpRight size={15} />
          </Link>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/85 sm:text-sm">
          {PERKS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon size={15} className="text-[#ffd21c]" />
              {label}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Hero pizza — rises in, then turns slowly */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.95,
          delay: reduceMotion ? 0 : 0.1,
          ease,
        }}
        className="absolute inset-x-0 -bottom-[80px] z-0 mx-auto aspect-square w-[min(760px,118vw)] rounded-full p-3 shadow-[0_40px_100px_rgba(54,8,7,0.4)] ring-8 ring-[#ffd21c]/90 sm:-bottom-[330px]"
      >
        <motion.div
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="relative size-full overflow-hidden rounded-full"
        >
          <Image
            src={pizzaDetail}
            alt="Freshly baked pepperoni pizza with basil and tomatoes"
            fill
            priority
            sizes="(max-width: 768px) 118vw, 760px"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Floating menu cards (desktop) */}
      <FloatCard
        item={FEATURED[0]}
        delay={0.5}
        reduceMotion={reduceMotion}
        className="top-[16%] left-[5%] xl:left-[9%]"
      />
      <FloatCard
        item={FEATURED[1]}
        delay={0.7}
        reduceMotion={reduceMotion}
        className="top-[44%] left-[2%] xl:left-[5%]"
      />
      <FloatCard
        item={FEATURED[2]}
        delay={0.6}
        reduceMotion={reduceMotion}
        className="top-[16%] right-[5%] xl:right-[9%]"
      />
      <FloatCard
        item={FEATURED[3]}
        delay={0.8}
        reduceMotion={reduceMotion}
        className="top-[44%] right-[2%] xl:right-[5%]"
      />

      {/* "Always fresh" sticker */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 9 }}
        transition={{
          duration: reduceMotion ? 0 : 0.7,
          delay: reduceMotion ? 0 : 1,
          type: "spring",
          bounce: 0.45,
        }}
        className="absolute top-[56%] right-[6%] z-10 flex size-[92px] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#8c5800] bg-[#ffd21c] text-center text-[#34210a] shadow-[0_8px_24px_rgba(65,13,9,0.3)] sm:right-[13%] sm:size-[112px] lg:top-[30%] lg:right-[24%]"
      >
        <span className="text-[9px] font-black tracking-[0.16em] uppercase sm:text-[10px]">
          Always
        </span>
        <span className="font-display text-xl leading-5 font-bold italic sm:text-2xl">
          fresh
        </span>
      </motion.div>

      {/* Curved bottom edge */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[118px] w-full sm:h-[145px]"
      >
        <path d="M0 0 Q720 150 1440 0 L1440 150 L0 150 Z" fill="#fffdf9" />
      </svg>

      {/* Round order badge */}
      <Link
        href="/menu"
        aria-label="Order pizza"
        className="absolute bottom-3 left-1/2 z-20 flex size-[112px] -translate-x-1/2 flex-col items-center justify-center rounded-full border-[7px] border-[#ffd21c] bg-white text-[#28201c] shadow-[0_12px_28px_rgba(44,13,10,0.24)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#a4161a] focus-visible:outline-none sm:bottom-4 sm:size-[128px]"
      >
        <span className="mb-1 flex size-8 items-center justify-center rounded-full bg-[#d62828] text-white">
          <ArrowRight size={17} />
        </span>
        <span className="text-[13px] leading-4 font-black tracking-tight uppercase sm:text-sm">
          Order
          <br />
          pizza
        </span>
      </Link>
    </section>
  )
}
