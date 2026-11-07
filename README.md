# OWES - Overwatch Esport Scouting (Frontend)

Next.js frontend for scouting Overwatch esport players. It lists players and heroes, shows per-player hero ratings, and a per-hero player tier list. All data comes from the OWES backend API.

See [SPEC.md](./SPEC.md) for conventions and a map of the codebase (also intended for AI agents).

## Requirements

- Node.js 20+
- The OWES backend API running locally (Swagger UI at [http://localhost:5032/swagger](http://localhost:5032/swagger))

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (see `.env` for the template):

   ```bash
   API_URL=https://localhost:7080
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

   `NODE_TLS_REJECT_UNAUTHORIZED=0` accepts the self-signed development certificate. Use it for local development only.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server                 |
| `npm run build` | Create a production build (also type-checks) |
| `npm run start` | Serve the production build                   |
| `npm run lint`  | Run ESLint                                   |

## Tech stack

Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix), lucide-react, next-themes.

## Project structure

| Path           | Contents                                                        |
| -------------- | --------------------------------------------------------------- |
| `app/`         | Routes, root layout, global styles and theme tokens             |
| `components/`  | Feature components (`heroes/`, `players/`) and `ui/` primitives |
| `lib/API.ts`   | Backend fetch functions                                         |
| `lib/types.ts` | API/domain types                                                |
| `hooks/`       | Shared React hooks                                              |
| `public/`      | Static assets                                                   |
