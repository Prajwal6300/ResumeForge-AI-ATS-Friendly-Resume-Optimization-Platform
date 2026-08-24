# ResumeForge AI — ATS-Friendly Resume Optimization Platform

[![Status](https://img.shields.io/badge/status-specification%20ready-success.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)

> **AI-Powered ATS Resume Optimization & Job Matching Platform**  
> Tailor your resume to any job description with explainable ATS scoring, 100% factual accuracy, and zero AI hallucinations.

---

## 📖 Complete Engineering Documentation

The complete architectural and product specification suite is organized into five standalone engineering documents:

| # | Document | File | Description |
|---|---|---|---|
| 01 | **Product Requirements Document (PRD)** | [`01_PRD.md`](./01_PRD.md) | Product vision, target personas, non-goals, core features, MVP scope (P0/P1/P2), user stories, success metrics, and acceptance criteria. |
| 02 | **Software Requirements Specification (SRS)** | [`02_SRS.md`](./02_SRS.md) | Testable functional requirements with IDs (`FR-AUTH`, `FR-RESUME`, `FR-JD`, `FR-AI`, `FR-ATS`, etc.), business rules (`BR-001` to `BR-010`), security, performance targets, and edge cases. |
| 03 | **System Architecture Document (SAD)** | [`03_SYSTEM_ARCHITECTURE.md`](./03_SYSTEM_ARCHITECTURE.md) | Modular monolith architecture, FastAPI backend structure, Next.js 14 frontend structure, PostgreSQL DDL schemas, REST API contract, AI abstraction layer, anti-hallucination guardrails, 4-tier keyword matching engine, and ATS scoring math. |
| 04 | **UI/UX Specification** | [`04_UI_UX_SPECIFICATION.md`](./04_UI_UX_SPECIFICATION.md) | Design tokens, typography/color palette, 15 complete wireframed screens (Landing, Dashboard, 3-Panel Editor, Live ATS Assistant, AI Diff Cards, Template Selector, PDF Preview, Export Dialog, Version History), UI states matrix, and WCAG AA accessibility specs. |
| 05 | **Implementation Roadmap** | [`05_DEVELOPMENT_PLAN.md`](./05_DEVELOPMENT_PLAN.md) | 15-phase execution plan (Phase 0 to Phase 14), task breakdown, deliverables, P0/P1/P2 prioritization, and Definition of Done (DoD) checklist. |

---

## 🎯 Core Product Principles

1. **Zero AI Hallucination:** The AI is strictly prohibited from inventing skills, work experience, metrics, or credentials. Missing skills from the Job Description are flagged separately as *"Missing / Potential Keywords"* labeled *"Add this only if you have genuine experience with it"*.
2. **Explainable ATS Scoring:** Deterministic mathematical scoring across 5 weighted categories:
   $$\text{ATS Score} = 0.40 \cdot S_{\text{kw}} + 0.25 \cdot S_{\text{skill}} + 0.20 \cdot S_{\text{resp}} + 0.10 \cdot S_{\text{exp}} + 0.05 \cdot S_{\text{struct}}$$
3. **Immutable Source Preservation:** The original uploaded resume is preserved separately and never overwritten.
4. **Full User Control:** 3-panel rich text editor with inline AI suggestions, instant before/after diff previews, and explicit `[Accept]`, `[Reject]`, and `[Edit]` controls.

---

## 🛠️ Technology Stack Direction

- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, TipTap Editor, TanStack Query.
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic.
- **Database:** PostgreSQL 16 (Relational DB + JSONB).
- **Document Processing:** `pdfplumber`, `pypdf`, `python-docx`, `WeasyPrint`.
- **AI Layer:** Abstract multi-provider interface supporting OpenAI, Anthropic Claude, Google Gemini, and Ollama.
- **Storage:** S3-compatible object storage (AWS S3 / Cloudflare R2 / MinIO).
