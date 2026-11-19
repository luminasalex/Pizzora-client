"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Shield, User, Building, Award, TrendingUp, Layout, LogIn, LogOut } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

export default function VendorSubscription() {
  const { data: session, isPending: sessionPending } = useSession()

  const user: any = session?.user
  const role = (user as { role?: string }).role ?? "customer"

  if (role !== "vendor") {
    return <div className="p-8">Access denied: Vendor subscription only.</div>
  }

  useEffect(() => {
    const handleVisibilityChange = () => {}
    const visibilityChange = "onvisibilitychange" in document ? "visibilitychange" : "onpagehide" in document ? "pagehide" : ""
    if (visibilityChange) {
      document.addEventListener(visibilityChange, handleVisibilityChange)
    }
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange)
    }
  }, [])

  // Sample subscription data
  const subscriptionPlan = "Free"
  const planDetails = {
    free: {
      label: "Free Plan",
      active: true,
      maxItems: 3,
      badge: "Free",
      features: ["Up to 3 active menu items", "Basic vendor dashboard", "Order management"],
      isPremium: false,
    },
    premium: {
      label: "Premium Plan",
      active: false,
      maxItems: -1, // Unlimited
      badge: "Premium",
      features: [
        "Unlimited active menu items",
        "Premium vendor badge",
        "Featured homepage placement",
        "All Free features",
      ],
      isPremium: true,
    },
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <AnimatePresence>
        {sessionPending ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            Loading subscription...
          </motion.div>
        ) : user ? (
          <div className="max-w-xl mx-auto">
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-[--chartjs-color-1] mb-2">
                Subscription
              </h1>
              <p className="text-[--chartjs-color-6]">
                Manage your vendor subscription plan.
              </p>
            </header>

            {/* Current Plan Status */}
            <section className="mb-8 card p-6">
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">
                Current Plan: {planDetails.free.label}
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${planDetails.free.isPremium ? "bg-green-100 text-green-800" : "bg-[#f0e7dc] text-[--chartjs-color-1]"}`}
                >
                  {planDetails.free.badge}
                </span>
                <div>
                  <p className="font-medium">Maximum {planDetails.free.maxItems === -1 ? "unlimited" : planDetails.free.maxItems} active items</p>
                  <p className="text-sm text-muted-foreground">
                    {planDetails.free.features.join(". ")}
                  </p>
                </div>
              </div>
            </section>

            {/* Upgrade Plan */}
            <section>
              <h2 className="text-xl font-semibold text-[--chartjs-color-1] mb-4">Upgrade to Premium</h2>
              <p className="text-muted-foreground mb-6">
                Unlock unlimited menu items and premium features.
              </p>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div
                  className={`p-6 rounded-xl border ${planDetails.free.isPremium ? "border-green-500" : "border-[--chartjs-color-1]"} ${!planDetails.free.isPremium ? "bg-primary/5" : "bg-green-50"}`}
                >
                  <h3 className="text-lg font-medium mb-2">Free Plan</h3>
                  <p className="text-muted-foreground">
                    {planDetails.free.features[0]}. {planDetails.free.features[1]}.
                  </p>
                  <p className="text-sm">
                    {planDetails.free.maxItems === -1 ? "Unlimited items" : `Up to ${planDetails.free.maxItems} active items`}
                  </p>
                  <Button
                    className="mt-4 w-full rounded-md bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                  >
                    Upgrade to Premium
                  </Button>
                </div>

                <div
                  className={`p-6 rounded-xl border ${planDetails.free.isPremium ? "border-green-500 bg-green-50" : "border-[--chartjs-color-1]"} ${planDetails.free.isPremium ? "bg-green-50" : ""}`}
                >
                  <h3 className="text-lg font-medium mb-2">Premium Plan</h3>
                  <p className="text-muted-foreground">
                    {planDetails.premium.features.join(". ")}
                  </p>
                  <p className="text-sm">
                    {planDetails.premium.maxItems === -1 ? "Unlimited items" : `Up to ${planDetails.premium.maxItems} active items`}
                  </p>
                  <Button
                    className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    disabled>
                    Subscribed
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-[#f0e7dc]">
                <p className="text-sm text-muted-foreground">
                  * Stripe Checkout integration required for Premium upgrade. 
                  Contact backend developer for payment processing.
                </p>
              </div>
            </section>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            Sign in to manage subscription
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}