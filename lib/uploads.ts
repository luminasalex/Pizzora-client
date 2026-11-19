import { apiFetch } from "@/lib/api"
import type { ApiEnvelope } from "@/lib/menu-types"

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function uploadImage(file: File): Promise<string> {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image.")
  }
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Images must be smaller than 4 MB.")
  }

  const image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The selected image could not be read."))
        return
      }
      resolve(reader.result)
    }
    reader.onerror = () => reject(new Error("The selected image could not be read."))
    reader.readAsDataURL(file)
  })

  const result = await apiFetch<ApiEnvelope<{ url: string }>>("/api/uploads/images", {
    method: "POST",
    body: JSON.stringify({ image }),
  })
  return result.data.url
}
