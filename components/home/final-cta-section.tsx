import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"
import pizzaImage from "@/app/image/pizza-01.png"
import { Reveal } from "./reveal"

export default function FinalCtaSection() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
      <Reveal className="mx-auto max-w-[1320px]">
        <div className="relative isolate min-h-[330px] overflow-hidden rounded-[32px] bg-[#f1e4d4] sm:min-h-[380px]">
          <Image
            src={pizzaImage}
            alt="Freshly baked pepperoni pizza topped with basil"
            fill
            sizes="(max-width: 1320px) 100vw, 1320px"
            className="object-cover object-[center_46%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#211712]/90 via-[#211712]/65 to-[#211712]/10" />
          <div className="relative flex min-h-[330px] items-center px-7 py-12 sm:min-h-[380px] sm:px-12 lg:px-16">
            <div className="max-w-2xl text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#ffc27b] uppercase">
                <Heart size={14} fill="currentColor" /> Pass the good stuff
              </p>
              <h2 className="font-display text-4xl leading-[1.03] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[62px]">
                Good food brings people together.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                Your next favorite pizza is just a few clicks away.
              </p>
              <Link
                href="/menu"
                className="mt-7 inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-bold text-[#25201d] transition-all hover:-translate-y-0.5 hover:bg-[#fff1dc]"
              >
                Explore the menu <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
