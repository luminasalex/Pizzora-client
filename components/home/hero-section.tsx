"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Clock, Flame, Store } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { useRef } from "react"
import pizzaDetail from "@/app/image/pizza-01.png"

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

/* ---------- Headline: letters rise one by one, wiggle on hover ---------- */
function Headline({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <h1
      aria-label="Pizza"
      className="mt-2 flex justify-center text-[clamp(4.5rem,15vw,10rem)] leading-[0.82] font-black tracking-[-0.075em] text-white [text-shadow:0_6px_0_rgba(80,10,10,0.18)]"
    >
      {"PIZZA".split("").map((char, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className="inline-block cursor-default"
            initial={reduceMotion ? false : { y: "110%", rotate: 8 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease }}
            whileHover={
              reduceMotion
                ? undefined
                : { y: -10, rotate: i % 2 ? 5 : -5, color: "#ffd21c" }
            }
          >
            {char}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/* ---------- Floating menu card with mouse-depth parallax ---------- */
function FloatCard({
  item,
  className,
  delay,
  depth,
  mx,
  my,
  reduceMotion,
}: {
  item: (typeof FEATURED)[number]
  className: string
  delay: number
  depth: number
  mx: MotionValue<number>
  my: MotionValue<number>
  reduceMotion: boolean | null
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth])
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth])

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -30, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, delay, ease }}
      className={`absolute z-10 hidden lg:block ${className}`}
    >
      <motion.div style={reduceMotion ? undefined : { x, y }}>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          className="group flex cursor-pointer items-center gap-3 rounded-full border border-white/60 bg-white/85 p-2 pr-6 text-[#28201c] shadow-[0_18px_44px_rgba(54,8,7,0.35)] backdrop-blur-xl"
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-4 ring-[#ffd21c] transition-transform duration-500 group-hover:rotate-[24deg]">
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
    </motion.div>
  )
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  // Mouse position (-0.5 → 0.5), smoothed with a spring
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 })
  const my = useSpring(rawY, { stiffness: 60, damping: 18 })

  // Scroll progress of the hero
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const pizzaScroll = useTransform(scrollYProgress, [0, 1], [0, 140])
  const pizzaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const copyScroll = useTransform(scrollYProgress, [0, 1], [0, -70])
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const ghostScroll = useTransform(scrollYProgress, [0, 1], [0, 160])

  // Parallax layers
  const pizzaX = useTransform(mx, [-0.5, 0.5], [-22, 22])
  const pizzaY = useTransform(my, [-0.5, 0.5], [-14, 14])
  const ghostX = useTransform(mx, [-0.5, 0.5], [30, -30])
  const stickerX = useTransform(mx, [-0.5, 0.5], [-40, 40])
  const stickerY = useTransform(my, [-0.5, 0.5], [-30, 30])
  const glowX = useTransform(mx, [-0.5, 0.5], ["35%", "65%"])
  const glowY = useTransform(my, [-0.5, 0.5], ["60%", "90%"])

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }
  function handleLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative isolate min-h-[720px] overflow-hidden bg-[#a4161a] px-5 pt-10 pb-28 text-white sm:min-h-[780px] sm:px-8 sm:pt-14 lg:min-h-[820px] lg:px-12"
    >
      {/* Background: base + glow that follows the cursor + dotted texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#a4161a] to-[#850f15]" />
      <motion.div
        aria-hidden="true"
        style={{
          background: useTransform(
            [glowX, glowY] as unknown as MotionValue<string>[],
            ([gx, gy]: string[]) =>
              `radial-gradient(circle at ${gx} ${gy}, #ff6a3a 0%, rgba(239,74,44,0.55) 28%, transparent 62%)`
          ),
        }}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/15 to-transparent" />

      {/* Ghost word drifts opposite to the cursor and with scroll */}
      <motion.span
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: ghostX, y: ghostScroll }}
        className="pointer-events-none absolute inset-x-0 top-[34%] -z-10 select-none text-center text-[clamp(8rem,28vw,24rem)] leading-none font-black tracking-[-0.08em] text-white/[0.06]"
      >
        HOT
      </motion.span>

      {/* Main copy */}
      <motion.div
        style={reduceMotion ? undefined : { y: copyScroll, opacity: copyFade }}
        className="relative z-10 mx-auto max-w-[900px] text-center"
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ffd21c] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#ffd21c]" />
          </span>
          Ovens are hot
        </motion.span>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, rotate: -6, y: 14 }}
          animate={{ opacity: 1, rotate: -3, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="font-display text-3xl leading-none text-[#ffd21c] italic sm:text-4xl"
        >
          Original
        </motion.p>

        <Headline reduceMotion={reduceMotion} />

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease }}
          className="mx-auto mt-5 max-w-[460px] text-sm leading-6 text-white/90 sm:text-base"
        >
          Handcrafted flavors, made fresh by your favorite local kitchens.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/menu"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#ffd21c] px-6 py-3 text-sm font-extrabold text-[#34210a] shadow-[0_8px_0_#b88a00] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_0_#b88a00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#a4161a] focus-visible:outline-none active:translate-y-1 active:shadow-[0_3px_0_#b88a00]"
          >
            {/* shine sweep */}
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-130%" }}
                animate={{ x: "230%" }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-white/60 blur-[2px]"
              />
            )}
            <span className="relative">Order pizza</span>
            <ArrowRight
              size={16}
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/#restaurant-partners"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            Discover local restaurants
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1 } } }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/85 sm:text-sm"
        >
          {PERKS.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: reduceMotion ? {} : { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              className="flex items-center gap-2"
            >
              <Icon size={15} className="text-[#ffd21c]" />
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Hero pizza — rises in, follows the cursor, drifts with scroll, turns slowly */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 120, rotate: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, delay: 0.1, ease }}
        className="absolute inset-x-0 -bottom-[80px] z-0 mx-auto aspect-square w-[min(760px,118vw)] sm:-bottom-[330px]"
      >
        <motion.div
          style={reduceMotion ? undefined : { x: pizzaX, y: pizzaY, scale: pizzaScale }}
          className="size-full"
        >
          <motion.div
            style={reduceMotion ? undefined : { y: pizzaScroll }}
            className="size-full"
          >
            <div className="size-full rounded-full p-3 shadow-[0_40px_100px_rgba(54,8,7,0.45)] ring-8 ring-[#ffd21c]/90">
              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
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
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating menu cards (desktop) */}
      <FloatCard item={FEATURED[0]} delay={0.9} depth={26} mx={mx} my={my} reduceMotion={reduceMotion} className="top-[16%] left-[5%] xl:left-[9%]" />
      <FloatCard item={FEATURED[1]} delay={1.1} depth={40} mx={mx} my={my} reduceMotion={reduceMotion} className="top-[44%] left-[2%] xl:left-[5%]" />
      <FloatCard item={FEATURED[2]} delay={1.0} depth={34} mx={mx} my={my} reduceMotion={reduceMotion} className="top-[16%] right-[5%] xl:right-[9%]" />
      <FloatCard item={FEATURED[3]} delay={1.2} depth={46} mx={mx} my={my} reduceMotion={reduceMotion} className="top-[44%] right-[2%] xl:right-[5%]" />

      {/* "Always fresh" sticker — pops in, then wobbles */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 9 }}
        transition={{ duration: 0.7, delay: 1.4, type: "spring", bounce: 0.5 }}
        className="absolute top-[56%] right-[6%] z-10 sm:right-[13%] lg:top-[30%] lg:right-[24%]"
      >
        <motion.div
          style={reduceMotion ? undefined : { x: stickerX, y: stickerY }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [-5, 5, -5], scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-[92px] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#8c5800] bg-[#ffd21c] text-center text-[#34210a] shadow-[0_8px_24px_rgba(65,13,9,0.3)] sm:size-[112px]"
          >
            <span className="text-[9px] font-black tracking-[0.16em] uppercase sm:text-[10px]">
              Always
            </span>
            <span className="font-display text-xl leading-5 font-bold italic sm:text-2xl">
              fresh
            </span>
          </motion.div>
        </motion.div>
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

      {/* Order badge with rotating text ring */}
      <div className="absolute bottom-0 left-1/2 z-20 size-[150px] -translate-x-1/2 sm:size-[172px]">
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 size-full"
        >
          <defs>
            <path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
          </defs>
          <text fontSize="15" fontWeight="800" letterSpacing="3.2" fill="#a4161a">
            <textPath href="#ring">
              Order now • Fresh &amp; hot • Order now • Fresh &amp; hot •
            </textPath>
          </text>
        </motion.svg>

        <Link
          href="/menu"
          aria-label="Order pizza"
          className="group absolute inset-0 m-auto flex size-[104px] flex-col items-center justify-center rounded-full border-[7px] border-[#ffd21c] bg-white text-[#28201c] shadow-[0_12px_28px_rgba(44,13,10,0.24)] transition-transform duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#a4161a] focus-visible:outline-none sm:size-[120px]"
        >
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mb-1 flex size-8 items-center justify-center rounded-full bg-[#d62828] text-white"
          >
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </motion.span>
          <span className="text-[13px] leading-4 font-black tracking-tight uppercase sm:text-sm">
            Order
            <br />
            pizza
          </span>
        </Link>
      </div>
    </section>
  )
}
