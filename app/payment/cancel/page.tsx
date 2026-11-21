"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { notify } from "@/lib/notifications"

export default function PaymentCancelPage() {
  const hasNotified = useRef(false)

  useEffect(() => {
    if (hasNotified.current) return
    hasNotified.current = true
    notify("warning", "Checkout cancelled", "Your subscription has not changed.")
  }, [])

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <section className="max-w-xl rounded-3xl border border-[#eee5db] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-bold tracking-[0.18em] text-[#d62828] uppercase">
          Checkout cancelled
        </p>
        <h1 className="font-display mt-4 text-4xl font-medium text-[#25201d]">
          No changes were made
        </h1>
        <p className="mt-3 leading-7 text-[#82776f]">
          Your subscription stays as it was. You can try the secure checkout again any time.
        </p>
        <Link
          href="/dashboard/vendor/subscription"
          className="mt-7 inline-flex rounded-full bg-[#d62828] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a4161a]"
        >
          Return to subscription
        </Link>
      </section>
    </main>
  )
}
