import type { ComponentPropsWithoutRef } from "react"
import { toast } from "@/components/ui/toast"

type ToastType = "success" | "error" | "info" | "warning"
type ToastActionProps = Pick<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
>

export function notify(
  type: ToastType,
  title: string,
  description?: string,
  actionProps?: ToastActionProps,
) {
  toast.add({
    type,
    title,
    description,
    actionProps,
    priority: type === "error" ? "high" : "low",
  })
}

export function getErrorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error ? cause.message : fallback
}
