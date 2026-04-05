# Idea Generation Engine Integration Analysis

## Data Flow Currently

Home → Questionnaire (local state only) → Ideas (hardcoded MOCK_IDEAS) → Plan

questionnaire.tsx has formData state with:

- branch, skills, experience, interests[], customInterest, problemSpace
- teamSize, timeframe, hardware, impact (grade|research|startup|social), difficulty (moderate|challenging|bleeding edge)

ideas.tsx loads MOCK_IDEAS constant (3 ideas with detailed specs)

## Key Integration Points Identified

1. Questionnaire submit (handleNext on final step) - currently just navigate
2. Ideas page - currently just reads MOCK_IDEAS constant
3. Backend routes - completely empty
4. Storage - only MemStorage interface, no idea persistence
5. Schema - only has users table, no ideas or questionnaire tables

## Tech Stack Details

- Frontend: React 19 + TanStack Query + Framer Motion + taildwind/ui + Wouter
- Backend: Express 5 + TypeScript
- Validation: Zod + drizzle-zod
- ORM: Drizzle + PostgreSQL (config exists, not yet used)
- Data flow helpers: apiRequest() in queryClient.ts

## Current Blockers

1. No /api routes defined at all
2. No schema for questionnaire submissions or ideas
3. Questionnaire data not sent anywhere (local state only)
4. No mutation hook for questionnaire submit
5. No database setup (db:push never run)
6. Ideas page hardcoded with MOCK constant
7. No idea-related functions in storage interface
