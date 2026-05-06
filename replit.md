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
- **Auth & Data**: Firebase Auth + Firestore (primary data store)
- **Build**: tsx, esbuild

## Where things live

- `client/src/` — all frontend code
  - `pages/` — route-level views (Feed, Auth, Dashboard, Profile, etc.)
  - `components/` — UI components (`ui/`, `layout/`, `feed/`, `saved/`)
  - `hooks/` — `use-auth.ts` (Firebase auth), `use-profile.tsx`, `use-user-activity.tsx`
  - `lib/firebase.ts` — Firebase init & re-exports
  - `lib/firestoreService.ts` — all Firestore CRUD (posts, users, likes, saves, follows, comments)
- `server/` — Express server (`index.ts`, `routes.ts`, `vite.ts`, `static.ts`)
- `shared/schema.ts` — Drizzle/Zod schema (PostgreSQL, secondary to Firestore)

## Architecture decisions

- **Firestore is the primary database** — all user profiles, posts (ideas/projects/funds/recruitment), likes, saves, follows, and comments live in Firestore. The PostgreSQL/Drizzle setup is present but secondary.
- **Firebase Auth** — email/password auth via Firebase; credentials flow through `VITE_*` env vars (client-side, safe for Firebase's client SDK model).
- **Full-stack in one server** — Express serves both the API and the Vite dev middleware on port 5000.
- **wouter** over React Router — lightweight client-side routing.
- **Role-based onboarding** — users select Idea Holder / Developer / Investor at signup; profile fields differ per role.

## Product

- Landing page with role-specific pitch and sign-up flow
- Multi-step registration with role-specific profile fields
- Feed with posts across 4 types: ideas, projects, funds, recruitment
- Post detail with likes, comments, replies
- Save posts with personal notes
- User profiles, connections/following, chat
- Dashboard, analytics, and role-specific management pages (my-ideas, my-projects, my-fundraising, my-investments, portfolio, applied-jobs)
- Settings page

## User preferences

_Populate as you build_

## Gotchas

- Firebase `VITE_*` env vars are exposed to the client — this is intentional for Firebase's client SDK pattern, not a leak.
- Firestore requires composite indexes for queries with `where` + `orderBy`; missing indexes surface as Firestore console errors.
- The `tsx` binary is in `node_modules/.bin/tsx`; the dev script uses it via npm scripts.

## Pointers

- Firebase console: https://console.firebase.google.com/project/devconnect-9c912
- Firestore data model: see `client/src/lib/firestoreService.ts`
- Drizzle schema: `shared/schema.ts`
