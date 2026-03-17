# DevConnect

## Overview
DevConnect is a web application that connects visionaries, builders, and investors in an all-in-one ecosystem. The platform aims to bridge ideas with code and capital.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with shadcn/ui components

## Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── App.tsx      # Main application
│   │   └── main.tsx     # Entry point
│   └── index.html
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   ├── vite.ts       # Vite dev server setup
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Database schema (Drizzle)
└── migrations/       # Database migrations
```

## Development Commands
- `npm run dev` - Start development server (serves both frontend and backend on port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (automatically provisioned)
- `PORT` - Server port (defaults to 5000)

## Authentication & Data Layer
- **Firebase Auth**: Email/password login and signup via `signInWithEmailAndPassword` / `createUserWithEmailAndPassword`
- **Firestore**: User profiles stored in `/users/{uid}`; posts stored in `/posts` collection
- **Firebase Config**: Stored as `VITE_FIREBASE_*` environment variables

## Key Files
- `client/src/lib/firebase.ts` — Firebase app, Auth, Firestore exports
- `client/src/lib/firestoreService.ts` — `saveUserProfile`, `getUserProfile`, `updateUserProfile`, `getPosts`, `seedMockPostsIfEmpty`
- `client/src/hooks/use-auth.ts` — `useFirebaseAuth()`, `useUser()`, `useLogout()` hooks
- `client/src/pages/Auth.tsx` — Multi-step signup + login with Firebase
- `client/src/pages/Profile.tsx` — Reads/writes user profile from Firestore
- `client/src/pages/Feed.tsx` — Loads posts from Firestore (seeds mock data if empty)

## Notes
- Firestore Database must be enabled in Firebase Console (Build → Firestore Database → Create database → test mode)
- Feed falls back to MOCK_POSTS if Firestore is unreachable

## Recent Changes
- January 19, 2026: Initial import and Replit environment setup
- March 17, 2026: Firebase Auth + Firestore fully integrated; Profile.tsx reads/writes from Firestore; Feed.tsx loads posts from Firestore with mock seed fallback
