"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import pizzaDetail from "@/app/image/pizza-01.png"

export default function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative isolate min-h-[680px] overflow-hidden bg-[#a4161a] px-5 pt-10 pb-28 text-white sm:min-h-[740px] sm:px-8 sm:pt-14 lg:min-h-[780px] lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_70%,#df3a27_0%,#b11d1d_48%,#8d1117_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/10 to-transparent" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 mx-auto max-w-[900px] text-center"
      >
        <p className="font-display text-3xl leading-none text-[#ffd21c] italic sm:text-4xl">
          Original
        </p>
        <h1 className="mt-2 text-[clamp(4.5rem,15vw,10rem)] leading-[0.82] font-black tracking-[-0.075em] text-white [text-shadow:0_5px_0_rgba(80,10,10,0.12)]">
          PIZZA
        </h1>
        <p className="mx-auto mt-5 max-w-[440px] text-sm leading-6 text-white/85 sm:text-base">
          Handcrafted flavors, made fresh by your favorite local kitchens.
        </p>
        <Link
          href="/#restaurant-partners"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-[#ffe36b] uppercase transition-colors hover:text-white sm:text-sm"
        >
          Discover local restaurants <ArrowUpRight size={15} />
        </Link>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.85,
          delay: reduceMotion ? 0 : 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-x-0 -bottom-[100px] z-0 mx-auto aspect-square w-[min(760px,115vw)] overflow-hidden rounded-full shadow-[0_30px_90px_rgba(54,8,7,0.28)] sm:-bottom-[330px]"
      >
        <Image
          src={pizzaDetail}
          alt="Freshly baked pepperoni pizza with basil and tomatoes"
          fill
          priority
          sizes="(max-width: 768px) 115vw, 760px"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute top-[48%] right-[7%] z-10 flex size-[92px] rotate-[9deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#8c5800] bg-[#ffd21c] text-center text-[#34210a] shadow-[0_8px_24px_rgba(65,13,9,0.25)] sm:right-[13%] sm:size-[112px]">
        <span className="text-[9px] font-black tracking-[0.16em] uppercase sm:text-[10px]">
          Always
        </span>
        <span className="font-display text-xl leading-5 font-bold italic sm:text-2xl">
          fresh
        </span>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[118px] w-full sm:h-[145px]"
      >
        <path d="M0 0 Q720 150 1440 0 L1440 150 L0 150 Z" fill="#fffdf9" />
      </svg>

      <Link
        href="/menu"
        className="absolute bottom-3 left-1/2 z-20 flex size-[112px] -translate-x-1/2 flex-col items-center justify-center rounded-full border-[7px] border-[#ffd21c] bg-white text-[#28201c] shadow-[0_12px_28px_rgba(44,13,10,0.24)] transition-transform hover:scale-105 sm:bottom-4 sm:size-[128px]"
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
