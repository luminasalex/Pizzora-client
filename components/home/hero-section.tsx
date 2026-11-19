"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, Leaf, Star } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import heroPizza from "@/app/image/hero-pizza.png"
import pizzaDetail from "@/app/image/pizza-01.png"

export default function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#fff8ed] px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20 lg:px-12 lg:pt-20 lg:pb-24"
    >
      <div className="pointer-events-none absolute -top-20 left-[40%] -z-10 size-72 rounded-full bg-[#f7e5cd]/50 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] -bottom-28 -z-10 size-80 rounded-full bg-[#f7e5cd]/70 blur-3xl" />

      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 max-w-[590px]"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9d8c3] bg-white/70 px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-[#9b5b2b] uppercase">
            <span className="size-1.5 rounded-full bg-[#f77f00]" />
            Your neighborhood, served hot
          </p>
          <h1 className="max-w-[650px] text-[clamp(3.35rem,7.2vw,6.6rem)] leading-[0.94] font-semibold tracking-[-0.065em] text-[#25201d]">
            Your cravings.
            <span className="font-display mt-2 block font-medium tracking-[-0.055em] text-[#d62828] italic">
              Our freshly baked happiness.
            </span>
          </h1>
          <p className="mt-7 max-w-[490px] text-base leading-7 text-[#746961] sm:text-lg sm:leading-8">
            Discover amazing local pizza restaurants, explore handcrafted
            flavors, and enjoy delicious moments delivered right to your
            doorstep.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <Link
              href="/menu"
              className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-[#d62828] px-7 text-sm font-bold text-white shadow-[0_12px_24px_rgba(214,40,40,0.19)] transition-all hover:-translate-y-0.5 hover:bg-[#a4161a]"
            >
              Explore menu <ArrowRight size={17} />
            </Link>
            <Link
              href="/#restaurant-partners"
              className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-[#decdb9] bg-white/70 px-7 text-sm font-bold text-[#3a302a] transition-all hover:border-[#d62828] hover:text-[#d62828]"
            >
              Discover restaurants <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[#e8d9c7] pt-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4c4038]">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#d62828]">
                <Leaf size={16} />
              </span>
              Local kitchens
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4c4038]">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#f77f00]">
                <Star size={15} fill="currentColor" />
              </span>
              Made with care
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={
            reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: 1.5 }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.85,
            delay: reduceMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full max-w-[700px] lg:-mr-4"
        >
          <div className="absolute top-[9%] -left-2 z-10 hidden -rotate-6 items-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-bold text-[#554a42] shadow-[0_12px_32px_rgba(48,31,20,0.12)] sm:flex md:-left-6">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#fff1dc] text-[#e17818]">
              <Leaf size={15} />
            </span>
            Freshly baked, always loved
          </div>
          <div className="relative aspect-[1.12/1] overflow-hidden rounded-[44%_56%_54%_46%/48%_44%_56%_52%] bg-[#211b18] shadow-[0_34px_70px_rgba(66,40,21,0.2)]">
            <Image
              src={heroPizza}
              alt="Pepperoni pizza with fresh basil and tomatoes"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1410]/35 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#fffdf9]/95 p-3 pr-5 shadow-xl sm:bottom-8 sm:left-8">
              <div className="relative size-14 overflow-hidden rounded-xl">
                <Image
                  src={pizzaDetail}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#d62828] uppercase">
                  The neighborhood favorite
                </p>
                <p className="mt-1 text-sm font-semibold text-[#25201d]">
                  Made for sharing
                </p>
              </div>
            </div>
            <div className="absolute top-5 right-5 flex size-16 flex-col items-center justify-center rounded-full bg-[#f77f00] text-white shadow-lg sm:top-8 sm:right-8 sm:size-[76px]">
              <span className="text-[9px] font-bold tracking-widest uppercase">
                Always
              </span>
              <span className="font-display text-lg leading-5 italic sm:text-xl">
                fresh
              </span>
            </div>
          </div>
          <div className="absolute -right-2 -bottom-7 -z-10 size-28 rounded-full border border-dashed border-[#d6b995] sm:-right-4 sm:size-36" />
          <div className="absolute top-1/2 -right-3 hidden -translate-y-1/2 rotate-90 items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-[#ac9881] uppercase xl:flex">
            <span className="h-px w-8 bg-[#ac9881]" />
            The good stuff
          </div>
        </motion.div>
      </div>

      <a
        href="#featured"
        className="mx-auto mt-14 hidden w-fit items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#8e7c6a] uppercase transition-colors hover:text-[#d62828] lg:flex"
      >
        Take a look <ArrowDown size={14} />
      </a>
    </section>
  )
}
