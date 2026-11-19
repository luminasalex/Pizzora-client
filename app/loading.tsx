"use client"

import { motion } from "framer-motion"
import {Loader2, Forklift, Box} from "lucide-react"

const sizes = [40, 60, 80]

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e8da] to-[#fff8ed] p-8">
      <div className="flex gap-8">
        {sizes.map((size) => (
          <motion.div
            key={size}
            className="flex flex-col items-center gap-2"
            initial="animate"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5 + size * 0.1 }}
          >
            <Loader2
              className="w-5 h-5 text-[#d62828] mx-auto"
              size={size}
            />
            <span className="text-sm text-[#746961]">Loading...</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 flex gap-2"
        initial="animate"
        animate="animate"
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {sizes.map((size) => (
          <Box
            key={size}
            className={`w-${size > 50 ? 4 : 3} h-6 bg-[#d62828] rounded-md animate-bounce ${size > 50 ? "duration-1500" : "duration-2000"}`}
            size={size}
          />
        ))}
      </motion.div>
    </div>
  )
}