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

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to the Express API origin, for example `http://localhost:3001`.
Set `NEXT_PUBLIC_APP_URL` to the website URL with an explicit port, for example `http://localhost:4000`. The `dev` and `start` scripts use that port to run Next.js and as the site's metadata base URL. For production behind a reverse proxy, set `PORT` to the internal server port; it takes precedence over the port in `NEXT_PUBLIC_APP_URL`.

## Technology

- `next`, `react`, `typescript`, `tailwindcss`, and shadcn/ui
- `better-auth` for email/password and Google authentication
- `framer-motion`, `lucide-react`, `recharts`, and `date-fns`
- Express API, MongoDB, Stripe Checkout (vendor subscriptions only), and ImgBB uploads

Useful checks:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Authentication and API

Better Auth is served by the Express API; the client uses its email/password, Google OAuth, and session endpoints. The API URL must be included in the server's `CLIENT_URL` allowlist. Protected API calls obtain a short-lived JWT from Better Auth and send it as a Bearer token; session cookies are used only to obtain and refresh that token.

The client uses the API for menu search, category/location filtering, price sorting, pagination, order requests, role dashboards, vendor menu management, account profiles, and Stripe subscription checkout. The client never sets privileged roles, approval state, or subscription status.

## Design system

The interface uses the Pizzora tomato-red and warm-cream palette, reusable shadcn/ui components in `components/ui`, Lucide icons, and Framer Motion. Local pizza imagery is stored in `app/image`; uploaded menu and profile images are hosted through the server-side ImgBB integration.

## Environment

See [.env.example](./.env.example). API/app origins, contact details, and social links are public configuration, not credentials. Never place MongoDB, Better Auth, Google OAuth, Stripe, or ImgBB secrets in a `NEXT_PUBLIC_` variable.

## Deployment

Deploy this client to Vercel and set `NEXT_PUBLIC_API_BASE_URL` to the deployed Express API origin. Configure the API's `CLIENT_URL`, Better Auth URL, and Google OAuth callback consistently. A same-site production domain or reverse proxy is recommended for dependable session cookies across browsers.

The published client URL is https://pizzora-client-ten.vercel.app/. Set `NEXT_PUBLIC_APP_URL` to this URL in the Vercel project settings.

## Submission links

- Live website: https://pizzora-client-ten.vercel.app/
- Client GitHub repository: Not configured in this workspace
- API repository: https://github.com/luminasalex/-Pizzora-backend
