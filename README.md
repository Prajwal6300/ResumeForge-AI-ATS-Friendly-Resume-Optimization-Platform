# ResumeForge AI

> **AI-Powered ATS Resume Optimization & Job Matching Platform**  
> Built with deterministic 5-pillar mathematical scoring, semantic keyword gap analysis, selectable-text PDF/DOCX exporters, and strict Anti-Fabrication guardrails.

[![Tests](https://img.shields.io/badge/pytest-25%20passed%20(100%25)-success)](file:///apps/api/tests)
[![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)](file:///apps/web)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%20Python%203.13-009688)](file:///apps/api)
[![ATS Accuracy](https://img.shields.io/badge/ATS%20Score-Deterministic%20Weights-blue)](file:///apps/api/app/ats)
[![Integrity](https://img.shields.io/badge/Factual%20Integrity-Anti--Fabrication%20Enforced-emerald)](file:///apps/api/app/ai/prompts/anti_fabrication.py)

---

## 🌐 Production Architecture

- **Frontend (Live on Vercel):** [https://resume-forge-ai-ats-friendly-resume.vercel.app/](https://resume-forge-ai-ats-friendly-resume.vercel.app/)
- **Backend Server:** FastAPI on Linux VPS behind Nginx Reverse Proxy with Gunicorn + Uvicorn Workers and Let's Encrypt SSL/TLS.
- **Database:** Supabase PostgreSQL with managed Alembic migrations.
- **AI Orchestrator:** Secure server-side multi-provider engine (OpenAI, Anthropic, Gemini, Ollama, Mock fallback).

```text
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │     VERCEL      │
                  │                 │
                  │ Next.js Frontend│
                  └────────┬────────┘
                           │
                           │ HTTPS
                           ▼
                  ┌─────────────────┐
                  │ BACKEND SERVER  │
                  │                 │
                  │ Nginx           │
                  │      ↓          │
                  │ Gunicorn        │
                  │      ↓          │
                  │ FastAPI         │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
       ┌──────────┐   ┌──────────┐   ┌─────────────┐
       │ Supabase │   │ AI APIs  │   │ File Storage│
       │PostgreSQL│   │OpenAI /  │   │ Private     │
       │          │   │Claude /  │   │ Documents   │
       │          │   │Gemini    │   │             │
       └──────────┘   └──────────┘   └─────────────┘
```

---

## 🌟 Key Capabilities & Differentiators

1. **Deterministic 5-Pillar ATS Scoring Engine**:
   - Rather than relying on arbitrary LLM guesses, scores are computed using an exact, explainable mathematical formula:
     - **Keyword Relevance (40%)**: Exact & synonym matching across the whole document.
     - **Technical Skills Alignment (25%)**: Mandatory technical stack coverage.
     - **Responsibilities Coverage (20%)**: Experience mapping to target duties.
     - **Experience Depth (10%)**: Chronological alignment and tenure.
     - **Formatting & ATS Structure (5%)**: Single-column validation, section heading recognition, and contact completeness.
2. **Strict Anti-Fabrication Guardrails**:
   - The AI **never invents** fake jobs, certifications, degrees, or skills.
   - Missing keywords are flagged as *"Missing / Recommended Keyword"* and clearly marked: *"Add this only if you genuinely have experience with it."*
3. **Prompt Injection & Adversarial Document Defense**:
   - All uploaded PDFs, Word DOCXs, and pasted text are sanitized and wrapped in isolated boundary tags with system-priority instruction locks.
4. **Immutable Version Control & Rollback**:
   - The user's original uploaded resume is never overwritten. Every edit or optimization creates an immutable snapshot with 1-click restore.
5. **Real Document Parsing & Native Exporters**:
   - `pdfplumber` + `pypdf` text and structural layout extractors.
   - `python-docx` semantic style extraction.
   - Generates selectable-text PDF documents (ReportLab) and styled Word DOCX files matching 4 clean ATS templates: *Classic*, *Professional*, *Modern*, and *Minimal*.

---

## 🏗️ Project Structure

```text
ResumeForge AI Monorepo
├── apps/
│   ├── api/                     # Python 3.13 / FastAPI Backend
│   │   ├── alembic/             # Database Migration Scripts
│   │   ├── app/
│   │   │   ├── ai/              # Multi-Provider (OpenAI, Anthropic, Gemini, Ollama, Mock)
│   │   │   ├── api/             # API Routers & Dependencies (Auth, Resumes, JDs, Exports)
│   │   │   ├── ats/             # Deterministic 5-Pillar ATS Scorer & Rule Engine
│   │   │   ├── core/            # Security (bcrypt, JWT), Config, Logging, Exceptions
│   │   │   ├── db/              # SQLAlchemy Async Engine (PostgreSQL / SQLite)
│   │   │   ├── exporters/       # HTML, ReportLab PDF, and python-docx Generators
│   │   │   ├── matching/        # Tech Synonym Dictionary & Keyword Extractors
│   │   │   ├── models/          # User, Resume, ResumeVersion, JD, Analysis, AISuggestion
│   │   │   ├── parsers/         # PDF, Word DOCX, and Heuristic Section Extractor
│   │   │   ├── repositories/    # DB Data Access Layer (IDOR-safe queries)
│   │   │   ├── schemas/         # Pydantic v2 Request/Response Models
│   │   │   ├── services/        # Business Logic Domain Orchestrators
│   │   │   └── storage/         # Local & S3 Storage Drivers
│   │   ├── tests/               # 100% Passing Unit and Integration Pytest Suite
│   │   ├── .env.example         # Backend environment template
│   │   └── requirements.txt     # Backend dependencies
│   │
│   └── web/                     # Next.js 14 / TypeScript / Tailwind CSS Frontend
│       ├── src/
│       │   ├── app/             # App Router (Dashboard, Resumes, JDs, ATS Match, Editor)
│       │   ├── components/      # UI, Resume, JD, ATS Analysis, and Editor Components
│       │   ├── hooks/           # TanStack React Query Hooks
│       │   ├── lib/             # API Client, Auth Context, Utility Helpers
│       │   └── types/           # Shared TypeScript Interfaces
│       ├── .env.example         # Frontend environment template
│       └── package.json
│
├── infrastructure/
│   ├── nginx/                   # Production Nginx reverse proxy configuration
│   └── systemd/                 # Production systemd service unit file
├── DEPLOYMENT.md                # Complete Linux VPS & Cloud Deployment Manual
└── pytest.ini                   # Backend Pytest Configuration
```

---

## 🚀 Local Development Guide

### Prerequisites
- **Python 3.11+** (Tested on Python 3.13)
- **Node.js 18+** & `npm`

### 1. Backend Setup (`apps/api`)
```bash
# Navigate to API directory
cd apps/api

# Create & activate virtual environment
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API documentation will be available at:  
👉 **http://localhost:8000/docs**

### 2. Frontend Setup (`apps/web`)
```bash                                               
# Navigate to web application directory
cd apps/web

# Install dependencies
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```
Web application will be accessible at:  
👉 **http://localhost:3000**

---

## 🚢 Production Deployment

For step-by-step production deployment instructions covering:
- Linux VPS / EC2 setup (Ubuntu 22.04 / 24.04 LTS)
- Supabase PostgreSQL database connection
- Running Alembic migrations (`alembic upgrade head`)
- Configuring Gunicorn with `UvicornWorker`
- Setting up the `resumeforge-api.service` systemd daemon
- Nginx reverse proxy with Let's Encrypt SSL/TLS
- Vercel frontend deployment with `NEXT_PUBLIC_API_URL`
- Routine updates, log management, and rollback procedures

Please refer to the comprehensive [DEPLOYMENT.md](file:///DEPLOYMENT.md) guide.

---

## 🧪 Testing

### Running Backend Pytest Suite
```bash
cd apps/api
python -m pytest -v
```

All 25 tests verify:
- User registration, JWT issuance, password hashing, and authentication security.
- Cross-user IDOR access control across all entities.
- AI safety, anti-fabrication bounds, and prompt injection defense.
- PDF and DOCX text & section parsers.
- Synonym dictionary keyword matching and deduplication.
- Deterministic 5-pillar mathematical ATS scoring calculation.
- ReportLab selectable-text PDF and python-docx generation.
- End-to-end full user journey integration workflow.

### Running Frontend Verification
```bash
cd apps/web
npm run lint
npm run typecheck
npm test
npm run build
```

---

## 🔒 Security & Privacy Architecture

- **Zero Client-Exposed Secrets**: The frontend bundle never receives database URLs, JWT secret keys, or AI provider credentials.
- **Strict Origin CORS**: FastAPI allows only the configured production frontend origin.
- **Role & Ownership Isolation (IDOR Defense)**: Every resource query joins on the authenticated user's ID.
- **Path-Traversal Free Storage**: Local storage drivers enforce strict canonical base path checks.
- **SQLAlchemy Parameterized Queries**: Eliminates SQL injection vulnerabilities.
- **Untrusted Input Isolation**: Resume and Job Description inputs are wrapped in boundary tags to prevent prompt injection.

---

## 📄 License
MIT License. Created for ResumeForge AI.
