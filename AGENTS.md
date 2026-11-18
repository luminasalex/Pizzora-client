<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Copilot instructions

## Project shape

- This repository is a Next.js App Router application using TypeScript and React. Routes live under `app/`; `app/layout.tsx` wraps pages with the shared `Navber` and `Footer`, and imports the global stylesheet.
- Authentication is handled by Better Auth: `app/api/auth/[...all]/route.ts` exposes its Next.js handlers, `lib/auth.ts` configures the server-side auth and MongoDB adapter, and `lib/auth-client.ts` contains the browser client.
- Shared UI primitives are local shadcn components in `components/ui/`, configured by `components.json` to use the `base-nova` style and Base UI. `components/` also holds app-level shared components; reusable hooks are in `hooks/`.
- Styling uses Tailwind CSS v4 through imports in `app/globals.css`; shadcn's CSS is imported there as well. The `@/*` TypeScript alias maps to the repository root.

## Commands

Run these from the `client/` repository root:

| Purpose | Command |
| --- | --- |
| Development server | `npm run dev` |
| Production build | `npm run build` |
| Serve production build | `npm run start` |
| Lint | `npm run lint` |
| Type-check | `npm run typecheck` |
| Format TypeScript files | `npm run format` |

There is currently no test script, test framework configuration, or test suite in the repository, so there is no single-test command to run. Do not assume a test runner; if one is introduced, document its actual file-targeted command here.

## ⚠️ Environment & Auth

- `.env` contains `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and (optionally) `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`. These are **not** committed — `.gitignore` covers `*.env*` — so you must create your own `.env` file matching the template in `.env`.
- `lib/auth.ts` hardcodes `mongodb://localhost:27017/database` — a local MongoDB instance must be running for development. Do not remove or alter the default connection string without ensuring MongoDB is available.
- `lib/auth-client.ts` creates a `createAuthClient()` instance using `process.env.BETTER_AUTH_URL`. The `authClient` export is used for browser-side sign-in/sign-up flows.
- The auth route is at `app/api/auth/[...all]/route.ts` — this is the catch-all handler that Better Auth expects.

## UI primitives & Form components

- shadcn UI components live in `components/ui/` and use the `base-nova` style. Before adding a new component, inspect the directory and extend an existing primitive rather than creating a copy.
- Form pages under `app/src/(Auth)/` must use `"use client"` (they have event handlers). Available components: `Input`, `Button`, `Label`, `Card`, `Select`, `SelectItem`, `Checkbox`.
- Toggle between Sign In and Sign Up via anchor links (e.g. `/src/Sign-up` from the Sign In page, and vice versa).

## TypeScript & Lint

- `npm run typecheck` runs `tsc --noEmit`. Errors include `react-hooks/set-state-in-effect` in some UI components (`components/ui/carousel.tsx`, `hooks/use-mobile.ts`) — be aware of these when adding new effects.
- `npm run lint` runs ESLint with `eslint-config-next`. It enforces no-semicolons, double quotes, two-space indentation, and Tailwind class sorting via the configured Prettier plugin.
- `npm run format` runs Prettier across `**/*.{ts,tsx}` with the project's `.prettierrc` settings (no semicolons, double quotes, 2-space indent, `prettier-plugin-tailwindcss`).

## App Router structure

- `app/layout.tsx` imports `Geist`/`Geist_Mono` fonts, global CSS, Navber, and Footer. It is the root layout wrapping all pages.
- Pages in `app/` are Server Components by default; add `"use client"` only when needed.
- Route group `(Auth)` under `app/src/` creates URLs like `/src/Sign-in` and `/src/Sign-up` — the group does not appear in the URL path but the `src` prefix does.
- `app/page.tsx` is the home page; it imports `HomePage` from `components/home/home-page` and handles optional `searchParams` for category/q.

## Authentication flow (high-level)

1. Server: `lib/auth.ts` configures Better Auth with email/password, Google provider, and MongoDB adapter.
2. Client: `lib/auth-client.ts` creates `authClient` via `createAuthClient({ baseURL })`.
3. Forms submit to the catch-all `app/api/auth/[...all]/route.ts` handler.
4. After sign-in, users are redirected to `BETTER_AUTH_URL` (default `http://localhost:3000`).

## Known quirks

- `components/ui/carousel.tsx` and `hooks/use-mobile.ts` have ESLint warnings for calling `setState` synchronously within an effect — avoid this pattern or wrap updates in callbacks.
- The `@/*` TSPath alias in `tsconfig.json` maps to `./*` (repository root), so `@/components/ui/button` resolves correctly.
- No test script exists in `package.json`. If adding tests, wire them into a custom npm script or run `npx` directly.
