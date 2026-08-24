# 04_UI_UX_SPECIFICATION.md — Complete UI/UX Specification

## ResumeForge AI — AI-Powered ATS Resume Optimization & Job Matching Platform

**Version:** 1.0.0  
**Date:** 2026-08-24  
**Status:** Approved  
**Author:** Product Design & UI/UX Engineering Team  

---

## 1. Design Direction & Aesthetic

ResumeForge AI is designed as a **clean, high-density, professional SaaS productivity application**. It rejects flashy AI marketing gimmicks, distracting animated gradient meshes, and decorative bloat in favor of typographic rigor, optimal information hierarchy, and calm, distraction-free editing environments.

### Core Visual Principles
- **Light & Crisp Surfaces:** Pure white (`#FFFFFF`) and slate gray (`#F8FAFC`) backdrops with subtle 1px border lines (`#E2E8F0`) to create clear section boundaries.
- **Typographic Rigor:** Neutral, modern sans-serif typography (`Inter`) for UI elements and resume body text, with monospace (`JetBrains Mono`) for keyword tags, metrics, and token pills.
- **Purposeful Color Palette:** Monochromatic base with purposeful semantic accents (Deep Slate for primary actions, Royal Blue for links/active states, Emerald Green for matched keywords/high scores, Amber for warnings/partial matches, and Rose for critical missing skills/errors).
- **Zero Uncanny AI Visuals:** AI suggestions appear as clean diff cards with clear provenance and reasoning, never disguised as magic.

---

## 2. Design System & Design Tokens

### 2.1 Typography Scale
- **Font Families:**
  - Primary UI & Document Body: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Code, Badges, Metadata, & Metrics: `JetBrains Mono, Menlo, Monaco, monospace`

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-display` | 36px (2.25rem) | 44px (1.2) | 700 (Bold) | Landing Page Hero |
| `text-h1` | 28px (1.75rem) | 36px (1.28) | 700 (Bold) | Dashboard & Major Page Titles |
| `text-h2` | 20px (1.25rem) | 28px (1.4) | 600 (SemiBold) | Section Headers, Editor Panes |
| `text-h3` | 16px (1.0rem) | 24px (1.5) | 600 (SemiBold) | Card Headers, Modal Titles |
| `text-body` | 14px (0.875rem) | 20px (1.43) | 400 (Regular) / 500 (Medium) | Default UI text, resume content |
| `text-caption` | 12px (0.75rem) | 16px (1.33) | 400 (Regular) / 500 (Medium) | Timestamps, metadata, labels |
| `text-mono-sm` | 12px (0.75rem) | 16px (1.33) | 500 (Medium) | Keyword tags, score badges |

### 2.2 Color Palette & Semantic Tokens

```text
Neutral Palette:
  --bg-app:        #F8FAFC (Slate 50)
  --bg-surface:    #FFFFFF (Pure White)
  --bg-muted:      #F1F5F9 (Slate 100)
  --border-subtle: #E2E8F0 (Slate 200)
  --border-strong: #CBD5E1 (Slate 300)
  --text-primary:  #0F172A (Slate 900)
  --text-muted:    #64748B (Slate 500)
  --text-disabled: #94A3B8 (Slate 400)

Brand & Semantic Accents:
  --brand-primary: #0F172A (Deep Slate - Primary Buttons, Main Accents)
  --brand-accent:  #2563EB (Royal Blue - Interactive Focus, Active Tabs)
  --brand-accent-hover: #1D4ED8 (Blue 700)
  --brand-accent-subtle: #EFF6FF (Blue 50)

Status Tokens:
  --success-bg:    #ECFDF5 (Emerald 50)
  --success-text:  #047857 (Emerald 700)
  --success-border:#A7F3D0 (Emerald 200)
  --warning-bg:    #FFFBEB (Amber 50)
  --warning-text:  #B45309 (Amber 700)
  --warning-border:#FDE68A (Amber 200)
  --danger-bg:     #FEF2F2 (Rose 50)
  --danger-text:   #B91C1C (Rose 700)
  --danger-border: #FECACA (Rose 200)
```

### 2.3 Component Specifications

- **Buttons:**
  - `Primary`: Deep Slate background (`#0F172A`), white text, 6px border-radius, hover: `#1E293B`.
  - `Secondary`: White background, 1px border (`#CBD5E1`), text (`#334155`), hover: `#F8FAFC`.
  - `Ghost`: Transparent background, hover: `#F1F5F9`.
  - `Destructive`: Rose background (`#DC2626`), white text.
- **Pill / Keyword Badge:** Height 24px, 4px padding-x, 4px border-radius, `JetBrains Mono` 12px.
- **Card:** White background, 1px border (`#E2E8F0`), subtle drop shadow (`0 1px 3px rgba(0,0,0,0.05)`), 8px border-radius.

---

## 3. Screen-by-Screen Detailed Specifications

### Screen 1: Landing Page (`/`)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  [ResumeForge AI]                     Features   How it Works   [Log in] [Get Started]
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                     Land More Interviews with an ATS-Optimized              │
│                          Resume Tailored to Every Job                       │
│                                                                             │
│        Match your real experience to job descriptions with explainable AI   │
│             scoring and 100% factual accuracy — zero hallucinations.        │
│                                                                             │
│                       [ Optimize Your Resume — Free → ]                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ LIVE ATS SIMULATOR DEMO                                               │  │
│  │ Target Role: Senior Backend Engineer      ATS Score: 88/100 [Green]   │  │
│  │ Matched: [Python ✓] [FastAPI ✓] [PostgreSQL ✓] [Docker ✓] [Redis ✓]   │  │
│  │ Missing: [Kubernetes ⚠️ (Add only if you have genuine experience)]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [ How It Works (3 Steps) ]  [ Feature Grid ]  [ FAQ ]  [ Footer ]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Header:** Sticky navbar with brand logo, navigation links, and Auth CTAs.
- **Hero Section:** High-converting headline, sub-headline emphasizing factual integrity, and primary CTA.
- **Interactive Simulator Card:** Visual widget demonstrating instant ATS parsing and keyword comparison.
- **Feature Matrix:** 6 cards highlighting:
  1. *Factual Accuracy Guarantee* (No fabricated claims).
  2. *Explainable ATS Scoring* (Breakdown by keywords, skills, experience).
  3. *3-Panel Live Editor* (Instant score recalculation).
  4. *Multi-Format Support* (PDF/DOCX upload and download).
  5. *Full Version Control* (Original resume always preserved).
  6. *ATS-Safe Templates* (Tested against top parser layouts).

---

### Screen 2 & 3: Authentication (`/register`, `/login`)

- **Layout:** Centered card on slate background (`#F8FAFC`).
- **Fields:** Email address, Password, Full Name (on register).
- **Validation:** Live client-side Zod validation on blur; password strength indicator (min 8 chars, 1 uppercase, 1 digit).
- **State Handling:** Submitting button spinner, clear red banner for invalid credentials (generic *"Invalid email or password"* to prevent user enumeration).

---

### Screen 4: User Dashboard (`/dashboard`)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ResumeForge AI]   Resumes   Analyses   Settings             [User Profile ▾]│
├─────────────────────────────────────────────────────────────────────────────┤
│ Dashboard                                                                   │
│                                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐  │
│ │ Resumes Created      │ │ Target JDs Analyzed  │ │ Avg ATS Score        │  │
│ │ 4 Resumes            │ │ 12 Analyses          │ │ 84 / 100             │  │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘  │
│                                                                             │
│ Recent Resumes & Optimizations                     [+ New Tailored Resume]  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Resume Title       Target Role & Company       ATS Score  Updated   Act.│ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Backend_2026.pdf   Staff Engineer @ Stripe      91/100    2 hrs ago […] │ │
│ │ DataEng_v2.docx    Senior Data Eng @ Snowflake  86/100    Yesterday […] │ │
│ │ ML_Engineer.pdf    AI Engineer @ Anthropic      74/100    3 days ago[…] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Top Stat Cards:** Quick overview metrics.
- **Recent Resumes Table:** Shows resume name, target job, ATS compatibility score gauge, timestamp, and quick-action menu (Edit, View Report, Download PDF, Version History, Delete).
- **Empty State:** Clean illustration with *"You haven't uploaded a resume yet"* and primary CTA button *"[+ Upload Resume & Match Job]"*.

---

### Screen 5, 6 & 7: New Resume & Match Flow (`/resumes/new`)

A 3-step guided wizard:

#### Step 1: Upload Source Resume
- **Component:** Large dropzone supporting drag-and-drop or file picker.
- **Constraints Display:** *"Supported formats: PDF, DOCX (Max 10MB)"*.
- **Progress Bar:** Real-time upload progress with animated status steps:
  1. *Uploading file...*
  2. *Extracting raw text...*
  3. *Parsing sections (Skills, Experience, Education)...*
  4. *Parsing complete! (Found 14 skills, 3 roles)*

#### Step 2: Target Job Description Input
- **Dual Tab Switcher:**
  - **Tab 1: Paste Text (Default):** Auto-expanding textarea with placeholder *"Paste the full job description here..."*, character counter (min 100 chars, max 50,000 chars), and instant keyword extractor pill preview.
  - **Tab 2: Upload File:** Dropzone for PDF/DOCX job posting documents.
- **Optional Metadata:** Job Title input, Company Name input.

#### Step 3: Parse & Match Trigger
- Primary button *"[ Run ATS Compatibility Analysis → ]"*.

---

### Screen 8: ATS Analysis & Report Screen (`/resumes/[id]`)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard     Backend_Resume.pdf → Staff Backend @ Stripe         │
│                                           [ Open Editor ] [ Export PDF ▾ ]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │ ATS COMPATIBILITY SCORE │ │ SCORE BREAKDOWN                             │ │
│ │                         │ │ Keyword Relevance (40%):    ████████░░ 88%  │ │
│ │         88/100          │ │ Skills Match (25%):         █████████░ 92%  │ │
│ │                         │ │ Responsibility Match (20%): ███████░░░ 78%  │ │
│ │   [ Strong Match ]      │ │ Experience Relevance (10%): ██████████ 100% │ │
│ │                         │ │ Structure & Hygiene (5%):   ██████████ 100% │ │
│ └─────────────────────────┘ └─────────────────────────────────────────────┘ │
│                                                                             │
│ MATCHED KEYWORDS (18 Found in Resume)                                       │
│ [Python ✓] [FastAPI ✓] [PostgreSQL ✓] [Docker ✓] [Redis ✓] [REST APIs ✓]    │
│ [Distributed Systems ✓] [Microservices ✓] [SQLAlchemy ✓] [Git ✓]            │
│                                                                             │
│ MISSING / POTENTIAL KEYWORDS (4 in JD, Not in Resume)                       │
│ ⚠️ Add these ONLY if you have genuine experience with them:                 │
│ [Kubernetes +] [gRPC +] [Apache Kafka +] [AWS ECS +]                        │
│                                                                             │
│ ACTIONABLE RECOMMENDATIONS (3)                                              │
│ 1. [Strengthen Bullets]: Experience at 'Acme Corp' lacks metrics.           │
│ 2. [Keyword Alignment]: Replace 'Relational DB' with 'PostgreSQL' in bullet.│
│ 3. [Summary Optimization]: Highlight distributed systems background.        │
│                                                                             │
│                     [ Proceed to AI Resume Editor → ]                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 9: 3-Panel Main Resume Editor (`/resumes/[id]/edit`)

The core workspace screen of ResumeForge AI.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [← Back]  Backend_Resume - Stripe Tailored      [Autosaved 12:42] [Preview] [Export ▾]│
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│ SECTIONS     │ RESUME EDITOR CANVAS                     │ ATS ASSISTANT     │
│              │                                          │                   │
│ ≡ Contact    │ Alex Chen                                │ ATS Score: 88/100 │
│ ≡ Summary    │ San Francisco, CA • alex@example.com     │                   │
│ ≡ Experience │                                          │ Missing Skills:   │
│   • Stripe   │ PROFESSIONAL SUMMARY                     │ • Kubernetes      │
│   • Acme     │ Senior Backend Engineer with 6+ years... │ • Kafka           │
│ ≡ Skills     │                                          │ • gRPC            │
│ ≡ Education  │ WORK EXPERIENCE                          │                   │
│ ≡ Projects   │ Senior Software Engineer — Acme Corp     │ AI Suggestions:   │
│              │ 2021 – Present                           │ ┌───────────────┐ │
│ [+ Section]  │ • Architected high-throughput REST APIs  │ │ Bullet 1 Impr.│ │
│              │   using FastAPI and PostgreSQL...        │ │ [Review]      │ │
│              │                                          │ └───────────────┘ │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

#### Left Panel (Width: 240px) — Section Navigator
- Reorderable section list with drag-and-drop handles (`≡`).
- Section completion icons (green checkmark if populated, gray circle if empty).
- Quick click jumps canvas view directly to that section.
- *"[+ Add Custom Section]"* button at bottom.

#### Center Panel (Flex: 1) — TipTap Rich-Text Canvas
- Styled as a clean A4/Letter page sheet on gray backdrop with subtle box-shadow.
- Full formatting controls (Bold, Italic, Bullet List, Align).
- Inline AI Action Bar appears on text selection: `[ ✨ Improve Bullet ]` `[ 🎯 Align with JD ]` `[ ⚡ Make Measurable ]`.
- Visual diff highlights when AI improvements are injected.

#### Right Panel (Width: 320px) — Live ATS Assistant
- Real-time ATS Compatibility Score gauge that updates dynamically as the user types.
- Missing Keywords drawer: Clicking any missing keyword displays: *"Add to: [Summary] [Skills] [Experience Bullet]"* with a strict disclaimer popup.
- Pending AI Suggestions feed with direct `[Accept]` and `[Reject]` controls.

---

### Screen 10: AI Suggestion & Improvement UI

When AI rewrite is triggered for a bullet or section:

```text
┌─────────────────────────────────────────────────────────────────┐
│ ✨ AI Suggestion — Experience Bullet (Acme Corp)                │
├─────────────────────────────────────────────────────────────────┤
│ CURRENT TEXT:                                                   │
│ "Worked on backend APIs with Python and improved performance."  │
│                                                                 │
│ AI PROPOSED REWRITE:                                            │
│ "Architected 12+ RESTful APIs using Python and FastAPI,         │
│ optimizing PostgreSQL database queries to reduce p95 latency   │
│ by 35%."                                                        │
│                                                                 │
│ 💡 WHY THIS HELPS:                                              │
│ Aligns with JD requirement for 'FastAPI' & 'latency tuning'    │
│ without introducing unverified technologies.                    │
│                                                                 │
│ [ ✔ Accept ]       [ ✏️ Edit & Apply ]       [ ✖ Reject ]        │
└─────────────────────────────────────────────────────────────────┘
```

---

### Screen 11: Template Selection Modal

Allows one-click switching between validated ATS-compliant templates:
1. **Classic ATS (Default):** Single-column, standard serif/sans-serif, clear black lines, zero graphics. 100% parser compatible.
2. **Modern Technical:** Clean header layout with dedicated technical skills matrix and left-aligned metadata.
3. **Executive Minimal:** Generous whitespace, refined typographic scale for senior leadership profiles.

---

### Screen 12: Resume Preview (`/resumes/[id]/preview`)

- High-fidelity PDF preview rendered via WebAssembly/PDF.js.
- Page boundary guide lines indicating standard 1-page or 2-page cutoffs.
- Top bar controls: Template Selector dropdown, Zoom In/Out, *[ Download PDF ]*, *[ Download DOCX ]*.

---

### Screen 13: Export Dialog

- Format Selector: `[ PDF (.pdf) ]` | `[ Microsoft Word (.docx) ]`.
- **Pre-Flight ATS Validation Checklist:**
  - [x] Contact information complete (Email & Phone verified).
  - [x] Standard section headings present.
  - [x] No empty bullet points.
  - [x] Document length: Exactly 1 Page (Optimal).
- Download button with loading spinner during server-side compilation.

---

### Screen 14: Version History & Diff Drawer

- Opens from editor top navigation *"[ Version History ]"*.
- Displays chronological list of versions:
  - `v3 (Current)` — User manual edits (12:42 PM)
  - `v2` — AI Tailored for Stripe JD (12:35 PM)
  - `v1 (Original)` — Uploaded original file (12:30 PM)
- Side-by-side visual diff (green insertions, red strikethrough deletions).
- *"[ Restore This Version ]"* button.

---

### Screen 15: User Settings (`/settings`)

- **Profile Tab:** Name, email, time zone.
- **Account Security:** Password change form with current password verification.
- **Data & Privacy:** Complete document deletion controls (*"Delete all uploaded resumes and job descriptions"* and *"Permanently delete account"*).

---

## 4. UI States Matrix

| State | Visual Treatment | User Feedback / Action |
|---|---|---|
| **Loading** | Skeleton loaders mirroring exact layout dimensions. | Smooth pulse animation; disables interactive buttons. |
| **Empty State** | Centered muted icon with friendly title and descriptive guidance. | Single prominent primary action CTA. |
| **Error Banner** | Amber/Red top card with distinct icon and clear recovery text. | Includes `[ Try Again ]` or `[ Dismiss ]` button. |
| **Uploading** | Circular or horizontal progress bar with percentage counter. | Displays cancel button `[ ✕ ]` if in-flight. |
| **AI Generating** | Subtle blue shimmer border on active editor block + status text. | Text: *"Analyzing job requirements and refining phrasing..."*. |
| **Autosaving** | Top navigation micro-text: *"Saving..."* $\rightarrow$ *"Saved at 12:45"*. | Discreet, non-intrusive feedback. |
| **Exporting** | Full modal with loading ring and step checklist. | Steps: *"Compiling layout..."* $\rightarrow$ *"Generating PDF..."* $\rightarrow$ *"Download ready"*. |

---

## 5. Responsive Design Breakdown

- **Desktop ($\ge$ 1280px):** Full 3-panel layout active (240px Nav, Flex Editor Canvas, 320px ATS Assistant).
- **Laptop (1024px – 1279px):** 3-panel layout with collapsible ATS Assistant drawer (toggle button in header).
- **Tablet (768px – 1023px):** Left section navigator collapses into top dropdown; Editor canvas takes full width; ATS score floats as a sticky bottom pill that expands into a bottom sheet.
- **Mobile (< 768px):** Tabbed bottom navigation bar switching between `[ 📄 Edit ]`, `[ 🎯 ATS Score ]`, and `[ 📑 Sections ]`.

---

## 6. Accessibility & ARIA Specifications

- **WCAG Compliance:** Strict adherence to **WCAG 2.1 Level AA** standards.
- **Contrast Ratios:** Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text across all color tokens.
- **Keyboard Shortcuts:**
  - `Ctrl / Cmd + S`: Manual save checkpoint.
  - `Ctrl / Cmd + Z`: Undo.
  - `Ctrl / Cmd + Shift + Z`: Redo.
  - `Ctrl / Cmd + K`: Jump to section or command palette.
  - `Esc`: Close open modal/drawer.
- **Screen Reader Support:**
  - Dynamic score updates announce via `aria-live="polite"`.
  - Missing keywords lists tagged with `role="list"` and descriptive `aria-label="Missing required job keywords"`.
  - All interactive buttons have explicit `aria-label` tags.
