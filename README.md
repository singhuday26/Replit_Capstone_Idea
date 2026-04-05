# Replit Capstone Idea Generator

Capstone AI is a full-stack TypeScript starter for generating final-year B.Tech capstone ideas.
Right now, it is a strong UI-first prototype with mock data and a scaffolded backend ready to be implemented.

## 1) Project Snapshot

Current state in plain English:

- Frontend experience is built and polished (landing page, questionnaire, ideas explorer, and plan view).
- Questionnaire data is kept in local component state only.
- Ideas are hardcoded mock data in the frontend.
- Backend server exists but has no API routes yet.
- Storage layer is in-memory only (not connected to Postgres yet).
- Shared schema and Drizzle config are already set up for future database work.

If you created this with a one-line prompt, this is exactly what you would hope for: a strong product shell with clear extension points.

## 2) Tech Stack

### Frontend

- React 19 + TypeScript
- Vite 7
- Wouter for routing
- Tailwind CSS v4
- shadcn/ui + Radix UI primitives
- Framer Motion for animation
- TanStack Query configured (not yet actively used by pages)

### Backend

- Node.js + Express 5
- TypeScript (tsx in dev)
- HTTP server wraps Express

### Data / Validation

- Drizzle ORM + drizzle-kit
- PostgreSQL schema definition in shared layer
- Zod + drizzle-zod

### Build Tooling

- Vite build for client
- esbuild bundle for server (custom script)

## 3) Architecture Overview

This is a monorepo-style single project with three main runtime layers:

- client: React app and UI
- server: Express app and runtime host
- shared: shared schema/types between frontend and backend

### High-level flow

```mermaid
flowchart LR
  A[Home page] --> B[Questionnaire]
  B --> C[Ideas page]
  C --> D[Project plan view]

  B -. local state only .-> E[(Browser memory)]
  C -. uses .-> F[MOCK_IDEAS in ideas.tsx]

  G[Express server] --> H[/api routes placeholder]
  H --> I[MemStorage]
  I --> J[(Future Postgres via Drizzle)]
```

### Runtime responsibilities

- The client handles all visible behavior today.
- The server currently hosts the app and provides infrastructure hooks (logging, JSON parsing, route registration), but does not yet expose real endpoints.
- Shared schema defines the `users` table and types for future backend implementation.

## 4) Key Files You Should Know

### App entry and routing

- `client/src/main.tsx`: mounts React app.
- `client/src/App.tsx`: route map and top-level providers.

Routes today:

- `/` -> home
- `/plan` -> questionnaire
- `/ideas` -> synthesized ideas page

### Product pages

- `client/src/pages/home.tsx`: marketing/hero and CTA.
- `client/src/pages/questionnaire.tsx`: 4-step form wizard.
- `client/src/pages/ideas.tsx`: idea cards + deep detail tabs + generated milestone timeline.
- `client/src/pages/not-found.tsx`: fallback page.

### Frontend infrastructure

- `client/src/lib/queryClient.ts`: fetch helpers + React Query defaults.
- `client/src/index.css`: Tailwind theme tokens, typography, dark visual style.

### Backend infrastructure

- `server/index.ts`: Express app setup, middleware, logging, and prod/dev serving mode.
- `server/routes.ts`: placeholder where API endpoints belong.
- `server/storage.ts`: in-memory `IStorage` implementation.
- `server/static.ts`: serves built client files in production.
- `server/vite.ts`: development-mode Vite middleware integration.

### Shared schema

- `shared/schema.ts`: Drizzle `users` table + Zod insert schema + shared types.

### Build/deployment support

- `script/build.ts`: builds client then bundles server into `dist/index.cjs`.
- `vite.config.ts`: frontend build/dev config + aliases + Replit plugins.
- `vite-plugin-meta-images.ts`: rewrites OG/Twitter image URLs based on Replit domain env vars.
- `drizzle.config.ts`: migration output + DB connection for Drizzle kit.
- `.replit`: Replit run/deploy behavior and workflow config.

## 5) Local Development

## Prerequisites

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

### Start frontend only (works now)

```bash
npm run dev:client
```

Then open `http://localhost:5000`.

### Start full-stack dev server

On macOS/Linux:

```bash
npm run dev
```

On Windows PowerShell (workaround):

```powershell
$env:NODE_ENV="development"
npx tsx server/index.ts
```

Why workaround? The `dev` script currently uses POSIX-style env assignment (`NODE_ENV=development ...`) which does not run directly in Windows shells.

### Production build

```bash
npm run build
```

Start production server:

- macOS/Linux: `npm run start`
- Windows PowerShell:

```powershell
$env:NODE_ENV="production"
node dist/index.cjs
```

## 6) Environment Variables

### Required for current app runtime

- `PORT` (optional): defaults to `5000`.

### Required for database tooling

- `DATABASE_URL`: required when running Drizzle commands such as `npm run db:push`.

### Optional (Replit-specific metadata)

- `REPLIT_INTERNAL_APP_DOMAIN`
- `REPLIT_DEV_DOMAIN`

These are used by `vite-plugin-meta-images.ts` to set social preview image URLs.

## 7) Scripts and What They Do

- `npm run dev:client`: runs Vite client on port 5000.
- `npm run dev`: runs Express server in development mode (cross-platform issue on Windows).
- `npm run check`: TypeScript type-check.
- `npm run build`: builds client and bundles server.
- `npm run start`: starts built server from `dist/index.cjs`.
- `npm run db:push`: pushes schema to database with Drizzle.

## 8) Current Known Gaps and Risks

These are important if you continue development:

1. Type-check currently fails.
   - In `client/src/pages/ideas.tsx`, `CheckCircle2` is used but not imported.

2. Backend is scaffolded, not implemented.
   - `server/routes.ts` does not define any `/api` routes.

3. Data flow is mock-only.
   - Questionnaire answers are not persisted.
   - Ideas are static (`MOCK_IDEAS`) and not generated from user input.

4. Storage is non-persistent.
   - `MemStorage` resets on restart.

5. Windows developer UX issue.
   - `npm run dev` fails due POSIX env variable syntax.

6. Build warning about large client chunk.
   - `ideas` page and assets produce a large JS/CSS footprint.

7. Replit config mismatch to be aware of.
   - `.replit` is configured with `deploymentTarget = "static"` while the project also includes an Express backend path.

8. UI config drift.
   - `components.json` points to `tailwind.config.ts`, but this repo uses Tailwind v4 plugin flow and does not currently include that config file.

## 9) Recommended Development Roadmap

If you want to turn this into a production-ready capstone idea engine, this order will save time:

### Phase 1: Stabilize baseline

1. Fix TypeScript error in `ideas.tsx` (import missing icon).
2. Make scripts cross-platform (use `cross-env` or node-based env handling).
3. Add linting + formatting pipeline and pre-commit checks.

### Phase 2: Connect questionnaire to backend

1. Define API contract for idea generation request/response.
2. Implement first endpoint in `server/routes.ts` (for example `POST /api/ideas/generate`).
3. Move form state submission from local navigation to API mutation.

### Phase 3: Replace mocks with real generation

1. Remove `MOCK_IDEAS` hardcoding.
2. Fetch generated ideas using React Query.
3. Add loading, error, retry, and empty states.

### Phase 4: Persistence and auth

1. Add PostgreSQL-backed storage implementation.
2. Store questionnaire submissions and generated ideas.
3. Add user accounts and saved ideas per user.

### Phase 5: Quality and scale

1. Add unit tests for utility and API logic.
2. Add integration tests for route behavior.
3. Add client tests for multi-step form and idea flows.
4. Introduce code-splitting and asset optimization.

## 10) How to Add Your First Real API Route

Minimal path:

1. Add route in `server/routes.ts` under `/api`.
2. Add request validation with Zod.
3. Return shape expected by `ideas.tsx`.
4. Call route from client with `apiRequest` or React Query mutation.
5. Replace direct `setLocation("/ideas")` in questionnaire with API call + route transition on success.

This lets you preserve the current UI while making data real.

## 11) Notes About Generated UI Components

The project contains a large shadcn/ui component library in `client/src/components/ui`.

- Only a subset is currently used by pages.
- This is normal for generated projects.
- Keep them for velocity, but consider pruning unused components later if bundle size becomes a concern.

## 12) Suggested Next Commit Plan

If you want a clean next iteration, create 3 focused commits:

1. `chore: stabilize dev workflow`
   - fix TS error
   - make scripts cross-platform

2. `feat: add ideas generation API scaffold`
   - route + schema + client mutation

3. `feat: persist questionnaire and ideas`
   - database wiring + storage implementation

## 13) License

MIT (as declared in `package.json`).
