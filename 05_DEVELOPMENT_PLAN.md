# 05_DEVELOPMENT_PLAN.md — Implementation Roadmap

## ResumeForge AI — AI-Powered ATS Resume Optimization & Job Matching Platform
                                                   
**Version:** 1.0.0  
**Date:** 2026-08-24  
**Status:** Approved  
**Author:** Software Engineering & DevOps Team  

---

## 1. Roadmap Overview & Execution Strategy

This implementation roadmap provides a rigorous, step-by-step engineering plan for constructing ResumeForge AI from scratch to a production-ready deployment.

The project is structured into **15 consecutive phases (Phases 0 through 14)** designed to minimize architectural blockers, maintain high test coverage, and deliver a reliable MVP.

```mermaid
gantt
    title ResumeForge AI — Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation
    Phase 0: Project Setup & Tooling      :active, p0, 2026-09-01, 3d
    Phase 1: DB & Backend Foundation       :p1, after p0, 4d
    Phase 2: Authentication & Authz        :p2, after p1, 3d
    section Core Engines
    Phase 3: Resume Document Parsing       :p3, after p2, 5d
    Phase 4: Job Description Processing    :p4, after p3, 3d
    Phase 5: Keyword & Skill Matching      :p5, after p4, 4d
    Phase 6: ATS Scoring Engine            :p6, after p5, 3d
    Phase 7: AI Layer & Anti-Hallucination :p7, after p6, 5d
    section User Interface & Editing
    Phase 8: 3-Panel Editor & Versions     :p8, after p7, 6d
    Phase 9: ATS Templates & Styling       :p9, after p8, 4d
    Phase 10: PDF & DOCX Export Engine     :p10, after p9, 3d
    Phase 11: Frontend Polish & Responsive :p11, after p10, 4d
    section Quality & Release
    Phase 12: Testing & QA Suite           :p12, after p11, 5d
    Phase 13: Security Hardening & Audit   :p13, after p12, 3d
    Phase 14: Production Deployment & CI/CD:p14, after p13, 3d
```

---

## 2. Phase-by-Phase Engineering Tasks

### Phase 0: Project Setup & Tooling
- **Objectives:** Establish monorepo structure, development containers, linting, formatting, and CI pipelines.
- **Tasks:**
  1. Initialize repository with `frontend/` (Next.js 14, TypeScript) and `backend/` (Python 3.11+, Poetry/UV).
  2. Configure root `docker-compose.yml` with PostgreSQL 16 and MinIO (local S3 simulation).
  3. Setup backend code quality tools: `ruff` (linter + formatter), `mypy` (strict type checking), `pytest`.
  4. Setup frontend code quality tools: `ESLint`, `Prettier`, `TypeScript 5.x`, `Tailwind CSS`.
  5. Configure `.pre-commit-config.yaml` to enforce linting and branch naming conventions.
  6. Create GitHub Actions CI workflow (`.github/workflows/ci.yml`) running test suites and linting on every push.
- **Deliverables:** Working local dev environment runnable via `docker compose up` + single command dev scripts.

---

### Phase 1: Database & Backend Foundation
- **Objectives:** Build the persistence layer, database migrations, connection pooling, and core configurations.
- **Tasks:**
  1. Configure `app/core/config.py` using `pydantic-settings` to manage environment variables securely.
  2. Implement async database engine using SQLAlchemy 2.0 with connection pooling in `app/db/session.py`.
  3. Define declarative base and core SQLAlchemy models:
     - `User`, `Resume`, `ResumeVersion`, `JobDescription`, `ResumeAnalysis`, `AISuggestion`, `Template`, `GeneratedDocument`.
  4. Initialize Alembic and create the initial baseline migration script.
  5. Setup custom structured JSON logger in `app/core/logging.py`.
  6. Implement custom global exception handlers in `app/core/exceptions.py` returning standardized error envelopes.
- **Deliverables:** Fully migrated PostgreSQL schema with test seeds and working DB session injection.

---

### Phase 2: Authentication & Authorization
- **Objectives:** Implement secure JWT-based authentication with refresh cookies and route protection.
- **Tasks:**
  1. Implement password hashing using `bcrypt` (work factor 12) in `app/core/security.py`.
  2. Create JWT token generation and verification utilities for access tokens (15 min) and refresh tokens (7 days).
  3. Build `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, and `/api/v1/auth/logout` endpoints.
  4. Implement FastAPI dependency `get_current_user` in `app/api/deps.py` verifying JWT signatures and user status.
  5. Create user profile endpoints `/api/v1/users/me` with password change and account deletion handlers.
  6. Write integration tests for auth flows, verifying invalid token rejections, expired sessions, and password hashing.
- **Deliverables:** Complete, tested authentication system with secure cookie token rotation.

---

### Phase 3: Resume Document Processing
- **Objectives:** Build the document upload and text/structure extraction pipeline for PDF and DOCX files.
- **Tasks:**
  1. Implement S3-compatible storage adapter (`app/storage/`) supporting local disk and AWS S3 / Cloudflare R2.
  2. Implement file upload validation (10MB limit, MIME verification via `python-magic`).
  3. Create PDF extractor (`app/parsers/pdf_parser.py`) using `pdfplumber` and `pypdf` with fallback heuristics.
  4. Create DOCX extractor (`app/parsers/docx_parser.py`) using `python-docx`.
  5. Build regex and heuristic section segmenter (`app/parsers/section_extractor.py`) extracting:
     - Contact Info, Summary, Skills, Work Experience, Education, Projects, Certifications.
  6. Implement `/api/v1/resumes` upload endpoint persisting original files and structured JSON in PostgreSQL.
  7. Write unit tests with sample resumes (1-column, 2-column, text-heavy, messy formatting).
- **Deliverables:** Robust resume ingestion pipeline converting PDF/DOCX to standardized `StructuredResume` JSON.

---

### Phase 4: Job Description Processing
- **Objectives:** Ingest and parse target job descriptions from raw pasted text or uploaded files.
- **Tasks:**
  1. Create `/api/v1/job-descriptions` endpoint accepting either raw text payloads or multipart file uploads.
  2. Build text normalization pipeline extracting job title, company name, required skills, preferred skills, responsibilities, and experience requirements.
  3. Store parsed JD structures in PostgreSQL `job_descriptions` table.
  4. Write unit tests with diverse real-world tech and non-tech job descriptions.
- **Deliverables:** Reliable JD parsing service generating validated `ParsedJobDescription` models.

---

### Phase 5: Keyword & Skill Matching Engine
- **Objectives:** Build a high-precision, 4-tier matching engine comparing resume content against JD requirements.
- **Tasks:**
  1. Build text normalizer (`app/matching/normalizer.py`) performing lowercasing, punctuation stripping, and tokenization.
  2. Build domain synonym and acronym resolution dictionary (`app/matching/synonyms.py`, `acronyms.py`).
  3. Implement comparison algorithm (`app/matching/matcher.py`) classifying terms into:
     - **Matched Skills:** Verified present in both documents.
     - **Weak / Partial Matches:** Synonym overlap or related technology.
     - **Missing Keywords:** In JD but completely absent in resume.
  4. Ensure zero false matches between unrelated technologies (e.g., Java vs. JavaScript).
- **Deliverables:** Deterministic matching module producing structured gap analysis reports.

---

### Phase 6: ATS Scoring Engine
- **Objectives:** Implement the mathematical, explainable ATS compatibility scoring algorithm.
- **Tasks:**
  1. Implement scoring calculator (`app/ats/calculator.py`) using weighted formula:
     - Keyword Relevance ($40\%$) + Skills Match ($25\%$) + Responsibility Match ($20\%$) + Experience Relevance ($10\%$) + Structure ($5\%$).
  2. Build explainability module (`app/ats/explainability.py`) generating human-readable explanations for every deduction.
  3. Implement `/api/v1/analyses` endpoint triggering full analysis and persisting records in `resume_analyses`.
  4. Unit test scoring boundaries: 0% match, 50% partial match, 95%+ near-perfect match.
- **Deliverables:** Explainable ATS scoring service returning 0–100 scores with full category breakdowns.

---

### Phase 7: AI Layer & Anti-Hallucination Guardrails
- **Objectives:** Construct multi-provider AI abstraction with strict anti-hallucination verification.
- **Tasks:**
  1. Create `AIProviderBase` interface and implementations for OpenAI, Anthropic Claude, and Google Gemini.
  2. Implement deterministic prompt templates with negative constraints and strict JSON output schemas.
  3. Build anti-hallucination verification guardrail (`app/ai/guardrails.py`):
     - Compare all entities in AI output against original resume.
     - Automatically convert unverified skills into "Missing / Potential Keywords" with clear warnings.
  4. Create `/api/v1/resumes/{id}/optimize` and `/api/v1/ai/improve-section` endpoints.
- **Deliverables:** Production-grade AI layer producing tailored, factually accurate resume improvements.

---

### Phase 8: 3-Panel Resume Editor & Version History
- **Objectives:** Build the interactive frontend editor with TipTap, live ATS recalculation, and version tracking.
- **Tasks:**
  1. Build 3-panel layout in Next.js:
     - Left: Reorderable Section Navigation Tree.
     - Center: TipTap Rich-Text Document Canvas.
     - Right: Live ATS Assistant & Missing Skills drawer.
  2. Implement inline AI action triggers (`[ ✨ Improve Bullet ]`, `[ 🎯 Align with JD ]`).
  3. Build AI Suggestion card UI with `[Accept]`, `[Reject]`, and `[Edit]` buttons.
  4. Implement debounced autosave (30-second interval or section change) syncing with backend `/versions`.
  5. Build Version History Drawer with side-by-side visual diffs and one-click rollback.
- **Deliverables:** Fast, responsive 3-panel editor with real-time feedback and complete version control.

---

### Phase 9: ATS Templates & Styling
- **Objectives:** Implement ATS-safe document layout templates for web rendering and export.
- **Tasks:**
  1. Create HTML/CSS templates for:
     - **Template 1: Classic ATS** (Single column, standard headers, maximum parser compatibility).
     - **Template 2: Modern Technical** (Skills grid emphasis, clean metadata layout).
     - **Template 3: Executive Minimal** (Generous whitespace, refined typographic scale).
  2. Build dynamic template switcher and live preview screen in frontend.
  3. Validate layouts using top ATS parsing simulators to guarantee zero parsing errors.
- **Deliverables:** 3 fully responsive, ATS-validated resume templates.

---

### Phase 10: Document Export Engine
- **Objectives:** Build server-side compilation for PDF and DOCX document downloads.
- **Tasks:**
  1. Implement PDF export engine (`app/exporters/pdf_exporter.py`) using `WeasyPrint` and Jinja2 templates.
  2. Implement DOCX export engine (`app/exporters/docx_exporter.py`) using `python-docx`.
  3. Create `/api/v1/exports/pdf` and `/api/v1/exports/docx` endpoints with pre-flight validation checklists.
  4. Write export validation tests verifying selectable text, layout integrity, and file size.
- **Deliverables:** High-fidelity PDF and DOCX generation matching on-screen previews.

---

### Phase 11: Frontend Polish & Design System
- **Objectives:** Complete UI styling, responsive breakpoints, loading skeletons, and accessibility.
- **Tasks:**
  1. Implement shadcn/ui design tokens and component library (Buttons, Inputs, Modals, Badges, Dropdowns).
  2. Build responsive layouts for Desktop (1440px), Laptop (1024px), Tablet (768px), and Mobile (375px).
  3. Add skeleton loaders, empty states, and toast notifications for all user actions.
  4. Audit WCAG 2.1 Level AA compliance: color contrast, keyboard navigation, and ARIA labels.
- **Deliverables:** Polished, accessible, modern SaaS interface across all devices.

---

### Phase 12: Testing & QA Suite
- **Objectives:** Execute comprehensive unit, integration, and end-to-end automated test suites.
- **Tasks:**
  1. Backend unit test coverage $\ge 85\%$ (Parsers, Matcher, ATS Calculator, AI Guardrails).
  2. API integration tests covering all routes and error conditions.
  3. Frontend component tests using React Testing Library and Vitest.
  4. Playwright E2E test covering the complete user journey:
     - Register $\rightarrow$ Upload Resume $\rightarrow$ Paste JD $\rightarrow$ Analyze $\rightarrow$ Edit Bullet $\rightarrow$ Accept Suggestion $\rightarrow$ Export PDF.
- **Deliverables:** Automated CI test suite running reliably with zero flaky tests.

---

### Phase 13: Security Hardening & Audit
- **Objectives:** Audit application against OWASP Top 10, rate limiting, and prompt injection vulnerabilities.
- **Tasks:**
  1. Audit file upload pipeline (magic bytes validation, path traversal defense, file size caps).
  2. Enforce prompt injection delimiters and system prompt isolation.
  3. Implement rate limiting on auth, AI, and upload endpoints.
  4. Configure security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
  5. Perform automated dependency vulnerability scans using `bandit` and `npm audit`.
- **Deliverables:** Hardened production codebase with verified security compliance.

---

### Phase 14: Production Deployment & CI/CD
- **Objectives:** Deploy application to production cloud infrastructure with monitoring and backups.
- **Tasks:**
  1. Create multi-stage production `Dockerfile` for FastAPI backend.
  2. Deploy Next.js frontend to Vercel with custom domain and SSL.
  3. Deploy FastAPI backend to Render / AWS ECS behind an Application Load Balancer.
  4. Provision managed PostgreSQL 16 (Neon / AWS RDS) with automated daily backups.
  5. Configure Cloudflare R2 / AWS S3 for secure document storage.
  6. Setup Sentry error monitoring and Prometheus/Grafana telemetry.
- **Deliverables:** Live, monitored, auto-scaling production system.

---

## 3. Development Priority Matrix

| Priority | Feature / Module | Scope |
|---|---|---|
| **P0 (Critical MVP)** | Authentication & Security | Register, Login, Refresh Cookies, JWT validation |
| **P0 (Critical MVP)** | Document Parsing | PDF & DOCX upload, structured text extraction |
| **P0 (Critical MVP)** | JD Ingestion | Paste text and file upload parsing |
| **P0 (Critical MVP)** | Matching & ATS Scoring | Exact/synonym matching, 0–100 explainable score |
| **P0 (Critical MVP)** | AI Optimization | Factual bullet/summary rewrites, anti-hallucination |
| **P0 (Critical MVP)** | 3-Panel Editor | Inline editing, AI suggestion accept/reject, autosave |
| **P0 (Critical MVP)** | PDF Export | ATS-safe classic template, selectable text download |
| **P1 (Important)** | DOCX Export | Microsoft Word format generation |
| **P1 (Important)** | Templates | Modern Technical & Minimal Executive layouts |
| **P1 (Important)** | Version History | Visual diff comparisons, one-click rollback |
| **P1 (Important)** | Real-time ATS Recalculation | Live score updates during active typing |
| **P2 (Future)** | Cover Letter Generator | AI-tailored cover letter based on resume & JD |
| **P2 (Future)** | Job Application Tracker | Kanban board for tracking applications and status |
| **P2 (Future)** | Multi-Profile Management | Multiple base resume profiles per user |
| **P2 (Future)** | LinkedIn / Job Board Scrapers| Auto-import JD directly from URL |

---

## 4. Definition of Done (DoD) Checklist

A feature is considered **Done** and ready for production deployment only when:
- [x] **Code Complete:** Implemented strictly according to PRD, SRS, and Architecture specifications.
- [x] **Type Safety:** 100% type check pass with TypeScript strict mode and MyPy backend typing.
- [x] **Linting & Formatting:** Passes `ruff check`, `ruff format`, `eslint`, and `prettier` with zero warnings.
- [x] **Automated Tests:** Unit tests and integration tests pass with $\ge 85\%$ code coverage.
- [x] **Error Handling:** All network/API failures handled with user-friendly error banners (no raw stack traces).
- [x] **UI States:** Loading skeletons, empty states, and disabled button states implemented.
- [x] **No Fake Data:** All data loaded from live database records; zero mock data in production builds.
- [x] **No AI Hallucination:** Anti-hallucination guardrail verifies all generated content against source resume.
- [x] **Security Verified:** Route authorization, MIME type checks, and input sanitization validated.
- [x] **Responsive & Accessible:** Tested across Desktop, Tablet, Mobile and verified for WCAG AA contrast.
- [x] **Documented:** API endpoints documented in OpenAPI/Swagger and architecture docs updated.
