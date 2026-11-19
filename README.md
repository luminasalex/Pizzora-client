# Pizzora Client

Pizzora is a responsive pizza marketplace built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui. Customers can browse approved menus and request delivery; vendors manage their menus and orders; administrators review listings and manage accounts.

## Requirements

- Node.js 20 or newer
- The Pizzora Express API running locally or a deployed API URL

## Local development

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the Express API origin, for example `http://localhost:3001`.

Useful checks:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Authentication and API

Better Auth is served by the Express API; the client uses its email/password, Google OAuth, and session endpoints. The API URL must be included in the server's `CLIENT_URL` allowlist. Browser API requests send credentials so the Better Auth session cookie is included.

The client uses the API for menu search, category/location filtering, price sorting, pagination, order requests, role dashboards, vendor menu management, account profiles, and Stripe subscription checkout. The client never sets privileged roles, approval state, or subscription status.

## Design system

The interface uses the Pizzora tomato-red and warm-cream palette, reusable shadcn/ui components in `components/ui`, Lucide icons, and Framer Motion. Local pizza imagery is stored in `app/image`; uploaded menu and profile images are hosted through the server-side ImgBB integration.

## Environment

See [.env.example](./.env.example). This value is public configuration, not a credential. Never place MongoDB, Better Auth, Google OAuth, Stripe, or ImgBB secrets in a `NEXT_PUBLIC_` variable.

## Deployment

Deploy this client to Vercel and set `NEXT_PUBLIC_API_URL` to the deployed Express API origin. Configure the API's `CLIENT_URL`, Better Auth URL, and Google OAuth callback consistently. A same-site production domain or reverse proxy is recommended for dependable session cookies across browsers.

No production deployment URL is configured in this repository yet.
