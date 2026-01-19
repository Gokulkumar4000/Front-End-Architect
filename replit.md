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

## Recent Changes
- January 19, 2026: Initial import and Replit environment setup
