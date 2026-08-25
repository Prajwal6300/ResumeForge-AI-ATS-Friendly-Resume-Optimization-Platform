# ResumeForge AI

> **AI-Powered ATS Resume Optimization & Job Matching Platform**  
> Built with deterministic 5-pillar mathematical scoring, semantic keyword gap analysis, selectable-text PDF/DOCX exporters, and strict Anti-Fabrication guardrails.

[![Tests](https://img.shields.io/badge/pytest-19%20passed%20(100%25)-success)](file:///apps/api/tests)
[![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)](file:///apps/web)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%20Python%203.13-009688)](file:///apps/api)
[![ATS Accuracy](https://img.shields.io/badge/ATS%20Score-Deterministic%20Weights-blue)](file:///apps/api/app/ats)
[![Integrity](https://img.shields.io/badge/Factual%20Integrity-Anti--Fabrication%20Enforced-emerald)](file:///apps/api/app/ai/prompts/anti_fabrication.py)

---

## 🌟 Key Capabilities & Differentiators

1. **Deterministic 5-Pillar ATS Scoring Engine**:
   - Rather than relying on arbitrary LLM guesses, scores are computed using an exact, explainable mathematical formula:
     - **Keyword Relevance (40%)**: Exact & synonym matching across whole document.
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

## 🏗️ Architecture Overview

```
ResumeForge AI Monorepo
├── apps/
│   ├── api/                     # Python 3.13 / FastAPI Backend
│   │   ├── app/
│   │   │   ├── ai/              # Multi-Provider (OpenAI, Anthropic, Gemini, Ollama, Mock)
│   │   │   ├── ats/             # Deterministic 5-Pillar ATS Scorer & Rule Engine
│   │   │   ├── core/            # Security (bcrypt, JWT), Config, Logging, Exceptions
│   │   │   ├── db/              # SQLAlchemy Async Engine (PostgreSQL / SQLite)
│   │   │   ├── exporters/       # HTML, ReportLab PDF, and python-docx Generators
│   │   │   ├── matching/        # Tech Synonym Dictionary & Keyword Extractors
│   │   │   ├── models/          # User, Resume, ResumeVersion, JD, Analysis, AISuggestion
│   │   │   ├── parsers/         # PDF, Word DOCX, and Heuristic Section Extractor
│   │   │   ├── repositories/    # Clean DB Data Access Layer
│   │   │   ├── schemas/         # Pydantic v2 Request/Response Models
│   │   │   └── services/        # Business Logic Domain Orchestrators
│   │   ├── alembic/             # Database Migration Scripts
│   │   ├── tests/               # 100% Passing Unit and Integration Pytest Suite
│   │   └── requirements.txt
│   │
│   └── web/                     # Next.js 14 / TypeScript / Tailwind CSS Frontend
│       ├── src/
│       │   ├── app/             # App Router (Dashboard, Resumes, JDs, ATS Match, Editor)
│       │   ├── components/      # UI, Resume, JD, ATS Analysis, and Editor Components
│       │   ├── hooks/           # TanStack React Query Hooks
│       │   ├── lib/             # API Client, Auth Context, Utility Helpers
│       │   └── types/           # Shared TypeScript Interfaces
│       └── package.json
│
├── docs/                        # Complete Engineering Specifications & PRD
├── packages/
│   └── shared-types/            # Shared TypeScript Schema Definitions
├── docker-compose.yml           # Multi-Container Deployment Specification
└── pytest.ini                   # Backend Pytest Configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.11+** (Tested on Python 3.13)
- **Node.js 18+** & `npm`

### 1. Backend Setup (`apps/api`)
```bash
# Navigate to API directory
cd apps/api

# Create & activate virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

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

## 🧪 Running the Backend Test Suite

Run the full unit and integration test suite with `pytest`:
```bash
python -m pytest -v
```

All 19 tests cover:
- User registration, JWT issuance, and authentication security.
- Heuristic PDF and DOCX text & section parsers.
- Synonym dictionary keyword matching and case-insensitive recognition.
- Deterministic 5-pillar mathematical ATS scoring calculation.
- ReportLab selectable-text PDF and python-docx generation.
- Prompt injection protection and anti-fabrication boundary wrappers.
- End-to-end full user journey integration workflow.

---

## 🔒 Security & Privacy

- **Passlib-Free Cryptography**: Uses direct `bcrypt` hashing with modern salt rounds.
- **Path-Traversal Free Storage**: Local storage drivers enforce strict canonical base path checks.
- **SQLAlchemy Async Protection**: 100% parameterized queries eliminating SQL injection vectors.
- **Zero Third-Party Training**: User uploaded files are strictly utilized for runtime analysis and never sent to public training corpora.
                                     
---

## 📄 License
MIT License. Created for ResumeForge AI.
