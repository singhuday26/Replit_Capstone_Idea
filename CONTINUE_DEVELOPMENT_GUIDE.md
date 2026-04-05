# Continue Development Guide (Step-by-Step)

This file is your practical execution plan for turning the current UI-first prototype into a production-ready full-stack app.

Use this guide in order. Do not skip ahead, because each step removes blockers for the next one.

## Step 0: Create a Safe Working Baseline

Goal: Start clean and avoid losing progress.

Actions:

1. Create a new branch for active development.
2. Run install and baseline checks.
3. Confirm the app starts in client mode.

Commands:

- npm install
- npm run dev:client
- npm run check
- npm run build

Definition of done:

- You can run the app locally.
- You have one branch dedicated to upcoming changes.

Suggested commit message:

- chore: establish local development baseline

## Step 1: Fix Immediate Build and DX Blockers

Goal: Remove issues that slow every future change.

Actions:

1. Fix TypeScript error in ideas page (missing icon import).
2. Make npm scripts cross-platform (Windows + macOS/Linux).
3. Verify check/build/start commands work.

Files to update:

- client/src/pages/ideas.tsx
- package.json

Suggested script approach:

- Use cross-env in scripts for NODE_ENV.
- Add cross-env as a dev dependency if needed.

Commands:

- npm run check
- npm run build

Definition of done:

- Type-check passes.
- Build passes.
- Full-stack dev script works on your machine.

Suggested commit message:

- fix: restore type safety and cross-platform scripts

## Step 2: Lock the API Contract Before Coding Routes

Goal: Prevent frontend/backend mismatch.

Actions:

1. Define a request schema for questionnaire submission.
2. Define a response schema for generated ideas.
3. Keep these schemas in shared so both sides use the same types.

Files to add/update:

- shared/schema.ts or a new shared/ideas.ts

Contract should include at least:

- Questionnaire input fields (branch, skills, interests, constraints, impact, difficulty)
- Idea output fields (title, tagline, tags, scores, architecture, deliverables)

Definition of done:

- One shared source of truth exists for request/response.
- Frontend and backend can import the same types.

Suggested commit message:

- feat: define shared schemas for idea generation API

## Step 3: Implement First Real API Endpoint

Goal: Move from static frontend data to server-driven data.

Actions:

1. Add POST /api/ideas/generate route.
2. Validate input with zod schema.
3. Return response shaped exactly like the shared output schema.
4. Start with deterministic mock generation on the server (not in UI).

Files to update:

- server/routes.ts
- server/index.ts (only if middleware/route wiring needs adjustment)
- shared/schema.ts (if final schema tweaks are needed)

Definition of done:

- Endpoint returns valid JSON for valid input.
- Invalid input returns clear 4xx errors.

Suggested commit message:

- feat: add ideas generation API route with schema validation

## Step 4: Wire Questionnaire to API (Mutation Flow)

Goal: Submit real data instead of only navigating.

Actions:

1. Replace direct navigation in questionnaire submit with API call.
2. Use react-query mutation or existing apiRequest helper.
3. On success, navigate to ideas screen with response data available.
4. On error, show toast and keep user on form.

Files to update:

- client/src/pages/questionnaire.tsx
- client/src/lib/queryClient.ts (if helper updates are needed)
- client/src/hooks/use-toast.ts (only if behavior updates are needed)

Definition of done:

- Clicking Generate sends request to backend.
- Success navigates to ideas with server data.
- Failure shows clear UI error and no crash.

Suggested commit message:

- feat: connect questionnaire submit to backend mutation

## Step 5: Refactor Ideas Page to Use Real Data

Goal: Remove hardcoded content path.

Actions:

1. Remove in-file MOCK_IDEAS dependency.
2. Read generated ideas from route state, query cache, or API fetch.
3. Add loading, empty, and error states.
4. Preserve existing visual design and interactions.

Files to update:

- client/src/pages/ideas.tsx

Definition of done:

- Ideas page works with server-provided data.
- No hard dependency on local mock constants.

Suggested commit message:

- refactor: replace static ideas with API-backed data flow

## Step 6: Add Persistence Layer (Database)

Goal: Keep submissions and generated outputs across restarts.

Actions:

1. Add tables for questionnaire submissions and generated ideas.
2. Add migration and push schema.
3. Introduce db-backed storage implementation.
4. Switch route handlers from MemStorage-only logic to db-backed operations.

Files to update:

- shared/schema.ts
- drizzle.config.ts
- server/storage.ts
- (new) server/db.ts or equivalent

Commands:

- npm run db:push

Definition of done:

- Data persists in Postgres.
- Server restart does not lose generated results.

Suggested commit message:

- feat: persist questionnaire submissions and generated ideas

## Step 7: Add Save, List, and Retrieve Features

Goal: Turn one-time generation into a reusable product flow.

Actions:

1. Add Save Idea endpoint.
2. Add Get Saved Ideas endpoint.
3. Connect Saved button in ideas page to real API data.
4. Add basic filtering/sorting by date or score.

Files to update:

- server/routes.ts
- server/storage.ts
- client/src/pages/ideas.tsx

Definition of done:

- User can save generated ideas.
- User can revisit saved ideas later.

Suggested commit message:

- feat: implement saved ideas workflow

## Step 8: Add Basic Authentication

Goal: Make saved data user-specific.

Actions:

1. Implement signup/login/logout endpoints.
2. Add session handling and protected routes.
3. Scope saved ideas by authenticated user id.

Files to update:

- server/routes.ts
- server/storage.ts
- shared/schema.ts
- client auth-related state/pages

Definition of done:

- Users can sign in.
- User A cannot access User B saved ideas.

Suggested commit message:

- feat: add authentication and user-scoped data

## Step 9: Add Testing Before Feature Expansion

Goal: Prevent regressions while product complexity grows.

Recommended minimum:

1. API route tests (valid input, invalid input, failure path).
2. Frontend tests for questionnaire step flow and submission behavior.
3. Data mapping tests for ideas rendering.

Definition of done:

- Critical flow has automated coverage.
- CI can fail on breaking changes.

Suggested commit message:

- test: add coverage for questionnaire and ideas API flow

## Step 10: Performance and Bundle Optimization

Goal: Keep UI fast as features grow.

Actions:

1. Lazy-load heavy routes/components.
2. Split large bundles where possible.
3. Optimize large static assets (hero and empty images).
4. Re-check build warnings and set budgets.

Files to update:

- client/src/App.tsx
- vite.config.ts
- client/src/assets/\*

Definition of done:

- Reduced initial bundle size.
- Better first load and route transition performance.

Suggested commit message:

- perf: reduce initial bundle and optimize static assets

## Step 11: Deployment Alignment and Environment Hardening

Goal: Ensure runtime behavior matches deployment setup.

Actions:

1. Decide deployment mode: static-only or full Node server.
2. Align .replit deployment settings with that decision.
3. Document required env vars for each environment.
4. Add production error logging strategy.

Files to update:

- .replit
- README.md
- server/index.ts

Definition of done:

- Deployment strategy is explicit and consistent.
- No config mismatch between expected runtime and deployed runtime.

Suggested commit message:

- chore: align deployment configuration with runtime architecture

## Step 12: Optional Product Enhancements (After Core Is Stable)

Only start these after Steps 0-11 are complete:

1. AI provider integration for real idea synthesis.
2. Idea export to PDF/Markdown.
3. Admin analytics for popular domains and outcomes.
4. Collaborative team project planning.

## Recommended Commit Cadence

Keep commits small and reviewable:

1. 1 commit per step when possible.
2. If step is large, split by backend/frontend/schema.
3. Always run check and build before each commit.

Quick pre-commit checklist:

1. npm run check
2. npm run build
3. Manual click-through: Home -> Plan -> Ideas
4. No new console errors in browser or server logs

## What To Start With Right Now

Do these next, in this exact order:

1. Step 1 (fix blockers)
2. Step 2 (shared contract)
3. Step 3 (first API)
4. Step 4 (connect form submit)
5. Step 5 (remove frontend mocks)

After that, you will have a real end-to-end v1 flow.
