# OWES Frontend SPEC

Agent-facing specification for the **OWES - Overwatch Esport Scouting** frontend. All links are relative to the repository root.

## 0. API availability (read first)

- API endpoints are documented in Swagger UI: [http://localhost:5032/swagger](http://localhost:5032/swagger) (JSON: `http://localhost:5032/swagger/v1/swagger.json`).
- The Swagger URL above is **only for retrieving API documentation**. It is not the app's `API_URL`.
- If a task needs the API and it is **not available**, **immediately reply** that the API needs to be made available before continuing. Do not guess endpoint shapes or silently mock data.
- API and type definitions live in [lib/API.ts](./lib/API.ts) (fetch functions) and [lib/types.ts](./lib/types.ts) (types). Read these first.
- **Swagger response schemas are incomplete/inaccurate** (e.g. its `Player` has `player_role: int` while real responses return a nested `role` object). Use Swagger for routes, request bodies and enums; verify response shapes against the real response and [lib/types.ts](./lib/types.ts).

### Known endpoints (from Swagger)

| Method | Route |
|---|---|
| GET | `/heroes`, `/heroes/{heroID}` |
| GET, POST | `/players` |
| GET, PUT, DELETE | `/players/{playerID}` |
| GET, POST | `/teams` |
| GET, PUT, DELETE | `/teams/{teamID}` |

Only `/heroes`, `/players` and `/players/{id}` are used by the frontend so far.

Enums: `Regions` = `na | emea | japan | korea | pacific`; `Ratings` = `s | a | b | c | d | e | f` (lowercase on the wire).

## 1. Project overview

- Next.js App Router scouting dashboard reading from an external REST API. No backend code in this repo.
- Pages: Home (placeholder), Players list, Player detail, Heroes grid with tier-list dialog, Teams (placeholder).

## 2. Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 ([package.json](./package.json)) |
| Language | TypeScript 5, `strict: true` ([tsconfig.json](./tsconfig.json)) |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css` |
| UI primitives | shadcn-style components in [components/ui/](./components/ui) on `radix-ui` |
| Icons | `lucide-react` |
| Theming | `next-themes` (class-based, default `system`) |
| Linting | ESLint 9 + `eslint-config-next` ([eslint.config.mjs](./eslint.config.mjs)) |

## 3. Commands

- `npm run dev` - dev server (port 3000)
- `npm run build` - production build (also type-checks)
- `npm run start` - serve the production build
- `npm run lint` - ESLint

Validation after changes: `npm run lint` and `npx tsc --noEmit` (and `npm run build` for larger changes). Both lint and tsc currently pass cleanly; keep it that way.

**No tests**: the owner does not want tests in the frontend. Do not add a test framework.

## 4. Repository map

| Path | Purpose |
|---|---|
| [app/](./app) | Routes, root layout, global CSS |
| [app/layout.tsx](./app/layout.tsx) | Root layout: providers, `TooltipProvider`, `SidebarProvider`, `AppSidebar`, metadata |
| [app/providers.ts](./app/providers.ts) | Client `Providers` wrapper (`ThemeProvider`) |
| [app/globals.css](./app/globals.css) | Tailwind import, shadcn theme variables, `--ow-*` brand tokens |
| [components/](./components) | Feature components grouped by domain (`heroes/`, `players/`) |
| [components/Sidebar.tsx](./components/Sidebar.tsx) | Navigation sidebar; collapse state in `localStorage` key `owes-sidebar-state` |
| [components/ui/](./components/ui) | Generic shadcn/Radix primitives |
| [lib/API.ts](./lib/API.ts) | **All backend fetch functions** |
| [lib/types.ts](./lib/types.ts) | **All API/domain types** |
| [lib/utils.ts](./lib/utils.ts) | `cn()` (`clsx` + `tailwind-merge`) |
| [hooks/](./hooks) | Shared hooks (`use-mobile.ts`) |
| [public/](./public) | Static assets: logos, role icons |
| [next.config.ts](./next.config.ts) | Allowed remote image hosts |
| [components.json](./components.json) | shadcn config (style `radix-nova`, aliases) |

Where to put things:
- New API call -> `lib/API.ts` (check Swagger for the route)
- New/changed data shape -> `lib/types.ts`
- New page -> `app/<route>/page.tsx`; add a nav entry in `components/Sidebar.tsx`
- New feature component -> `components/<domain>/`
- New generic UI primitive -> `components/ui/`
- New color token -> `app/globals.css`

## 5. Coding conventions

### 5.1 Imports
- Use the `@/` alias (repo root), e.g. `@/lib/types`, `@/components/ui/select`. Relative imports (`./PlayerCard`) are fine for siblings in the same feature folder.

### 5.2 Components
- Named exports for components; default exports only for Next.js pages/layouts.
- Feature components: PascalCase files (`HeroCard.tsx`). `components/ui/` and `hooks/`: kebab-case.
- Props typed with a local `type XProps = {...}` above the component.
- Add `"use client"` only to components that use hooks/`use()`/browser APIs.

### 5.3 Data fetching: promise-passing pattern
1. A server page calls a `lib/API.ts` function **without awaiting** (e.g. [app/heroes/page.tsx](./app/heroes/page.tsx)).
2. The promise is passed as a prop (`heroes: Promise<Hero[]>`) to a `"use client"` component.
3. The client component unwraps it with `use()` (e.g. [components/heroes/HeroesGrid.tsx](./components/heroes/HeroesGrid.tsx)).
4. The page wraps it in `<Suspense fallback={<XLoading />}>`.

Do not `await` in the page for this pattern, or the Suspense fallback never shows. Exception: [app/players/[playerId]/page.tsx](./app/players/[playerId]/page.tsx) is `async` only to read `params` (a `Promise` in Next 16), then passes the data promise on (no `Suspense` there currently).

### 5.4 API layer ([lib/API.ts](./lib/API.ts))
- Base URL from `process.env.API_URL`.
- All calls go through the internal `fetchJson<T>()` helper, which throws on non-2xx responses. New functions should use it.
- Caching: lists use `cache: "force-cache"` with `next: { revalidate: 1200, tags: [...] }`; single-item fetches use `cache: "no-store"`.
- There is no `error.tsx` yet, so a thrown API error shows Next's default error UI.

### 5.5 Types ([lib/types.ts](./lib/types.ts))
- Use `type` (not `interface`). Nullable fields are `T | null`.
- Dates arrive as strings (e.g. `birthday: "2025-06-19"`); type them `string`, not `Date`.
- Nested objects in responses are often **partial** (e.g. a player nested in `hero.ratings[]` has `current_team` as a team id, and a hero nested in `player.ratings[]` has `hero_role` instead of `role`). The types describe the top-level shape; do not rely on nested fields without checking the real response.

### 5.6 Styling
- Tailwind utility classes in JSX. Use the `ow-*` tokens from [app/globals.css](./app/globals.css) (`text-ow-text`, `bg-ow-bg-deep`, `border-ow-border/70`, ...) instead of hard-coded hex.
- Merge conditional classes with `cn()`.
- Reuse `components/ui/*` before creating new primitives.

### 5.7 Images
- Use `next/image`. Remote hosts must be in `images.remotePatterns` in [next.config.ts](./next.config.ts) (currently `static.wikia.nocookie.net`, `d15f34w2p8l1cc.cloudfront.net`, `cdn.discordapp.com`, all https).
- Fallback image: `/transparent_logo.png`. Role icons are served from `public/` (e.g. `/Tank_icon.svg`).

### 5.8 Comments
- Only comment code that needs clarification.

### 5.9 Loading states
- `components/<domain>/loading.tsx` exports plain components (`HeroesLoading`, `PlayersLoading`) used as `Suspense` fallbacks (not Next route `loading.tsx` files).

## 6. Environment

- `API_URL` is read from `.env.local` (gitignored). The app calls the API over **https** at `https://localhost:7080`; `NODE_TLS_REJECT_UNAUTHORIZED=0` is used in development for the self-signed certificate.
- [.env](./.env) is a committed template and must keep `API_URL=https://localhost:7080`. Do **not** change it to http. Do not put real values or secrets in it.
- Never commit `.env.local` or secrets.
- Env files are owner-managed. Do not edit them unless asked.

## 7. Routes

| Route | File | Data | Status |
|---|---|---|---|
| `/` | [app/page.tsx](./app/page.tsx) | none | Placeholder (intentionally unfinished) |
| `/players` | [app/players/page.tsx](./app/players/page.tsx) | `getPlayers()` | Search + region/role/team filters |
| `/players/[playerId]` | [app/players/[playerId]/page.tsx](./app/players/[playerId]/page.tsx) | `getPlayerById()` | Profile, team, ratings by hero |
| `/heroes` | [app/heroes/page.tsx](./app/heroes/page.tsx) | `getHeroes()` | Grid by role, tier-list dialog |
| `/teams` | [app/teams/page.tsx](./app/teams/page.tsx) | none | Placeholder (intentionally unfinished; `/teams` API exists) |

## 8. Domain notes

- **Roles**: `Tank`, `Damage`, `Support`. [components/heroes/HeroesGrid.tsx](./components/heroes/HeroesGrid.tsx) filters on these exact `role_name` strings.
- **Ratings**: letter grades S-F, lowercase from the API; UI compares with `toUpperCase()`. The tier list dialog ([components/heroes/HeroTierListDialog.tsx](./components/heroes/HeroTierListDialog.tsx)) shows S, A, B, C, D, F (no E row); [components/players/SinglePlayerPage.tsx](./components/players/SinglePlayerPage.tsx) knows S-F.
- Players have an optional `current_team`.
- A nonexistent player id (e.g. `/players/1` when absent) makes the backend return a 500; the frontend now throws on this.

## 9. Open questions for the owner

1. **Font**: `app/layout.tsx` uses `Inter`; confirm it is final.
2. **Tier list has no `E` row** while ratings allow `e`; confirm whether `E` ratings should be shown.
3. **Error UI**: add `app/error.tsx` / not-found handling for failed or missing API data?
4. **Layout metadata description** is still "Generated by create next app".
