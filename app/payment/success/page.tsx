"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import type { ApiEnvelope } from "@/lib/menu-types"
import { useSession } from "@/lib/auth-client"

type Subscription = {
  plan: "free" | "premium"
  expiresAt: string | null
}

export default function PaymentSuccessPage() {
  const { data: session } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, isLoading, refetch } = useApi<ApiEnvelope<Subscription>>(
    "/api/subscriptions/current",
    { enabled: isVendor },
  )
  const [attempts, setAttempts] = useState(0)
  const isPremium = data?.data.plan === "premium"

  useEffect(() => {
    if (!isVendor || isPremium || attempts >= 4) return
    const timer = window.setTimeout(() => {
      refetch()
      setAttempts((current) => current + 1)
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [attempts, isPremium, isVendor, refetch])

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <section className="max-w-xl rounded-3xl border border-[#eee5db] bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h1 className="font-display mt-5 text-4xl font-medium text-[#25201d]">
          Payment received
        </h1>
        <p className="mt-3 leading-7 text-[#82776f]">
          Stripe is confirming your subscription. Premium only becomes active
          after the verified payment webhook is processed.
        </p>
        {isPremium ? (
          <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            Premium is active on your vendor account.
          </p>
        ) : (
          <p className="mt-5 text-sm text-[#82776f]" role="status">
            {isLoading ? "Checking subscription status…" : "Waiting for payment confirmation…"}
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="rounded-full bg-[#d62828] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a4161a]"
          >
            Subscription details
          </Link>
          <Link
            href="/dashboard/vendor"
            className="rounded-full border border-input px-5 py-3 text-sm font-semibold text-[#25201d]"
          >
            Vendor dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
