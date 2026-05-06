# DevConnect

A startup networking platform where idea holders, developers, and investors connect — users post ideas, projects, funding opportunities, and job listings, then collaborate within a unified feed.

## Run & Operate

- **Dev**: `npm run dev` (starts Express + Vite on port 5000)
- **Build**: `npm run build`
- **Production**: `npm start`
- **DB push**: `npm run db:push`
- **Required env vars**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`, `DATABASE_URL`

## Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, Shadcn UI (Radix), Framer Motion, wouter (routing), TanStack Query
- **Backend**: Express 5, Node 20, Drizzle ORM + PostgreSQL (Replit DB)
- **Auth**: Firebase Auth only (email/password login — no Firestore reads/writes)
- **Build**: tsx, esbuild

## Where things live

- `client/src/` — all frontend code
  - `pages/` — route-level views (Feed, Auth, Dashboard, Profile, etc.)
  - `components/` — UI components (`ui/`, `layout/`, `feed/`, `saved/`)
  - `hooks/` — `use-auth.ts` (Firebase auth), `use-profile.tsx`, `use-user-activity.tsx`
  - `lib/firebase.ts` — Firebase init (Auth only)
  - `lib/firestoreService.ts` — API service layer (all calls go to `/api/*` endpoints)
- `server/routes.ts` — all REST API routes (posts, profiles, likes, saves, follows, comments)
- `server/storage.ts` — Drizzle ORM data access layer
- `shared/schema.ts` — PostgreSQL schema (profiles, posts, likes, saves, follows, comments)

## Architecture decisions

- **PostgreSQL is the primary database** — migrated from Firestore due to security rule restrictions. All posts, user profiles, likes, saves, follows, and comments live in PostgreSQL via the Express API.
- **Firebase Auth only** — Firebase is used exclusively for email/password authentication. All data operations go through the Express API.
- **8 mock posts seeded automatically** — on server startup, if the posts table is empty, 8 sample posts (across all 4 types) are seeded automatically.
- **Full-stack in one server** — Express serves both the API (`/api/*`) and the Vite dev middleware on port 5000.
- **Role-based onboarding** — users select Idea Holder / Developer / Investor at signup; profile fields differ per role.

## Product

- Landing page with role-specific pitch and sign-up flow
- Multi-step registration with role-specific profile fields
- Feed with posts across 4 types: ideas, projects, funds, recruitment (with 8 mock posts always shown)
- Post detail with likes, comments, replies
- Save posts with personal notes
- User profiles, connections/following, chat
- Dashboard, analytics, and role-specific management pages (my-ideas, my-projects, my-fundraising, my-investments, portfolio, applied-jobs)
- Settings page

## User preferences

_Populate as you build_

## Gotchas

- Firebase `VITE_*` env vars are exposed to the client — this is intentional for Firebase's client SDK pattern, not a leak.
- Firestore security rules block all reads/writes — this is why all data was moved to PostgreSQL.
- `firestoreService.ts` is now a misnomer — it's actually the API service layer making fetch() calls, kept to avoid renaming all imports.
- The `tsx` binary is in `node_modules/.bin/tsx`; the dev script uses it via npm scripts.

## Pointers

- Firebase console: https://console.firebase.google.com/project/devconnect-9c912
- API routes: `server/routes.ts`
- Data schema: `shared/schema.ts`
- Drizzle ORM layer: `server/storage.ts`
