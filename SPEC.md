# OWES Frontend SPEC

Agent-facing specification for the **OWES - Overwatch Esport Scouting** frontend. All links are relative to the repository root.

## Keeping this SPEC up to date (always)

- If a change affects anything described in this file (structure, conventions, routes, API usage, types, env, domain rules), update this file in the same change.
- When the owner states a new requirement, rule or preference, add it to the relevant section of this file, even if no code changes are needed.
- Keep entries short and use links relative to the repository root.

## 0. API availability (read first)

- API endpoints are documented in Swagger UI: [http://localhost:5032/swagger](http://localhost:5032/swagger) (JSON: `http://localhost:5032/swagger/v1/swagger.json`).
- The Swagger URL above is **only for retrieving API documentation**. It is not the app's `API_URL`.
- If a task needs the API and it is **not available**, **immediately reply** that the API needs to be made available before continuing. Do not guess endpoint shapes or silently mock data.
- API and type definitions live in [lib/API.ts](./lib/API.ts) (fetch functions) and [lib/types.ts](./lib/types.ts) (types). Read these first.
- **Swagger response schemas are incomplete/inaccurate** (e.g. its `Player` has `player_role: int` while real responses return a nested `role` object). Use Swagger for routes, request bodies and enums; verify response shapes against the real response and [lib/types.ts](./lib/types.ts).

Always check Swagger yourself for the current routes; this file does not list them.

Enums: `Regions` = `na | emea | japan | korea | pacific`; `Ratings` = `s | a | b | c | d | e | f` (lowercase on the wire).

## 1. Project overview

- Next.js App Router app where individuals rate Overwatch esport players on heroes while watching Overwatch esports. Ratings are purely subjective (what the user feels, not derived from stats); the goal is to encourage paying extra attention while watching. A player always has one role but can be rated on heroes from any role.
- Reads from an external REST API. No backend code in this repo.
- Pages: Home (placeholder), Players list, Player detail, Heroes grid with tier-list dialog, Teams list, Team detail.

## 2. Tech stack

| Area          | Technology                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19 ([package.json](./package.json))         |
| Language      | TypeScript 5, `strict: true` ([tsconfig.json](./tsconfig.json))            |
| Styling       | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css`                  |
| UI primitives | shadcn-style components in [components/ui/](./components/ui) on `radix-ui` |
| Icons         | `lucide-react`                                                             |
| Theming       | `next-themes` (class-based, default `system`)                              |
| Linting       | ESLint 9 + `eslint-config-next` ([eslint.config.mjs](./eslint.config.mjs)) |

## 3. Commands

- `npm run dev` - dev server (port 3000)
- `npm run build` - production build (also type-checks)
- `npm run start` - serve the production build
- `npm run lint` - ESLint

Validation after changes: `npm run lint` and `npx tsc --noEmit` (and `npm run build` for larger changes). Both lint and tsc currently pass cleanly; keep it that way.

**No tests**: the owner does not want tests in the frontend. Do not add a test framework.

## 4. Repository map

| Path                                               | Purpose                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [app/](./app)                                      | Routes, root layout, global CSS                                                                        |
| [app/layout.tsx](./app/layout.tsx)                 | Root layout: providers, `TooltipProvider`, `SidebarProvider`, `AppSidebar`, metadata                   |
| [app/providers.ts](./app/providers.ts)             | Client `Providers` wrapper (`ThemeProvider`)                                                           |
| [app/globals.css](./app/globals.css)               | Tailwind import, shadcn theme variables, `--ow-*` brand tokens                                         |
| [components/](./components)                        | Feature components grouped by domain (`heroes/`, `players/`, `teams/`), plus shared `ErrorMessage.tsx` |
| [components/Sidebar.tsx](./components/Sidebar.tsx) | Navigation sidebar; collapse state in `localStorage` key `owes-sidebar-state`                          |
| [components/ui/](./components/ui)                  | Generic shadcn/Radix primitives                                                                        |
| [lib/API.ts](./lib/API.ts)                         | **All backend fetch functions**                                                                        |
| [lib/types.ts](./lib/types.ts)                     | **All API/domain types**                                                                               |
| [lib/utils.ts](./lib/utils.ts)                     | `cn()` (`clsx` + `tailwind-merge`)                                                                     |
| [lib/ratings.ts](./lib/ratings.ts)                 | Rating tiers S-F: order and colors, shared by the hero tier list and player ratings                    |
| [hooks/](./hooks)                                  | Shared hooks (`use-mobile.ts`)                                                                         |
| [public/](./public)                                | Static assets: logos, role icons                                                                       |
| [next.config.ts](./next.config.ts)                 | Allowed remote image hosts                                                                             |
| [components.json](./components.json)               | shadcn config (style `radix-nova`, aliases)                                                            |

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
- Everything in [components/ui/](./components/ui) is a shadcn component added via the shadcn CLI (see [components.json](./components.json)). Do not hand-write new primitives in that style. Add new ones with the shadcn CLI, then adapt only if needed.

### 5.3 Data fetching: promise-passing pattern

1. A server page calls a `lib/API.ts` function **without awaiting** (e.g. [app/heroes/page.tsx](./app/heroes/page.tsx)).
2. The promise is passed as a prop (`heroes: Promise<Hero[]>`) to a `"use client"` component.
3. The client component unwraps it with `use()` (e.g. [components/heroes/HeroesGrid.tsx](./components/heroes/HeroesGrid.tsx)).
4. The page wraps it in `<Suspense fallback={<XLoading />}>`.

Do not `await` in the page for this pattern, or the Suspense fallback never shows. Exception: [app/players/[playerId]/page.tsx](./app/players/[playerId]/page.tsx) is `async` only to read `params` (a `Promise` in Next 16), then passes the data promise on (no `Suspense` there currently).

### 5.4 API layer ([lib/API.ts](./lib/API.ts))

- Base URL from `process.env.API_URL`.
- All calls go through the internal `fetchJson<T>()` helper. **API functions never throw.** They return `ApiResult<T>` (`{ ok: true, data } | { ok: false, error }`, defined in [lib/types.ts](./lib/types.ts)), where `error` is a user-facing message describing what went wrong (API unreachable, not found, server error, unreadable response). New functions must follow this.
- Consumers check `result.ok` and render `<ErrorMessage>` ([components/ErrorMessage.tsx](./components/ErrorMessage.tsx)) with `result.error` when it is false. Never let an API failure crash the page.
- **Caching rule:** every GET uses `cache: "force-cache"` with `next: { revalidate: 1200, tags: [...] }`. Do not use `cache: "no-store"`.
  - Tags identify the resource (`heroes`, `players`, and per-item tags such as `player-<id>` when a single item is fetched).
- **Mutation rule:** every create, update or delete must invalidate **all** cache tags that the affected data could appear under (e.g. updating a player invalidates `players` and `player-<id>`, and `heroes` too if the change touches hero ratings). Invalidation must **immediately trigger a refetch** (use `updateTag`/`revalidateTag` or the equivalent Next 16 API that refreshes right away, not a lazy revalidate on the next visit).
- Mutations are not implemented yet; follow these rules when adding them.
- `getPlayerById` follows the caching rule (tag `player-<id>`). A mutation of a player must also invalidate `players` and `player-<id>`.
- [app/error.tsx](./app/error.tsx) is the global fallback for unexpected render errors (with a "Try again" button).

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
- Fallback image: `/transparent_logo.png`, drawn with `object-contain` over the gradient background, for players and teams without an image. Role icons are served from `public/` (e.g. `/Tank_icon.svg`).

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

| Route                 | File                                                                 | Data              | Status                                                      |
| --------------------- | -------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------- |
| `/`                   | [app/page.tsx](./app/page.tsx)                                       | none              | Placeholder (intentionally unfinished)                      |
| `/players`            | [app/players/page.tsx](./app/players/page.tsx)                       | `getPlayers()`    | Search + region/role/team filters                           |
| `/players/[playerId]` | [app/players/[playerId]/page.tsx](./app/players/[playerId]/page.tsx) | `getPlayerById()` | Profile, team, ratings by hero                              |
| `/heroes`             | [app/heroes/page.tsx](./app/heroes/page.tsx)                         | `getHeroes()`     | Grid by role, tier-list dialog                              |
| `/teams`              | [app/teams/page.tsx](./app/teams/page.tsx)                           | `getTeams()`      | Search + region filter, cards link to team detail           |
| `/teams/[teamId]`     | [app/teams/[teamId]/page.tsx](./app/teams/[teamId]/page.tsx)         | `getTeamById()`   | Team info + roster table; each row links to the player page |

## 8. Domain notes

- **Roles**: `Tank`, `Damage`, `Support`. [components/heroes/HeroesGrid.tsx](./components/heroes/HeroesGrid.tsx) filters on these exact `role_name` strings.
- **Ratings**: letter grades S, A, B, C, D, E, F, lowercase from the API; UI compares with `toUpperCase()`. The tier list dialog ([components/heroes/HeroTierListDialog.tsx](./components/heroes/HeroTierListDialog.tsx)) has a row for every grade, including E; [components/players/SinglePlayerPage.tsx](./components/players/SinglePlayerPage.tsx) knows S-F.
- Players have an optional `current_team`. Teams from `/teams` and `/teams/{id}` include a `players` array (nested players have no `current_team`).
- The API omits null fields from JSON (e.g. `team_image`, `player_image`), so treat them as possibly `undefined` too: use `??` fallbacks rather than `!== null` checks.
- A nonexistent player id makes the backend return a 500; the frontend shows this as a readable error message (see 5.4). Do not assume specific ids exist (the lowest current player id is 3).
- The frontend dev server runs on `http://localhost:3000`.

## 9. Open questions for the owner

None at the moment. The font (`Inter`, any normal font is fine) and the layout metadata description are settled.
