import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";
import Navber from "@/components/home/Navber";
import Footer from "@/components/home/Footer";
import { Toaster } from "@/components/ui/toast";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL as string,
  ),
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <Navber />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
