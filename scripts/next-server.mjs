import { spawn } from "node:child_process"
import { join } from "node:path"
import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv

const [command, ...args] = process.argv.slice(2)

if (command !== "dev" && command !== "start") {
  console.error("Usage: node scripts/next-server.mjs <dev|start>")
  process.exit(1)
}

loadEnvConfig(process.cwd(), command === "dev")

const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (!appUrl && !process.env.PORT) {
  console.error("Set NEXT_PUBLIC_APP_URL to a URL with a port or define PORT.")
  process.exit(1)
}

let port = process.env.PORT ? Number(process.env.PORT) : undefined
if (port === undefined) {
  try {
    port = Number(new URL(appUrl).port)
  } catch {
    console.error(`NEXT_PUBLIC_APP_URL is not a valid URL: ${appUrl}`)
    process.exit(1)
  }
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(
    "Set PORT to a number from 1 to 65535 or include a port in NEXT_PUBLIC_APP_URL, such as http://localhost:4000.",
  )
  process.exit(1)
}

const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next")
const nextProcess = spawn(
  process.execPath,
  [nextBin, command, "-p", String(port), ...args],
  { stdio: "inherit", env: process.env },
)

nextProcess.on("error", (error) => {
  console.error("Could not start Next.js:", error.message)
  process.exitCode = 1
})

nextProcess.on("exit", (code, signal) => {
  if (signal) {
    process.exitCode = signal === "SIGINT" ? 130 : 1
  } else {
    process.exitCode = code ?? 1
  }
})
