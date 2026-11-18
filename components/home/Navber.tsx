"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Menu, Pizza, Search, X } from "lucide-react"
import Link from "next/link"
import { FormEvent, useEffect, useRef, useState } from "react"

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Browse menu", href: "/#featured" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Our story", href: "/#story" },
]

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

export default function Navber() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
  const reduceMotion = useReducedMotion()

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
    window.location.href = query
      ? `/?q=${encodeURIComponent(query)}#featured`
      : "/#featured"
    setSearchOpen(false)
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
          aria-label="PizzaHub home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#d62828] text-white shadow-[0_6px_14px_rgba(214,40,40,0.2)]">
            <Pizza size={22} strokeWidth={2.2} />
          </span>
          <span className="text-[21px] font-extrabold tracking-[-0.06em] text-[#25201d]">
            Pizza<span className="text-[#d62828]">Hub</span>
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
          <Link
            href="/src/Sign-in"
            className="px-3 py-2 text-sm font-semibold text-[#403832] transition-colors hover:text-[#d62828]"
          >
            Sign in
          </Link>
          <Link
            href="/src/Sign-up"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#d62828] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,40,40,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#a4161a]"
          >
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
