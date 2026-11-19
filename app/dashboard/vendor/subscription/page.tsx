"use client"

import { useState } from "react"
import { Award, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { ApiEnvelope } from "@/lib/menu-types"

type Subscription = {
  plan: "free" | "premium"
  expiresAt: string | null
  cancelAtPeriodEnd: boolean
}

const freeFeatures = [
  "Up to 3 active menu items",
  "Vendor dashboard and order management",
]
const premiumFeatures = [
  "Unlimited active menu items",
  "Premium vendor badge and featured placement",
  "Everything in the Free plan",
]

export default function VendorSubscription() {
  const { data: session, isPending: sessionPending } = useSession()
  const isVendor = session?.user?.role === "vendor"
  const { data, error, isLoading, refetch } = useApi<ApiEnvelope<Subscription>>(
    "/api/subscriptions/current",
    { enabled: isVendor },
  )
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const plan = data?.data.plan ?? "free"

  async function upgrade() {
    setIsCheckingOut(true)
    setActionError(null)
    try {
      const result = await apiFetch<ApiEnvelope<{ url: string }>>(
        "/api/subscriptions/checkout",
        { method: "POST" },
      )
      const checkoutUrl = new URL(result.data.url)
      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.hostname !== "checkout.stripe.com"
      ) {
        throw new Error("The payment service returned an invalid checkout URL.")
      }
      window.location.assign(checkoutUrl.href)
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Could not start Premium checkout.",
      )
      setIsCheckingOut(false)
    }
  }

  async function cancelRenewal() {
    setIsCancelling(true)
    setActionError(null)
    try {
      await apiFetch("/api/subscriptions/cancel", { method: "POST" })
      refetch()
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Could not cancel this subscription.",
      )
    } finally {
      setIsCancelling(false)
    }
  }

  if (sessionPending || (isVendor && isLoading)) {
    return <main className="p-8 text-center text-muted-foreground">Loading subscription…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to manage your subscription.</main>
  }
  if (!isVendor) {
    return <main className="p-8 text-center">Only restaurant partners can manage subscriptions.</main>
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-[#d62828]">Vendor dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-[#25201d]">Subscription</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the plan that fits your restaurant.
          </p>
        </header>

        {(error || actionError) && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {actionError ?? error}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-[#eee5db]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Free
                {plan === "free" && (
                  <span className="rounded-full bg-[#fff2e4] px-3 py-1 text-xs text-[#8c4a2d]">
                    Current plan
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">A simple way to start selling.</p>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-[#5f554e]">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="size-4 shrink-0 text-green-600" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#d62828]/40 bg-[#fffaf4]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="size-5 text-[#d62828]" /> Premium
                </span>
                {plan === "premium" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    Active
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                More room to grow and stand out.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-[#5f554e]">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="size-4 shrink-0 text-green-600" /> {feature}
                  </li>
                ))}
              </ul>
              {plan === "premium" ? (
                <div className="mt-5 grid gap-3">
                  <p className="text-sm text-muted-foreground">
                    {data?.data.cancelAtPeriodEnd
                      ? `Premium access ends ${data.data.expiresAt ? new Date(data.data.expiresAt).toLocaleDateString() : "at the end of the billing period"}.`
                      : data?.data.expiresAt
                        ? `Renews or expires ${new Date(data.data.expiresAt).toLocaleDateString()}.`
                        : "Your Premium plan is active."}
                  </p>
                  {!data?.data.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={cancelRenewal}
                      disabled={isCancelling}
                    >
                      {isCancelling ? "Cancelling renewal…" : "Cancel renewal"}
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  className="mt-6 w-full bg-[#d62828] hover:bg-[#a4161a]"
                  disabled={isCheckingOut}
                  onClick={upgrade}
                >
                  {isCheckingOut ? "Opening secure checkout…" : "Upgrade with Stripe"}
                </Button>
              )}
              <Button
                variant="ghost"
                className="mt-3 w-full"
                onClick={refetch}
                disabled={isLoading}
              >
                Refresh subscription status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
