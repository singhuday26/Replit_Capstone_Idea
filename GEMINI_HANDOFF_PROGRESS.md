# Gemini Handoff: Capstone AI Progress and Deep-Research Context

## 1) Purpose of this document

This file is a complete technical handoff for continuing planning and deep research in a separate Gemini chat session.

It contains:

1. Product vision and current direction.
2. Implementation progress completed so far.
3. Exact architecture and code-level changes already done.
4. Validation results and known limitations.
5. Step-by-step remaining execution path.
6. A deep-research brief you can directly paste into Gemini.

---

## 2) Product vision (current direction)

The project goal has evolved from a static UI prototype into a research-driven idea generation platform.

Core concept now:

1. Build an "idea generation engine" as the primary differentiator.
2. Prioritize semantic analysis over keyword matching.
3. Ground generated ideas in credible and recent research sources.
4. Eventually move from deterministic server-side mock ideas to a retrieval + synthesis engine.

Strategic constraints chosen in discussion:

1. Target quality: balanced quality and speed.
2. Initial timeline: 2-3 weeks for first meaningful engine flow.
3. Budget: under $100/month initially.
4. Hosting: hybrid (local dev, cloud prod).
5. Model preference: open-source/local models first.

---

## 3) Repository and stack snapshot

Project type:

1. Full-stack TypeScript monorepo style app.
2. Frontend in React/Vite.
3. Backend in Express.
4. Shared types/contracts in shared layer.

Primary stack:

1. React 19 + TypeScript.
2. Vite 7.
3. Wouter routing.
4. TanStack Query.
5. Express 5.
6. Zod + drizzle-zod.
7. Drizzle ORM (future persistence work still pending).

---

## 4) What has been implemented so far (actual code progress)

Implementation was started from the step guide and progressed through Step 5.

### 4.1 Step 0 baseline setup

Completed:

1. Dedicated implementation branch was created during implementation work.
2. Dependencies installed and baseline checks executed.

Result:

1. Baseline was successfully stabilized before core feature work.

### 4.2 Step 1 (DX + immediate blockers)

Completed:

1. Cross-platform script support added using cross-env.
2. Type/build blockers in current flow addressed.
3. Full-stack dev startup fixed for Windows socket behavior.

Files changed:

1. package.json
2. package-lock.json
3. server/index.ts

Key script upgrades:

1. dev script now uses cross-env NODE_ENV=development.
2. start script now uses cross-env NODE_ENV=production.

Windows runtime fix:

1. listenOptions.reusePort is now conditionally set only for non-win32 platforms.
2. This avoids ENOTSUP on Windows.

### 4.3 Step 2 (API contract in shared layer)

Completed:

1. Shared request/response schemas for idea generation added.
2. Shared types exported for frontend/backend consistency.

File added:

1. shared/idea-contract.ts

Contracts include:

1. Questionnaire input schema.
2. Generated idea schema.
3. Generate ideas request/response schema.
4. Strong TS types inferred from Zod.

### 4.4 Step 3 (first real API endpoint)

Completed:

1. POST /api/ideas/generate route added.
2. Request validation added via Zod schema.
3. Response validation added via Zod schema.
4. Deterministic server-side idea generation implemented.

Files changed:

1. server/routes.ts
2. server/idea-engine/mock-generator.ts

Behavior summary:

1. API validates questionnaire payload.
2. Engine computes ranked ideas from templates using token relevance + constraints.
3. API returns schema-validated response.
4. Invalid request returns 400 with detailed issue payload.
5. Invalid generated output returns 500 safeguard.

### 4.5 Step 4 (questionnaire submission to API)

Completed:

1. Questionnaire final step no longer navigates blindly.
2. Mutation call to backend route implemented.
3. Success writes generated ideas to query cache.
4. Error path shows destructive toast.
5. Loading state added to submit button.

File changed:

1. client/src/pages/questionnaire.tsx

Behavior summary:

1. Generate Ideas now calls /api/ideas/generate.
2. On success user navigates to /ideas with data available.
3. On failure user remains on form with visible feedback.

### 4.6 Step 5 (ideas page switched to API-backed data)

Completed:

1. In-file hardcoded MOCK_IDEAS removed from active data path.
2. Ideas are now sourced from TanStack query cache key generatedIdeas.
3. Loading state UI added.
4. Error and empty-state UI added.
5. Selection handling adapted to dynamic data.

File changed:

1. client/src/pages/ideas.tsx

Behavior summary:

1. If data exists in cache, ideas render dynamically.
2. If no cache data, user gets guided fallback to questionnaire.

---

## 5) Email notification setup progress

Your requirement included setting up decision-notification email workflow before continuing implementation.

### 5.1 What was implemented

New files:

1. server/notifications/mailer.ts
2. script/mail-test.ts
3. script/send-decision-mail.ts
4. .env.example

New scripts in package.json:

1. mail:test
2. mail:decision

Mailer design:

1. Supports smtp mode for real mail delivery.
2. Supports ethereal mode fallback for testing.
3. Supports stream mode fallback for local non-network test flow.
4. forceSmtp option blocks fake sends for decision mails.

### 5.2 Test outcomes

Mail test command outcome:

1. npm run mail:test succeeded in ethereal mode.
2. Preview URL was generated, confirming pipeline path works.

Decision mail command outcome:

1. npm run mail:decision intentionally failed without SMTP env vars.
2. This is expected behavior because forceSmtp was explicitly enforced.

Conclusion:

1. Mail pipeline is implemented and testable.
2. Real delivery requires SMTP credentials to be configured.

---

## 6) Validation evidence (post-implementation)

Commands run and status:

1. npm run check: passes after fixes.
2. npm run build: passes.
3. npm run dev: starts successfully after Windows listen patch.
4. npm run dev:client: starts successfully.
5. npm run mail:test: passes in test mode.

Known non-blocking warning:

1. Vite build warns chunk size >500k for current client bundle.
2. This is scheduled for Step 10 optimization.

---

## 7) Files changed or added in this progress wave

High-value modifications:

1. package.json
2. package-lock.json
3. server/index.ts
4. server/routes.ts
5. client/src/pages/questionnaire.tsx
6. client/src/pages/ideas.tsx

New files:

1. shared/idea-contract.ts
2. server/idea-engine/mock-generator.ts
3. server/notifications/mailer.ts
4. script/mail-test.ts
5. script/send-decision-mail.ts
6. .env.example
7. CONTINUE_DEVELOPMENT_GUIDE.md

Documentation updates present in repository:

1. README.md (large architecture/development guide update exists in working tree)

---

## 8) Current architecture state after these changes

Current flow:

1. Home -> Questionnaire -> Generate mutation -> Backend route -> Deterministic idea engine -> Query cache -> Ideas page render.

What is now real:

1. Contract-validated API boundary exists.
2. Client-server data flow exists.
3. Idea rendering is dynamic from returned payload.

What is still prototype-level:

1. Idea generation is deterministic template logic, not semantic research RAG.
2. No DB persistence for submissions or generated outputs yet.
3. No saved-ideas backend yet.
4. No auth scoping yet.

---

## 9) Progress map vs Continue Development Guide

Completed:

1. Step 0
2. Step 1
3. Step 2
4. Step 3
5. Step 4
6. Step 5

Remaining:

1. Step 6: persistence layer.
2. Step 7: save/list/retrieve features.
3. Step 8: authentication.
4. Step 9: testing framework and coverage.
5. Step 10: performance and bundle optimization.
6. Step 11: deployment alignment and env hardening.
7. Step 12: optional advanced features.

---

## 10) Immediate blockers and decisions still needed

### 10.1 Email real delivery

To enable actual email delivery to singhuday2612@gmail.com, these env vars must be provided:

1. SMTP_HOST
2. SMTP_PORT
3. SMTP_USER
4. SMTP_PASS
5. SMTP_SECURE
6. MAIL_FROM
7. ALERT_EMAIL_TO

### 10.2 Persistence model choices (Step 6)

Decisions pending:

1. Keep Drizzle schema additions in shared/schema.ts or split domain schema files.
2. Whether to store full generated payload snapshots per run for reproducibility.
3. Whether to store scoring components separately for explainability.

### 10.3 Retrieval engine design direction

Decisions pending:

1. Vector backend for MVP: pgvector vs local Qdrant.
2. Ingestion source set for MVP: API-first only vs selective scraping.
3. Local model routing strategy for idea synthesis.

---

## 11) Deep research brief for Gemini (copy/paste)

Use the prompt below in Gemini to continue planning and research:

"I am building a full-stack TypeScript app called Capstone AI. The app already has a working flow from questionnaire submission to backend idea generation and ideas rendering. Current generation is deterministic mock logic; I now need to design and implement a semantic research-driven idea generation engine.

Context and constraints:

1. Timeline: 2-3 week MVP.
2. Budget: under $100/month.
3. Hosting: hybrid local-dev, cloud-prod.
4. Preference: open-source/local models first.
5. Existing stack: React, Vite, Express, TanStack Query, Zod, Drizzle.

Current implemented backend endpoint:

1. POST /api/ideas/generate with Zod request/response validation.
2. Shared contracts already exist in shared/idea-contract.ts.
3. Frontend questionnaire mutation and ideas page dynamic rendering are done.

I need you to produce:

1. A concrete MVP architecture for semantic paper ingestion, normalization, chunking, embeddings, retrieval, and grounded idea synthesis.
2. Exact data model additions for Drizzle/Postgres for submissions, idea runs, citations, feedback, and saved ideas.
3. A stepwise implementation plan for Step 6 onward with weekly milestones.
4. Cost-aware component choices (local and low-cost cloud fallback).
5. Evaluation framework for novelty, feasibility, and citation grounding.
6. Prompting strategy for grounded generation with anti-hallucination checks.
7. A benchmark/test dataset plan to validate idea quality over time.

Output format needed:

1. Architecture diagram (text-based).
2. Detailed implementation tasks by week.
3. API contracts for new routes.
4. DB schema proposal with table definitions.
5. Risk register and mitigation plan."

---

## 12) Proposed next implementation sprint (engineering)

### Sprint A (Step 6: persistence)

1. Extend schema for submissions and generated ideas.
2. Add DB wiring module and migrate storage abstraction.
3. Persist each generation request and response.
4. Keep deterministic engine temporarily but store outputs for analysis.

### Sprint B (Step 7: saved ideas)

1. Add save idea endpoint.
2. Add list saved ideas endpoint.
3. Wire ideas page saved button to backend.
4. Add sorting and simple filters.

### Sprint C (research engine foundation)

1. Build source connector abstraction (start arXiv + Semantic Scholar APIs).
2. Add paper ingestion job runner.
3. Create normalized paper schema and storage.
4. Prototype embedding + retrieval service behind a feature flag.

---

## 13) Suggested quality gates before each merge

1. npm run check passes.
2. npm run build passes.
3. Manual flow passes: Home -> Plan -> Generate -> Ideas.
4. API validation rejects malformed payloads correctly.
5. No regression in loading/error UX states.

---

## 14) Summary in one page

Current status:

1. The app has moved from static frontend-only prototype to a functioning validated API-driven generation flow.
2. Email notification pipeline is implemented and testable; real SMTP delivery pending credentials.
3. Guide steps 0-5 are done.
4. The next major frontier is persistence and semantic research-grounded engine evolution.

If Gemini asks "what is most important next", the correct answer is:

1. Implement Step 6 persistence first.
2. Then build saved ideas and feedback loops.
3. Then replace deterministic generation with semantic retrieval + grounded synthesis incrementally.
