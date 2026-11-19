"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Pizza,
  Search,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { signOut, useSession } from "@/lib/auth-client"
import { clearCachedApiToken } from "@/lib/api"

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Browse menu", href: "/menu" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Our story", href: "/#story" },
]

type NavUser = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className="text-sm font-medium text-[#635a54] transition-colors hover:text-[#d62828]"
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}

/* ---------- Avatar (next/image if the user has a photo, else initial) ---------- */
function Avatar({
  user,
  size = 44,
}: {
  user: NavUser
  size?: number
}) {
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
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-[#f6d9cb] font-semibold text-[#b4372a]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  )
}

/* ---------- Desktop user dropdown ---------- */
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

  // Close on outside click and on Escape
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
    "block rounded-lg px-2 py-2.5 text-[15px] text-[#403832] transition-colors hover:bg-[#f8f1e9] hover:text-[#d62828]"

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#f5ede3]"
      >
        <Avatar user={user} size={44} />
        <span className="max-w-[110px] truncate text-sm font-bold text-[#25201d]">
          {firstName}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#25201d] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            key="user-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
            className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-[#eee2d5] bg-white p-5 shadow-[0_18px_50px_rgba(54,36,22,0.15)]"
          >
            <div className="mb-3 px-2">
              <p className="truncate text-lg font-bold text-[#25201d]">
                {user.name}
              </p>
              <p className="mt-1 truncate text-sm text-[#8a7f76]">
                {user.email} · {user.role ?? "customer"}
              </p>
            </div>

            <div className="flex flex-col">
                {role === "vendor"
                  ? (
                    <Link
                      href="/dashboard/vendor"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClass}
                    >
                      Dashboard
                    </Link>
                  )
                  : role === "admin"
                  ? (
                    <Link
                      href="/dashboard/admin"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClass}
                    >
                      Dashboard
                    </Link>
                  )
                  : (
                    <Link
                      href="/dashboard/customer"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClass}
                    >
                      Dashboard
                    </Link>
                  )}
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  Profile settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false)
                    onSignOut()
                  }}
                  className={`${itemClass} w-full text-left`}
                >
                  Sign out
                </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navber() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
  const reduceMotion = useReducedMotion()

  const user: NavUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as { role?: string | null }).role ?? "customer",
      }
    : null
  const role = user?.role ?? "customer"

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12)

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = String(formData.get("q") ?? "").trim()
    window.location.href = query ? `/menu?q=${encodeURIComponent(query)}` : "/menu"
    setSearchOpen(false)
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

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-[#eadfd2] bg-[#fffdf9]/95 shadow-[0_8px_30px_rgba(54,36,22,0.06)] backdrop-blur-md"
          : "border-transparent bg-[#fffdf9]"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          href="/#home"
          aria-label="Pizzora home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#d62828] text-white shadow-[0_6px_14px_rgba(214,40,40,0.2)]">
            <Pizza size={22} strokeWidth={2.2} />
          </span>
          <span className="text-[21px] font-extrabold tracking-[-0.06em] text-[#25201d]">
            <span>Pizzora</span>
            <span className="ml-1 align-top text-[9px] font-bold tracking-[0.2em] text-[#f77f00]">
              ®
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          <NavigationLinks />
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search menu"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-[#554b45] transition-colors hover:bg-[#f5ede3] hover:text-[#d62828]"
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          {sessionPending ? (
            <div
              aria-hidden="true"
              className="h-11 w-40 animate-pulse rounded-full bg-[#f1e7db]"
            />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-2 text-sm font-semibold text-[#403832] transition-colors hover:text-[#d62828]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#d62828] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,40,40,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#a4161a]"
              >
                Get started <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search menu"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-[#554b45] hover:bg-[#f5ede3]"
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-[#25201d] hover:bg-[#f5ede3]"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.form
            key="search"
            onSubmit={submitSearch}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="absolute inset-x-0 top-full z-50 border-y border-[#eee2d5] bg-[#fffdf9] px-5 py-4 shadow-lg sm:px-8 lg:px-12"
          >
            <div className="mx-auto flex max-w-[760px] items-center gap-3 rounded-full border border-[#e7d9ca] bg-white px-4 py-2 focus-within:border-[#d62828] focus-within:ring-4 focus-within:ring-[#d62828]/10">
              <Search size={18} className="shrink-0 text-[#9a8d82]" />
              <input
                ref={searchInput}
                name="q"
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
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 76px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            className="absolute inset-x-0 top-full overflow-hidden border-t border-[#eee2d5] bg-[#fffdf9] lg:hidden"
          >
            <div className="flex h-full flex-col justify-between overflow-y-auto px-6 py-8">
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                {navigation.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-[#f0e7dc] py-4 text-2xl font-semibold tracking-tight text-[#25201d]"
                  >
                    {item.label}
                    <span className="text-sm font-medium text-[#d1c4b8]">
                      0{index + 1}
                    </span>
                  </Link>
                ))}
              </nav>

              {user ? (
                <div className="grid gap-3 pt-8">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#eee2d5] bg-white p-4">
                    <Avatar user={user} size={48} />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#25201d]">
                        {user.name}
                      </p>
                      <p className="truncate text-sm text-[#8a7f76]">
                        {user.email} · {user.role ?? "customer"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={
                      role === "admin"
                        ? "/dashboard/admin"
                        : role === "vendor"
                          ? "/dashboard/vendor"
                          : "/dashboard/customer"
                    }
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-[#e7d9ca] font-semibold text-[#403832]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-[#e7d9ca] font-semibold text-[#403832]"
                  >
                    Profile settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex h-12 items-center justify-center rounded-full bg-[#d62828] font-semibold text-white"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 pt-8">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-[#e7d9ca] font-semibold text-[#403832]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#d62828] font-semibold text-white"
                  >
                    Get started <ArrowUpRight size={17} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
