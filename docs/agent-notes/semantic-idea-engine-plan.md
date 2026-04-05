## Plan: Semantic Idea Engine MVP

Build a source-grounded idea-generation engine in the existing TypeScript app, prioritizing semantic retrieval over keyword matching, under a 2-3 week timeline and under $100/month budget. The recommended path is API-first source ingestion (arXiv + Semantic Scholar + OpenAlex/PapersWithCode), local/open-source embedding + generation (Ollama), and evidence-grounded output scoring before UI integration.

**Steps**

1. Finalize engine success criteria and output contract (_blocks all later steps_).
   Define what an accepted generated idea must include: problem statement, novelty hypothesis, feasibility constraints, implementation sketch, and explicit citations to source papers.
2. Freeze phase-1 source strategy and compliance rules (_depends on 1_).
   Use API-access sources first: arXiv API, Semantic Scholar API, OpenAlex metadata, PapersWithCode metadata. Defer broad scraping to phase-2 after robots/TOS review.
3. Add shared idea-engine schemas in the shared layer (_depends on 1_).
   Create typed request/response contracts for questionnaire input, retrieval evidence pack, generated ideas, and scores (novelty/feasibility/impact/confidence).
4. Build ingestion connectors and a normalized research record model (_depends on 2; parallel substeps_).
   Connector substeps can run in parallel: arXiv connector, Semantic Scholar connector, OpenAlex/PapersWithCode enrichers. Normalize into one canonical paper shape with IDs, abstract, categories, publication date, citations, and source URL.
5. Add storage model for papers, chunks, embeddings metadata, generation runs, and feedback (_depends on 3 and 4_).
   Extend database schema and storage interface so all downstream engine stages can persist and query artifacts.
6. Implement semantic indexing pipeline (_depends on 4 and 5_).
   Chunk abstracts/full text, generate embeddings using an open-source path (Ollama embedding model), and store vectors (pgvector or local Qdrant). Add recency and domain metadata for hybrid ranking.
7. Implement retrieval orchestrator with evidence packs (_depends on 6_).
   Given questionnaire intent, perform semantic retrieval + metadata filtering + diversification. Return top-N evidence with traceable source IDs and reasons for inclusion.
8. Implement grounded generation orchestrator (_depends on 7_).
   Generate ideas using only retrieved evidence context, enforce strict structured JSON output, and reject/regenerate when required fields or citation links are missing.
9. Implement scoring and guardrails layer (_depends on 8_).
   Novelty: semantic distance + citation-gap heuristic. Feasibility: scope/time/team/hardware fit from questionnaire. Impact: problem significance + trend signals. Add citation coverage and hallucination flags.
10. Expose engine APIs in the backend (_depends on 8 and 9_).
    Add endpoints for: generate ideas, retrieve evidence for an idea, save idea, list saved ideas, and submit feedback for evaluation loop.
11. Integrate frontend questionnaire and ideas pages with real API flow (_depends on 10_).
    Replace local navigation-only submit with mutation to generation endpoint. Replace hardcoded ideas with API-backed data states (loading/error/empty/success) while preserving current UI quality.
12. Add engine observability and evaluation loop MVP (_depends on 10 and 11_).
    Persist generation runs, latency, token/compute usage, citation coverage, and user feedback. Use this to tune retrieval depth and scoring weights weekly.
13. Validate with milestone test gates (_depends on 12_).
    Gate A: schema + ingestion correctness. Gate B: retrieval quality and citation traceability. Gate C: end-to-end UX from questionnaire to saved ideas. Gate D: quality benchmark on novelty/feasibility rubric.

**Relevant files**

- c:/Users/singh/Downloads/Replit_project/shared/schema.ts — extend shared contracts for questionnaire input, generated ideas, evidence packs, and scoring models.
- c:/Users/singh/Downloads/Replit_project/server/routes.ts — add generation/evidence/save/feedback API endpoints.
- c:/Users/singh/Downloads/Replit_project/server/storage.ts — extend storage interface and implementations for idea-engine entities.
- c:/Users/singh/Downloads/Replit_project/client/src/pages/questionnaire.tsx — submit questionnaire to generation API and handle failure/retry states.
- c:/Users/singh/Downloads/Replit_project/client/src/pages/ideas.tsx — consume generated ideas/evidence from API instead of static mocks.
- c:/Users/singh/Downloads/Replit_project/client/src/lib/queryClient.ts — add or tune query/mutation helpers for new endpoints.
- c:/Users/singh/Downloads/Replit_project/drizzle.config.ts — support new migration outputs and DB credentials for engine tables.
- c:/Users/singh/Downloads/Replit_project/package.json — add required dependencies/scripts for ingestion jobs and local model clients.
- New module group under server/idea-engine/ — connectors, normalization, retrieval, generation, scoring, evaluation, and job runners.

**Verification**

1. Contract verification: run type-check and schema validation tests for all request/response models.
2. Ingestion verification: run connector jobs and confirm normalized paper records + deduplication + metadata completeness.
3. Retrieval verification: for fixed questionnaire prompts, verify semantic results are relevant, recent, and diversified.
4. Grounding verification: each generated idea must include source citations traceable to retrieved evidence entries.
5. Quality verification: score generated ideas on novelty, feasibility, and citation coverage using a fixed rubric.
6. Integration verification: manual flow test from home -> questionnaire -> generated ideas -> save/list/feedback.
7. Runtime verification: validate latency/cost profile against under-$100 target and 2-3 week MVP scope.

**Decisions**

- Target profile: balanced quality and speed.
- Timeline target: 2-3 weeks for first end-to-end version.
- Budget target: under $100/month.
- Hosting strategy: hybrid (local dev, cloud prod).
- Model preference: open-source/local models first.
- Source strategy for phase-1: API-first trusted research sources; broad scraping deferred until compliance review.

**Scope Boundaries**

- Included in MVP: research-paper-driven semantic retrieval, grounded idea generation, scoring, and app integration.
- Excluded from MVP: full unrestricted web scraping across arbitrary domains, multi-agent autonomous research crawler swarm, and enterprise-scale MLOps.

**Further Considerations**

1. Scraping policy choice: Option A API-first only (recommended for MVP), Option B selective compliant scraping for specific domains, Option C broad scraping (high legal/maintenance overhead).
2. Vector backend choice: Option A pgvector (simple stack), Option B local Qdrant (better semantic ops), Option C managed vector DB (more cost).
3. Model routing choice: Option A single local model, Option B small local + fallback cloud, Option C multi-model ensemble (best quality, slower MVP).
