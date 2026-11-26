import { ArrowUpRight, Pizza } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { label: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "Facebook", url: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  { label: "X", url: process.env.NEXT_PUBLIC_X_URL },
].flatMap(({ label, url }) =>
  url?.startsWith("https://") ? [{ label, url }] : []
)

const browseLinks = [
  { label: "Classic pizzas", href: "/menu?category=Classic%20Pizzas" },
  { label: "Vegetarian", href: "/menu?category=Vegetarian%20Pizzas" },
  { label: "Meat lovers", href: "/menu?category=Meat%20Lovers" },
  { label: "Sides & more", href: "/menu?category=Sides%20%26%20Appetizers" },
]

export default function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim()

  return (
    <footer id="footer" className="bg-[#211b18] text-white">
      <div className="mx-auto max-w-[1320px] px-5 pt-16 pb-8 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Link href="/#home" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#d62828] text-white">
                <Pizza size={21} />
              </span>
              <span className="text-xl font-extrabold tracking-[-0.06em]">
                Pizzora
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/60">
              A little more joy in every slice. Discover neighborhood pizzerias,
              made-fresh favorites, and the people behind them.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:border-white/40 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.18em] text-[#f77f00] uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm text-white/65">
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/#home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/menu"
                >
                  Browse menu
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/#how-it-works"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/#story"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.18em] text-[#f77f00] uppercase">
              Browse by taste
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm text-white/65">
              {browseLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    className="transition-colors hover:text-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.18em] text-[#f77f00] uppercase">
              For restaurants
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60">
              Put your craft in the spotlight and meet your next regular.
            </p>
            <Link
              href="/sign-up"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#f77f00]"
            >
              Become a partner <ArrowUpRight size={15} />
            </Link>
            <p className="mt-5 text-xs leading-6 text-white/40">
              Have an order question? Sign in to manage your account.
            </p>
            {(contactEmail || contactPhone) && (
              <div className="mt-4 grid gap-2 text-sm text-white/65">
                {contactEmail && contactEmail.includes("@") && (
                  <a
                    className="hover:text-white"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </a>
                )}
                {contactPhone && /^[+0-9(). -]+$/.test(contactPhone) && (
                  <a
                    className="hover:text-white"
                    href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                  >
                    {contactPhone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Pizzora. Made for the love of pizza.
          </p>
          <p>Good food brings people together.</p>
        </div>
      </div>
    </footer>
  )
}
