"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/lib/auth-client"
import { apiFetch } from "@/lib/api"

type ProfileUser = {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string
  businessName?: string | null
}

function ProfileEditor({ user }: { user: ProfileUser }) {
  const [name, setName] = useState(user.name)
  const [businessName, setBusinessName] = useState(user.businessName ?? "")
  const [imageUrl, setImageUrl] = useState(user.image ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage(null)
    try {
      await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          image: imageUrl || undefined,
          ...(user.role === "vendor" ? { businessName } : {}),
        }),
      })
      setMessage("Profile updated successfully.")
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not update your profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl border-[#eee5db]">
      <CardHeader>
        <CardTitle>Profile settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your contact information. Account roles and payment settings are protected.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveProfile} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={80}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={user.email} disabled />
          </div>
          {user.role === "vendor" && (
            <div className="grid gap-2">
              <Label htmlFor="business-name">Restaurant name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                minLength={2}
                maxLength={120}
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="profile-image">Profile image URL</Label>
            <Input
              id="profile-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/avatar.png"
            />
            <p className="text-xs text-muted-foreground">
              Enter a valid HTTPS image URL (maximum 4 MB recommended).
            </p>
          </div>
          {message && (
            <p className="text-sm text-[#6f655e]" role="status">
              {message}
            </p>
          )}
          <Button type="submit" className="bg-[#d62828] hover:bg-[#a4161a]" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <main className="p-8 text-center text-muted-foreground">Loading profile…</main>
  }
  if (!session?.user) {
    return <main className="p-8 text-center">Please sign in to update your profile.</main>
  }

  return (
    <main className="flex min-h-[70vh] justify-center bg-[#fffdf9] px-5 py-12 sm:px-8">
      <ProfileEditor user={session.user} />
    </main>
  )
}