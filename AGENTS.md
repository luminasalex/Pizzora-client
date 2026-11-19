# Pizzora — Full-Stack Pizza Ordering Platform

## Overview
Full-stack pizza ordering & delivery platform with Customer/Vendor/Admin roles. Next.js 16 App Router frontend (React 19, TypeScript strict, Tailwind CSS v4) + Express.js + MongoDB backend. Auth via Better Auth (email/password + Google OAuth) with MongoDB adapter.

## Frameworks & Libraries
- **Frontend**: Next.js 16 (App Router, RSC), React 19, TypeScript 5 (strict), Tailwind CSS v4
- **UI**: shadcn/ui (base-nova style) built on Base UI, lucide-react, framer-motion, embla-carousel-react, recharts, next-themes, date-fns
- **Backend**: Express.js 5, MongoDB driver, `@better-auth/mongo-adapter`
- **Auth**: better-auth with `@better-auth/mongo-adapter`, email/password + Google social login
- **Motion/Widgets**: framer-motion, embla-carousel-react, react-resizable-panels, recharts, date-fns

## Developer Commands (run from `client/`)
| Purpose | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Serve production | `npm run start` |
| Type-check | `npm run typecheck` (`tsc --noEmit`) |
| Lint | `npm run lint` |
| Format | `npm run format` (Prettier + `prettier-plugin-tailwindcss`) |

**Always verify with `npm run typecheck` then `npm run lint`** before finishing. Lint has pre-existing baseline errors — do not attribute new changes to them.

## Environment
Create a local `.env` (gitignored). Required keys:
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000`
- `BETTER_AUTH_SECRET` — random secret string
- `BETTER_AUTH_DB_URI` — MongoDB connection URI; auth requires a running MongoDB reachable here
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `MONGODB_URI` — also used by API routes (defaults to `mongodb://localhost:27017`)

## Key Files
- `client/app/layout.tsx` — root layout with Navber, Footer, Geist fonts
- `client/app/page.tsx` — home page, fetches `category`/`q` searchParams, calls `/api/menus` and `/api/categories`
- `client/app/api/menus/route.ts` — GET/POST menu items with category/$regex search
- `client/app/api/categories/route.ts` — GET/POST categories with parent filtering
- `client/app/api/orders/route.ts` — GET/POST orders with userId filtering, sorted by date
- `client/app/api/restaurants/route.ts` — GET/POST restaurants
- `client/app/api/auth/[...all]/route.ts` — Better Auth Next-js handler (`toNextJsHandler(auth)`)
- `client/lib/auth.ts` — Better Auth config with roles (customer/vendor/admin); role assignment logic for admin emails
- `client/lib/auth-client.ts` — Browser auth client: `signIn`, `signUp`, `signOut`, `useSession`
- `server/index.js` — Express API + MongoDB connection, exports `db`; collections: `categories`, `menus`, `orders`, `restaurants`
- `client/hooks/use-api.ts` — Custom hook for fetching data from API routes (`/api/...`)
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `components/home/` — Home page sections (Hero, Menu, Categories, Benefits, How it works, Vendor, Final CTA)

## Known Quirks
- `next dev` rewrites the managed block `<!-- BEGIN:nextjs-agent-rules -->` — commit AGENTS.md with your work; deleting causes uncommitted diff
- Prettier enforces **no semicolons, double quotes, 2-space indent**, with `prettier-plugin-tailwindcss`
- `next.config.ts` allows **all** remote image hostnames — new `<Image>` hosts need no config changes
- Lint has **pre-existing errors** (baseline failures: `react-hooks/set-state-in-effect` in `hooks/use-mobile.ts` and `components/ui/carousel.tsx`) — do not attribute new changes to them
- `CLAUDE.md` is a pointer (`@AGENTS.md`); keep AGENTS.md as the single source of truth

## Structure
- `@/*` alias maps to repo root (`tsconfig.json` `paths`) — e.g. `@/components/ui/button`
- Auth pages live in `app/(Auth)/sign-in|sign-up/page.tsx` and are `"use client"`; toggle via `/sign-in` and `/sign-up` links
- `(Auth)` group does not appear in the URL
- App-level sections in `components/home/`, reusable hooks in `hooks/`, UI primitives in `components/ui/`
- Server Components default; `"use client"` files have event handlers

## API Integration
- Frontend fetches from `/api/menus`, `/api/categories`, `/api/orders`, `/api/restaurants`, `/api/auth/[...all]`
- Server (`server/index.js`) connects to MongoDB collection names: `categories`, `menus`, `orders`, `restaurants`
- API routes use `NextResponse` and read `MONGODB_URI` from env
- Categories and menus flow from API → `app/page.tsx` → `HomePage` → UI components
- `use-api.ts` hook pattern: `useApi('/api/menus', { method: 'GET' })` returns `{ data, error, isLoading }`
- HomePage accepts `selectedCategory`, `searchQuery`, `featuredItems`, and `categories` props
- CategoriesSection accepts `categories` prop (with default fallback data if API returns empty)
- FeaturedMenuSection accepts `items` prop (menu items from API), `selectedCategory`, and `searchQuery`

## Authentication Flow
- Better Auth configured with email/password + Google provider
- Roles: "customer" (default), "vendor", "admin" (assigned only to verified emails in ADMIN_EMAILS list)
- Admin emails configured via `ADMIN_EMAILS` env var (comma-separated)
- Auth routes: `/sign-in`, `/sign-up` (toggle links); `(Auth)` group invisible in URL
- Session managed via `useSession` in navbar; `signOut` with success redirect to `/`
- Client-side auth client: `client/lib/auth-client.ts` (no server env vars bundled)
- Server-side auth config: `client/lib/auth.ts` (MongoDB adapter, baseURL from env)