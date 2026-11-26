"use client"

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion"
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Pizza,
  Search,
  UserRound,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { signOut, useSession } from "@/lib/auth-client"
import { clearCachedApiToken } from "@/lib/api"

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Browse menu", href: "/menu" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Our story", href: "/#story" },
]

const quickSearches = ["Margherita", "Pepperoni", "Veggie", "BBQ chicken"]

type NavUser = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

const spring = { type: "spring", stiffness: 420, damping: 32 } as const

function dashboardHref(role?: string | null) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}

/* ------------------------------------------------------------------ */
/* Desktop links with a pill that follows the pointer                  */
/* ------------------------------------------------------------------ */

function DesktopLinks({ pathname }: { pathname: string }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const isActive = (href: string) =>
    href === "/menu" ? pathname.startsWith("/menu") : false

  return (
    <nav
      aria-label="Main navigation"
      onMouseLeave={() => setHovered(null)}
      className="hidden items-center lg:flex"
    >
      {navigation.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHovered(item.label)}
            onFocus={() => setHovered(item.label)}
            onBlur={() => setHovered(null)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              hovered === item.label || active
                ? "text-[#d62828]"
                : "text-[#635a54]"
            }`}
          >
            {hovered === item.label && (
              <motion.span
                layoutId="nav-hover-pill"
                transition={spring}
                className="absolute inset-0 -z-10 rounded-full bg-[#fbe9e3]"
              />
            )}
            {item.label}
            {active && (
              <motion.span
                layoutId="nav-active-dot"
                transition={spring}
                className="absolute inset-x-0 -bottom-0.5 mx-auto size-1 rounded-full bg-[#d62828]"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

function Avatar({ user, size = 40 }: { user: NavUser; size?: number }) {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const initial = (user.name?.trim()?.[0] ?? user.email?.[0] ?? "U").toUpperCase()

  if (user.image && failedImage !== user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name}
        width={size}
        height={size}
        unoptimized
        onError={() => setFailedImage(user.image ?? null)}
        className="shrink-0 rounded-full object-cover ring-2 ring-white"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f77f00] to-[#d62828] font-semibold text-white ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop user menu                                                   */
/* ------------------------------------------------------------------ */

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
}
const menuItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.18 } },
}

function UserMenu({
  user,
  onSignOut,
}: {
  user: NavUser
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const firstName = user.name?.split(" ")[0] ?? "Account"
  const role = user.role ?? "customer"

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const itemClass =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-[#403832] transition-colors hover:bg-[#fbe9e3] hover:text-[#d62828] focus-visible:bg-[#fbe9e3] focus-visible:outline-none"

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#f5ede3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/40"
      >
        <Avatar user={user} size={36} />
        <span className="max-w-[100px] truncate text-sm font-bold text-[#25201d]">
          {firstName}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDown size={16} className="text-[#25201d]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            key="user-menu"
            initial={
              reduceMotion ? false : { opacity: 0, y: -10, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={reduceMotion ? { duration: 0 } : spring}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-50 mt-4 w-72 rounded-3xl border border-white/70 bg-white/95 p-3 shadow-[0_24px_60px_rgba(54,36,22,0.18)] backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center gap-3 rounded-2xl bg-[#fff6ee] p-3">
              <Avatar user={user} size={44} />
              <div className="min-w-0">
                <p className="truncate font-bold text-[#25201d]">{user.name}</p>
                <p className="truncate text-xs text-[#8a7f76]">{user.email}</p>
                <span className="mt-1 inline-block rounded-full bg-[#d62828]/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-[#d62828]">
                  {role}
                </span>
              </div>
            </div>

            <motion.div
              variants={menuList}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className="flex flex-col"
            >
              <motion.div variants={menuItem}>
                <Link
                  href={dashboardHref(role)}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              </motion.div>
              <motion.div variants={menuItem}>
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  <UserRound size={17} />
                  Profile settings
                </Link>
              </motion.div>
              <motion.div variants={menuItem}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false)
                    onSignOut()
                  }}
                  className={`${itemClass} w-full text-left`}
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const mobileList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}
const mobileItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
}

export default function Navber() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending: sessionPending } = useSession()
  const reduceMotion = useReducedMotion()

  const [isScrolled, setIsScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  const user: NavUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as { role?: string | null }).role ?? "customer",
      }
    : null

  /* Scroll behaviour: condense at the top, hide on the way down, show on the way up */
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setIsScrolled(latest > 12)
    setHidden(latest > previous && latest > 180)
  })

  // Close panels when the route changes
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!searchOpen && !mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [searchOpen, mobileOpen])

  function goSearch(query: string) {
    const q = query.trim()
    router.push(q ? `/menu?q=${encodeURIComponent(q)}` : "/menu")
    setSearchOpen(false)
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    goSearch(String(formData.get("q") ?? ""))
  }

  async function handleSignOut() {
    setMobileOpen(false)
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          clearCachedApiToken()
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  const keepVisible = hidden && !searchOpen && !mobileOpen

  const searchToggle = (
    <button
      type="button"
      aria-label={searchOpen ? "Close search" : "Search menu"}
      aria-expanded={searchOpen}
      onClick={() => {
        setMobileOpen(false)
        setSearchOpen((open) => !open)
      }}
      className="relative flex size-10 items-center justify-center rounded-full text-[#554b45] transition-colors hover:bg-[#f5ede3] hover:text-[#d62828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/40"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={searchOpen ? "x" : "s"}
          initial={reduceMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.16 }}
          className="flex"
        >
          {searchOpen ? <X size={19} /> : <Search size={19} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -90, opacity: 0 }}
      animate={{ y: keepVisible ? "-130%" : 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      className="sticky top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div
        className={`relative mx-auto flex h-16 items-center justify-between gap-4 rounded-full border px-3 pl-4 transition-all duration-500 ease-out sm:px-4 lg:h-[68px] ${
          isScrolled
            ? "max-w-[1080px] border-white/80 bg-white/75 shadow-[0_12px_40px_rgba(54,36,22,0.12)] backdrop-blur-xl"
            : "max-w-[1320px] border-transparent bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/#home"
          aria-label="Pizzora home"
          className="group flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <motion.span
            whileHover={reduceMotion ? undefined : { rotate: 180, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="flex size-10 items-center justify-center rounded-full bg-[#d62828] text-white shadow-[0_6px_14px_rgba(214,40,40,0.28)]"
          >
            <Pizza size={22} strokeWidth={2.2} />
          </motion.span>
          <span className="text-[21px] font-extrabold tracking-[-0.06em] text-[#25201d]">
            Pizzora
            <span className="ml-1 align-top text-[9px] font-bold text-[#f77f00]">
              ®
            </span>
          </span>
        </Link>

        <DesktopLinks pathname={pathname} />

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {searchToggle}

          {sessionPending ? (
            <div
              aria-hidden="true"
              className="h-10 w-36 animate-pulse rounded-full bg-[#f1e7db]"
            />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#403832] transition-colors hover:bg-[#f5ede3] hover:text-[#d62828]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full bg-[#d62828] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,40,40,0.25)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/50 focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#f77f00] to-[#d62828] transition-transform duration-500 ease-out group-hover:translate-x-0"
                />
                <span className="relative">Get started</span>
                <ArrowUpRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          {searchToggle}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setSearchOpen(false)
              setMobileOpen((open) => !open)
            }}
            className="flex size-10 items-center justify-center rounded-full bg-[#25201d] text-white transition-colors hover:bg-[#d62828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d62828]/40"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="flex"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Scroll progress */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-8 bottom-0 h-[2px] overflow-hidden rounded-full transition-opacity duration-300 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.span
            style={{ scaleX: progress, transformOrigin: "left" }}
            className="block h-full w-full bg-gradient-to-r from-[#f77f00] to-[#d62828]"
          />
        </span>

        {/* Search panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              key="search"
              onSubmit={submitSearch}
              initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0 } : spring}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-full z-50 mt-3 rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_24px_60px_rgba(54,36,22,0.16)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 rounded-full border border-[#e7d9ca] bg-white px-4 py-1.5 focus-within:border-[#d62828] focus-within:ring-4 focus-within:ring-[#d62828]/10">
                <Search size={18} className="shrink-0 text-[#9a8d82]" />
                <input
                  ref={searchInput}
                  name="q"
                  autoComplete="off"
                  aria-label="Search pizzas and restaurants"
                  placeholder="Search pizzas and restaurants"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#25201d] outline-none placeholder:text-[#a99c91]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#25201d] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#d62828]"
                >
                  Search
                </button>
              </div>

              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                className="mt-3 flex flex-wrap gap-2 px-1"
              >
                <span className="py-1.5 text-xs text-[#8a7f76]">Popular:</span>
                {quickSearches.map((term) => (
                  <motion.button
                    key={term}
                    type="button"
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => goSearch(term)}
                    className="rounded-full bg-[#fff1e6] px-3 py-1.5 text-xs font-semibold text-[#b4372a] transition-colors hover:bg-[#d62828] hover:text-white"
                  >
                    {term}
                  </motion.button>
                ))}
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Mobile sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={reduceMotion ? { duration: 0 } : spring}
              style={{ transformOrigin: "top right" }}
              className="absolute inset-x-0 top-full z-50 mt-3 max-h-[calc(100dvh-110px)] overflow-y-auto rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_24px_60px_rgba(54,36,22,0.18)] backdrop-blur-xl lg:hidden"
            >
              <motion.nav
                aria-label="Mobile navigation"
                variants={mobileList}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                className="flex flex-col"
              >
                {navigation.map((item) => (
                  <motion.div key={item.label} variants={mobileItem}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between rounded-2xl px-3 py-3.5 text-xl font-semibold tracking-tight text-[#25201d] transition-colors hover:bg-[#fff1e6] hover:text-[#d62828]"
                    >
                      {item.label}
                      <ArrowUpRight
                        size={18}
                        className="text-[#d1c4b8] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d62828]"
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                variants={mobileList}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                className="mt-4 grid gap-2.5 border-t border-[#f0e7dc] pt-4"
              >
                {user ? (
                  <>
                    <motion.div
                      variants={mobileItem}
                      className="flex items-center gap-3 rounded-2xl bg-[#fff6ee] p-3"
                    >
                      <Avatar user={user} size={46} />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#25201d]">{user.name}</p>
                        <p className="truncate text-sm text-[#8a7f76]">
                          {user.email} · {user.role ?? "customer"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div variants={mobileItem}>
                      <Link
                        href={dashboardHref(user.role)}
                        onClick={() => setMobileOpen(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#e7d9ca] font-semibold text-[#403832] transition-colors hover:border-[#d62828] hover:text-[#d62828]"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={mobileItem}>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#e7d9ca] font-semibold text-[#403832] transition-colors hover:border-[#d62828] hover:text-[#d62828]"
                      >
                        <UserRound size={17} />
                        Profile settings
                      </Link>
                    </motion.div>
                    <motion.button
                      variants={mobileItem}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleSignOut}
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#d62828] font-semibold text-white"
                    >
                      <LogOut size={17} />
                      Sign out
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div variants={mobileItem}>
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-12 items-center justify-center rounded-full border border-[#e7d9ca] font-semibold text-[#403832] transition-colors hover:border-[#d62828] hover:text-[#d62828]"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                    <motion.div variants={mobileItem}>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d62828] to-[#f77f00] font-semibold text-white shadow-[0_8px_18px_rgba(214,40,40,0.25)]"
                      >
                        Get started <ArrowUpRight size={17} />
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}