"use client"

import { useEffect, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, UtensilsCrossed } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { apiFetch } from "@/lib/api"
import type { ApiEnvelope, MenuItemRecord } from "@/lib/menu-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { getErrorMessage, notify } from "@/lib/notifications"

type MenuItemDetailsProps = {
  itemId: string
}

export default function MenuItemDetails({ itemId }: MenuItemDetailsProps) {
  const router = useRouter()
  const { data, error, isLoading } = useApi<ApiEnvelope<MenuItemRecord>>(
    `/api/menu-items/${encodeURIComponent(itemId)}`,
  )
  const { data: session, isPending: sessionPending } = useSession()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const item = data?.data
  const role = session?.user?.role ?? "customer"

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${itemId}`)}`)
    }
  }, [itemId, router, session?.user, sessionPending])

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!item) return
    setIsSubmitting(true)
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId: item.id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      })
      notify("success", "Order request sent", "The restaurant will review your request.")
      setDeliveryAddress("")
      setMessage("")
    } catch (cause) {
      notify("error", "Could not place order", getErrorMessage(cause, "Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionPending || !session?.user || isLoading) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-6xl animate-pulse px-5 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-[#f3e8dc]" />
          <div className="h-96 rounded-3xl bg-[#f3e8dc]" />
        </div>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-4xl font-medium text-[#25201d]">
          Menu item unavailable
        </h1>
        <p className="mt-3 text-[#82776f]">
          {error ?? "This item may have been removed or is no longer available."}
        </p>
        <Link
          href="/menu"
          className="mt-6 rounded-full bg-[#d62828] px-5 py-3 text-sm font-semibold text-white"
        >
          Return to menu
        </Link>
      </main>
    )
  }

  const images = item.images.length ? item.images : ["/pizza-placeholder.svg"]
  const imageIndex = Math.min(activeImageIndex, images.length - 1)
  const image = images[imageIndex]

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-16">
      <Link href="/menu" className="text-sm font-semibold text-[#d62828] hover:underline">
        ← Back to menu
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[1.1/1] overflow-hidden rounded-[28px] bg-[#f5eadc]">
            <Image
              src={image}
              alt={item.itemName}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
              unoptimized
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Menu item images">
              {images.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative size-16 overflow-hidden rounded-xl border-2 ${
                    imageIndex === index ? "border-[#d62828]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="rounded-[28px] border border-[#eee5db] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-[#d62828] uppercase">
            {item.category}
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-medium tracking-tight text-[#25201d] sm:text-4xl">
              {item.itemName}
            </h1>
            <p className="shrink-0 text-xl font-bold text-[#25201d]">
              ৳{item.price.toFixed(2)}
            </p>
          </div>
          <p className="mt-5 leading-7 text-[#6f655e]">{item.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#f0e9e1] py-4 text-sm text-[#6f655e]">
            <span className="inline-flex items-center gap-2">
              <UtensilsCrossed className="size-4 text-[#d62828]" />
              {item.vendor?.name ?? "Local restaurant"}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-[#d62828]" />
              {item.location}
            </span>
          </div>

          {sessionPending ? (
            <p className="mt-6 text-sm text-[#82776f]">Checking your account…</p>
          ) : !session?.user ? (
            <div className="mt-6 rounded-2xl bg-[#fff8ed] p-5">
              <p className="font-semibold text-[#25201d]">Ready to order?</p>
              <p className="mt-1 text-sm text-[#82776f]">
                Sign in with a customer account to request delivery.
              </p>
              <Link
                href="/sign-in"
                className="mt-4 inline-flex rounded-full bg-[#d62828] px-5 py-3 text-sm font-semibold text-white"
              >
                Sign in to order
              </Link>
            </div>
          ) : role !== "customer" ? (
            <p className="mt-6 rounded-2xl bg-[#fff8ed] p-5 text-sm text-[#6f655e]">
              Orders can only be placed from a customer account.
            </p>
          ) : (
            <form onSubmit={submitOrder} className="mt-6 grid gap-4">
              <h2 className="text-lg font-bold text-[#25201d]">Delivery request</h2>
              <label className="grid gap-2 text-sm font-semibold text-[#403832]">
                Delivery date
                <Input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#403832]">
                Delivery address
                <Textarea
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  maxLength={500}
                  rows={3}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#403832]">
                Message (optional)
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={1000}
                  rows={2}
                />
              </label>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-[#d62828] text-base hover:bg-[#a4161a]"
              >
                {isSubmitting ? "Sending request…" : "Place order request"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
