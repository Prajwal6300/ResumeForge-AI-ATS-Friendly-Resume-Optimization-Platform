# 02_SRS.md — Software Requirements Specification

## ResumeForge AI

**Version:** 1.0.0
**Date:** 2026-08-24
**Purpose:** Defines clear, testable, and unambiguous functional and non-functional requirements for the ResumeForge AI platform.
                                                     
---

## 1. System Overview

ResumeForge AI is a web application that helps job seekers create ATS-friendly resumes tailored to specific job descriptions. The system accepts resume and job description documents, extracts structured information using NLP and parsing, provides compatibility analysis, and generates optimized resume content.

The system consists of:
- **Frontend:** Next.js application with React, TypeScript, Tailwind CSS
- **Backend:** FastAPI application with Python, SQLAlchemy, PostgreSQL
- **Database:** PostgreSQL for user data, resumes, job descriptions, analyses
- **AI Layer:** Abstraction layer supporting OpenAI, Anthropic, Google Gemini
- **Document Processing:** PDF/DOCX parsing and generation libraries
- **Object Storage:** For uploaded documents and generated resumes

---

## 2. User Roles

### MVP User Roles

| Role | Permissions |
|------|-------------|
| **User** | Can: register, login, upload resume, upload/paste JD, analyze resume, generate tailored resume, edit resume, download resume, delete own documents |
| **Admin** | Only if necessary for MVP. If included: manage users, view system statistics, cannot modify user resumes without explicit permission |

*Decision: Admin role will not be introduced in MVP unless specifically required. All functionality available to regular users.*

---

## 3. Functional Requirements

### FR-AUTH — Authentication

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-AUTH-001 | User registration | User can register with email and password; system validates email format; creates user record with hashed password |
| FR-AUTH-002 | User login | User can login with email/password; system generates JWT access token and refresh token; sets secure cookies |
| FR-AUTH-003 | Password reset | User can request password reset via email (send reset link); temporary valid for 24 hours |
| FR-AUTH-004 | Logout | User can logout; invalidates JWT and refresh token; clears cookies |
| FR-AUTH-005 | Protected routes | All API endpoints requiring authentication; middleware validates JWT token before processing |
| FR-AUTH-006 | Token refresh | Refresh token can be used to get new access token without re-login; refresh token rotation implemented |

### FR-RESUME — Resume Management

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-RESUME-001 | Upload resume | User can upload PDF or DOCX file ≤ 10MB; drag-and-drop and file selector supported; upload progress displayed; parsing status shown after upload |
| FR-RESUME-002 | List user resumes | Authenticated user can list all their resumes with metadata (filename, upload date, parsing status, version count) |
| FR-RESUME-003 | Get resume by ID | Retrieve specific resume details including structured data, versions, and analysis results |
| FR-RESUME-004 | Delete resume | User can delete their own resume; original resume preserved; associated versions and analyses cascade-deleted or preserved per policy |
| FR-RESUME-005 | Get original resume | System always preserves the original uploaded resume separately from generated versions |

### FR-JD — Job Description Management

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-JD-001 | Upload job description | User can upload PDF or DOCX JD file ≤ 10MB; or paste text; system stores both raw and parsed versions |
| FR-JD-002 | List user job descriptions | Authenticated user can list all their job descriptions with metadata |
| FR-JD-003 | Get job description by ID | Retrieve specific JD details including raw text and parsed structured data |

### FR-ANALYSIS — Resume Analysis

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-ANALYSIS-001 | Trigger analysis | User can initiate resume-JD analysis; system processes both documents and generates analysis results |
| FR-ANALYSIS-002 | Get analysis results | Retrieve analysis including ATS score, matched/missing keywords, skill gaps, experience match, responsibility match |
| FR-ANALYSIS-003 | Analysis cache | Analysis results associated with specific resume version and JD; reusable if same JD is re-analyzed |

### FR-MATCHING — Resume/JD Matching

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-MATCHING-001 | Keyword extraction | System extracts keywords from both resume and JD using normalized matching, synonym matching, and acronym handling |
| FR-MATCHING-002 | Matched skills display | System displays list of skills present in both resume and JD, with confidence levels |
| FR-MATCHING-003 | Missing skills display | System displays skills in JD not evidenced in resume; labeled "Missing / Potential Keyword" with disclaimer |
| FR-MATCHING-004 | Skill gap analysis | System identifies skill gaps and categories (technical, soft skills, tools, technologies) |
| FR-MATCHING-005 | Experience relevance | System compares resume experience dates/roles against JD experience requirements |
| FR-MATCHING-006 | Responsibility relevance | System compares resume responsibilities against JD responsibilities; shows percentage match |

### FR-ATS — ATS Scoring

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-ATS-001 | Calculate ATS score | System calculates ATS Compatibility Score from 0-100; score based on weighted categories |
| FR-ATS-002 | Score breakdown | System provides breakdown by category: keyword relevance (40%), skills match (25%), responsibility match (20%), experience relevance (10%), resume structure (5%) |
| FR-ATS-003 | Explainable methodology | System explains scoring methodology to user upon request; does not claim specific ATS vendor accuracy |
| FR-ATS-004 | Score visualization | Score displayed prominently on analysis screen; color-coded (Red: 0-49, Yellow: 50-69, Green: 70-100) |

### FR-AI — AI Optimization

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-AI-001 | AI provider abstraction | Backend supports multiple AI providers (OpenAI, Anthropic, Google Gemini); provider can be swapped without changing API contracts |
| FR-AI-002 | Summary optimization | AI improves professional summary to align with target JD; preserves user's actual experience |
| FR-AI-003 | Bullet optimization | AI improves action bullets: better action verbs, measurability, clarity; preserves facts |
| FR-AI-004 | Skills optimization | AI reframes skills to match JD terminology; does not add skills user doesn't have |
| FR-AI-005 | Project optimization | AI highlights relevant project experience from resume; aligns with JD requirements |
| FR-AI-006 | Grammar improvement | AI fixes grammar, improves flow and tone; does not change meaning or facts |
| FR-AI-007 | Structured outputs | AI outputs follow JSON schema; free-form text not relied upon; enables programmatic parsing |
| FR-AI-008 | AI suggestion workflow | System presents AI suggestions with [Accept] [Reject] [Edit] buttons; user action recorded |

### FR-EDITOR — Manual Resume Editor

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-EDITOR-001 | Section navigation | Editor displays sections: Summary, Skills, Experience, Projects, Education; user can navigate between sections |
| FR-EDITOR-002 | Inline editing | User can edit text content within each section; changes saved locally and to server |
| FR-EDITOR-003 | Add section | User can add new sections (e.g., certifications, languages) |
| FR-EDITOR-004 | Delete section | User can remove sections; confirmation dialog shown |
| FR-EDITOR-005 | Add bullet | User can add new bullet points within experience sections |
| FR-EDITOR-006 | Delete bullet | User can remove bullet points; confirmation dialog shown |
| FR-EDITOR-007 | Reorder sections | User can drag-and-drop to reorder sections; reordering saved to version |
| FR-EDITOR-008 | Accept AI suggestion | User can accept AI-generated improvement; suggestion applied to editor content |
| FR-EDITOR-009 | Reject AI suggestion | User can reject AI-generated improvement; suggestion removed from editor |
| FR-EDITOR-010 | Undo/Redo | User can undo/redo last changes; local storage and server sync; limited history (last 50 changes) |
| FR-EDITOR-011 | Autosave | Changes autosaved every 30 seconds or on section navigation; unsaved changes indicator shown |

### FR-EXPORT — Document Export

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-EXPORT-001 | PDF export | System generates PDF resume from editor content; ATS-friendly layout; preserves formatting; file downloads successfully |
| FR-EXPORT-002 | DOCX export | System generates DOCX resume from editor content; compatible with Microsoft Word; preserves formatting; file downloads successfully |
| FR-EXPORT-003 | Export validation | Exported documents validated for structure and content before delivery |
| FR-EXPORT-004 | Export format selection | User can choose PDF or DOCX format; both available from same generated resume |

### FR-VERSION — Version Management

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-VERSION-001 | Preserve original | Original uploaded resume never overwritten; stored separately with "original" marker |
| FR-VERSION-002 | Version tracking | Each generated/edited resume associated with timestamp, JD version, and change type (generated, edited) |
| FR-VERSION-003 | List versions | User can list all versions of a resume with dates, types, and descriptions |
| FR-VERSION-004 | Restore version | User can restore any previous version; restored version becomes current editor content |
| FR-VERSION-005 | Version comparison | User can compare two versions side-by-side; differences highlighted |

### FR-SETTINGS — User Settings

| Requirement ID | Requirement | Description |
|----------------|-------------|-------------|
| FR-SETTINGS-001 | Update profile | User can update profile information (name, display name, time zone) |
| FR-SETTINGS-002 | Change password | User can change password; current password verification required |
| FR-SETTINGS-003 | Delete account | User can permanently delete account; all resumes, JDs, analyses, versions deleted after confirmation |
| FR-SETTINGS-004 | API key management (optional) | User can manage AI provider API keys if using self-hosted or custom providers |

---

## 4. Business Rules

| Rule ID | Business Rule | Description |
|---------|---------------|-------------|
| BR-001 | A resume cannot be generated without a valid resume source and target Job Description | System requires both a parsed resume and a parsed JD before generating optimized resume |
| BR-002 | AI must not invent professional experience | AI rewrites existing experience only; if no evidence exists, system shows "Missing / Potential Keyword" instead |
| BR-003 | Missing keywords must not automatically be inserted as claimed skills | System never adds a skill to the resume just because it appears in the JD; shows disclaimer instead |
| BR-004 | Original resume content must remain recoverable | Original resume preserved separately; can be restored at any time; never overwritten or deleted implicitly |
| BR-005 | Each generated resume must be associated with a specific Job Description | Generated resume metadata includes JD ID; enables re-analysis if JD changes |
| BR-006 | Users must be able to manually override AI-generated content | Every AI suggestion has [Accept] [Reject] [Edit] options; user has final say |
| BR-007 | Resume versions are immutable once created | Previous versions cannot be modified; only new versions can be created from existing ones |
| BR-008 | ATS score is explainable, not definitive | Score labeled "ResumeForge ATS Compatibility Score"; methodology disclosed; not claim of specific ATS accuracy |
| BR-009 | File type validation before processing | Only PDF and DOCX accepted; other file types rejected with clear error message |
| BR-010 | Maximum file size enforcement | Files > 10MB rejected; progress shown for valid files; user notified of size limit |

---

## 5. Validation

### 5.1 File Type Validation

| Input | Valid Types | Invalid Types |
|-------|-------------|---------------|
| Resume upload | PDF, DOCX | Image-only PDF, Scanned PDF, Password-protected PDF, RTF, TXT, HTML, unsupported types |
| Job Description upload | PDF, DOCX | Same as resume + PowerPoint, spreadsheets |

### 5.2 File Size Validation

| Input | Maximum Size |
|-------|--------------|
| Resume PDF/DOCX | 10MB |
| Job Description PDF/DOCX | 10MB |

### 5.3 Empty Document Validation

| Condition | Error Message |
|-----------|---------------|
| Empty resume upload | "Resume file is empty. Please upload a valid resume document." |
| Empty JD text paste | "Job description text is empty. Please paste or upload a job description." |
| Empty JD upload | "Uploaded job description file is empty. Please provide a valid job description." |

### 5.4 Corrupted Document Validation

| Condition | Handling |
|-----------|-----------|
| Corrupted PDF | "Unable to parse PDF. The file may be corrupted or password-protected. Try a different file or paste the text instead." |
| Corrupted DOCX | "Unable to parse DOCX. The file may be corrupted. Try a different file or paste the text instead." |
| Invalid DOCX structure | "File appears to be an invalid DOCX format. Please verify the file and try again." |

### 5.5 Password-Protected PDFs

| Condition | Handling |
|-----------|-----------|
| Password-protected PDF | "PDF is password-protected. Please upload an unprotected PDF or paste the job description text instead." |

### 5.6 Scanned PDFs

| Condition | Handling |
|-----------|-----------|
| Scanned/ image-only PDF | "This PDF appears to be an image-based document. Text extraction may not work. Please upload a text-based PDF or paste the content instead." |

### 5.7 Invalid DOCX

| Condition | Handling |
|-----------|-----------|
| DOCX without valid structure | "Unable to parse DOCX. The file may be corrupted or in an unsupported format." |

### 5.8 Unsupported Documents

| Condition | Handling |
|-----------|-----------|
| Unsupported file type | "Unsupported file type. Please upload PDF or DOCX format, or paste the text directly." |

### 5.9 Empty Job Description

| Condition | Handling |
|-----------|-----------|
| No JD provided | "Job description is required to analyze and optimize your resume. Please paste the job description text or upload a file." |
| JD with only whitespace | Same as empty JD error |

### 5.10 Extremely Long Job Description

| Condition | Handling |
|-----------|-----------|
| JD > 50,000 characters | "Job description is very long. Analysis may take additional time. Would you like to continue?" |
| JD > 100,000 characters | Error: "Job description exceeds maximum length (100,000 characters). Please provide a shorter description or key requirements." |

### 5.11 Duplicate Upload Prevention

| Condition | Handling |
|-----------|-----------|
| Same resume file uploaded twice | System detects duplicate by filename and content hash; user prompted "Resume with this filename already exists. Overwrite or keep existing?" |
| Same JD uploaded twice | System detects duplicate; user prompted similarly. |

---

## 6. Security

### 6.1 Authentication Security

| Requirement | Description |
|-------------|-------------|
| Password hashing | bcrypt or argon2 with appropriate work factor; never store plaintext passwords |
| JWT tokens | Short-lived access tokens (15-30 min); refresh tokens with rotation; signed with secret key |
| Secure cookies | HttpOnly, Secure (HTTPS only), SameSite=Strict flags on cookies |
| Session management | Concurrent session limit; user can logout from all sessions |

### 6.2 Authorization Security

| Requirement | Description |
|-------------|-------------|
| Resource ownership | Users can only access their own resumes, JDs, analyses, and versions |
| Protected endpoints | All document endpoints require valid JWT; unauthorized returns 401/403 |
| Delete permissions | Users can delete their own documents; admin access required for others' documents |

### 6.3 File Upload Security

| Requirement | Description |
|-------------|-------------|
| MIME validation | Validate MIME type matches declared type; reject mismatches |
| File extension check | Double-check extension matches content type |
| Virus scanning | Optional: scan uploaded files for malware before processing |
| Sandboxed storage | Uploaded files stored in isolated directory; no direct web access |
| Path traversal prevention | Sanitize all file paths; prevent directory traversal attacks |

### 6.4 Prompt Injection Protection

| Requirement | Description |
|-------------|-------------|
| Untrusted input | All uploaded document content treated as untrusted input |
| No system instruction override | Document content never overrides system prompts or AI instructions |
| Content sanitization | Remove or neutralize suspicious content before sending to AI providers |
| Input length limits | Maximum characters sent to AI providers; truncation if exceeded |

### 6.5 XSS Prevention

| Requirement | Description |
|-------------|-------------|
| Output encoding | All user-generated content encoded before rendering in HTML |
| Content Security Policy | CSP header configured to restrict inline scripts |
| Safe DOM updates | Editor content updates go through safe pipeline; no innerHTML for untrusted content |

### 6.6 CSRF Protection

| Requirement | Description |
|-------------|-------------|
| CSRF tokens | State-changing requests require valid CSRF token |
| SameSite cookies | Strict or Lax SameSite cookie policy |
| Token validation | Server validates CSRF token on state-changing endpoints |

### 6.7 SQL Injection Prevention

| Requirement | Description |
|-------------|-------------|
| Parameterized queries | All database queries use parameterized statements or ORM |
| Input sanitization | No string concatenation in SQL queries |
| ORM usage | SQLAlchemy ORM used for all database operations |

### 6.8 Rate Limiting

| Requirement | Description |
|-------------|-------------|
| API rate limits | 100 requests per 15 minutes per authenticated user |
| Auth endpoints | 5 requests per minute per IP for registration/login |
| Upload endpoints | 10 uploads per minute per user |
| AI endpoints | 20 AI generation requests per minute per user |

### 6.9 Secrets Management

| Requirement | Description |
|-------------|-------------|
| Environment variables | All secrets (API keys, DB passwords) via environment variables |
| No hardcoded secrets | Zero hardcoded API keys, passwords, or secrets in source code |
| Secret rotation | Regular rotation policy for all secrets |

### 6.10 Data Encryption

| Requirement | Description |
|-------------|-------------|
| In-transit encryption | HTTPS/TLS 1.2+ for all network traffic |
| At-rest encryption | Database encryption enabled; storage encryption (S3) |
| Communication encryption | All API responses over HTTPS |

### 6.11 Audit Logging

| Requirement | Description |
|-------------|-------------|
| Log events | Authentication events, document uploads, analysis triggers, AI generations, export actions |
| Log retention | 90 days minimum; secure storage |
| PII in logs | No PII (emails, names) in application logs unless explicitly needed |

---

## 7. AI Security

### 7.1 Untrusted Input Handling

- All uploaded resume and Job Description content treated as untrusted input
- Document content never overrides system instructions or prompts
- Content passed to AI providers is sanitized and validated
- Maximum character limits enforced for AI input

### 7.2 Prompt Injection Protection

- System prompts are fixed; user content cannot modify them
- AI output validated against expected schemas before use
- No direct embedding of user content into system prompts
- Escape/special handling for characters that could break prompt structure

### 7.3 Factuality Safeguards

- AI outputs run through structured validation before display
- Any AI-added content compared against original source
- "Missing / Potential Keyword" disclaimer shown for skills not in original resume
- User must explicitly accept any AI-generated addition

### 7.4 AI Output Validation

- All AI outputs validated against JSON schema
- Free-form LLM text not relied upon for critical data
- Structured outputs preferred (JSON) over free text
- Fallback to manual review if schema validation fails

---

## 8. Performance

| Requirement | Target |
|-------------|--------|
| Normal document extraction | Under 10 seconds for typical PDF/DOCX (1-5 pages) |
| JD parsing | Under 5 seconds for typical job description |
| Resume analysis (non-AI) | Under 10 seconds from trigger to results display |
| AI generation timeout | 90 seconds maximum; user notified if approaching limit |
| API response (non-AI) | Under 2 seconds for 95% of requests |
| API response (AI) | Under 5 seconds for non-generation endpoints; 90s for generation |
| Concurrent processing | Support 50 simultaneous analysis requests without degradation |
| Maximum document size | 10MB enforced; larger files rejected at upload |
| Export time | Under 10 seconds for PDF/DOCX generation from typical resume |

---

## 9. Error Handling

| Error Type | User-Friendly Message | Technical Handling |
|------------|----------------------|---------------------|
| Upload failure | "Unable to upload file. Please check the file and try again." | Log error with file details; show retry option |
| Parsing failure | "Unable to parse document. The file may be corrupted or in an unsupported format. Try pasting the text instead." | Log parsing error; stack trace captured internally (not shown to user) |
| AI failure | "AI service temporarily unavailable. Please try again or modify your resume manually." | Retry with exponential backoff; fallback to manual editing |
| Timeout | "Operation timed out. Please check your connection and try again." | Cancel long-running operations; allow retry |
| Invalid document | "The uploaded file could not be recognized. Please upload a valid PDF or DOCX, or paste the text." | Validate file type/size before processing; show supported types |
| Export failure | "Unable to export resume. Please try again or use a different format." | Clean up partial exports; log error; allow retry |
| Authentication failure | "Invalid email or password. Please try again." | Generic message to prevent username enumeration; log attempt |
| Database failure | "Unable to save your changes. Please try again later." | Retry with exponential backoff; show message if persistent |
| Version conflict | "This version has been modified by another process. Please refresh and try again." | Optimistic concurrency control; refresh page data |

---

## 10. Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Resume has no skills section | System reports 0% skills match; user can manually add skills in editor |
| Resume contains multiple jobs | All jobs parsed and analyzed individually; matching considers all experience |
| Resume is image-only | Error: "Cannot extract text from image-based resume. Please provide text-based PDF/DOCX or paste content." |
| Resume has unusual formatting | System parses best effort; user warned about potential parsing limitations; editor shows raw content if needed |
| JD contains no clear skills | System extracts available content; ATS score based on structure and responsibilities; user guided to add key requirements |
| JD contains contradictory requirements | System extracts all requirements; ATS score reflects complexity; user can prioritize which to follow |
| Resume and JD in different languages | System processes primary language; multilingual support considered post-MVP |
| Very short resume (1-2 lines) | System analyzes available content; ATS score reflects limited data; user prompted to add more detail |
| Very long resume (10+ years) | System parses all experience; matching considers relevance recency; user can filter which experience to include |
| Duplicate keywords | Deduplicated in matching; counted once for coverage calculation |
| Synonyms | Handled via normalized matching (e.g., "PostgreSQL" = "Postgres") but flagged for user verification |
| Acronyms | "PostgreSQL" and "Postgres" recognized as related; other acronyms handled case-by-case |
| Different technology names | "JS" and "JavaScript" normalized; "React" and "React.js" normalized; custom mapping configurable |

---

## 11. Acceptance Criteria

| Feature | Acceptance Criteria |
|---------|---------------------|
| Registration | New user can register with valid email/password; receives verification; login redirects to dashboard |
| Login | Authenticated user can login; JWT issued; protected routes accessible; unauthenticated access denied |
| Resume upload | User uploads PDF ≤ 10MB; system parses contact info, summary, skills, experience; error for oversized/invalid |
| JD upload | User uploads PDF/DOCX or pastes text; system extracts job title, skills, responsibilities; error for empty |
| Analysis | After upload+JD, analysis triggers; ATS score displayed 0-100 with category breakdown; matched/missing keywords shown |
| AI optimization | AI rewrites existing content only; no fabricated experience; user can accept/reject each suggestion |
| Manual editor | User can edit, add, delete sections/bullets; undo/redo works; autosave preserves changes |
| PDF export | Exported PDF is ATS-friendly; formatting preserved; downloads successfully; file size reasonable |
| DOCX export | Exported DOCX opens in Word; formatting preserved; downloads successfully |
| Version history | Original resume preserved; generated versions tracked; user can restore any previous version |
| Error messages | All errors show user-friendly messages; no stack traces or technical details displayed to users |
| Security | Unauthenticated users cannot access protected routes; authenticated users can only access their own resources |

---
