"use client"

import { X, Home, PizzaSlice, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NotFound() {
  return (
    <section
      className="min-h-screen bg-[#211b18] text-white flex flex-col items-center justify-center pt-12"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-6xl text-[#d62828] mb-6">
          <PizzaSlice />
          <span>404</span>
        </div>

        <h1 className="text-4xl font-bold tracking-[-0.04em] mb-4">
            Page not found
        </h1>

        <p className="text-[#b4372a] max-w-lg mb-8">
            The page you're looking for doesn't exist,<br />
            maybe it moved or was never baked.
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#d62828] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a4161a]"
          >
            <Home size={16} /> Home
          </Link>
          <Link
            href="/#featured"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#f77f00] hover:text-[#25201d]"
          >
            <ArrowRight size={16} /> Browse menu
          </Link>
        </div>
      </div>

      <motion.div
        className="mt-16 animate-bounce"
        initial={false}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{ duration: 2 }}
      >
        <PizzaSlice
          className="w-12 h-12 text-[#f77f00]"
          size={32}
        />
      </motion.div>
    </section>
  )
}