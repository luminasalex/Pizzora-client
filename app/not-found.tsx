"use client"

import { Home, Pizza, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[#211b18] text-white flex flex-col items-center justify-center px-4 pt-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-6xl font-bold text-[#d62828] mb-6">
          <Pizza size={56} />
          <span>404</span>
        </div>

        <h1 className="text-4xl font-bold tracking-[-0.04em] mb-4">
          Page not found
        </h1>

        <p className="text-white/70 max-w-lg mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist,
          <br />
          maybe it moved or was never baked.
        </p>

        <div className="flex justify-center gap-4">
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
        className="mt-16 text-[#f77f00]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Pizza size={48} />
      </motion.div>
    </section>
  )
}