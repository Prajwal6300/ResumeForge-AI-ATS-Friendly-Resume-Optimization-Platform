# 01_PRD.md — Product Requirements Document

## ResumeForge AI

**Version:** 1.0.0
**Date:** 2026-08-24
**Purpose:** Defines the product vision, scope, features, and success metrics for the ResumeForge AI platform.

---
                                                
## 1. Executive Summary

**What is ResumeForge AI?**
ResumeForge AI is an AI-powered web application that helps job seekers create ATS-friendly resumes tailored to specific job descriptions. The system analyzes both the user's existing resume and the target job description using structured parsing and AI/NLP techniques, then provides actionable insights and an optimized resume generation.

**What problem does it solve?**
Job seekers currently face generic resumes that fail ATS (Applicant Tracking System) filters, difficulty understanding job descriptions, missing important keywords, poor resume structure, lack of actionable feedback, and the need for excessive manual tailoring. Additionally, many AI resume tools fabricate experience and skills, which can have serious professional consequences.

**Who is it for?**
- **Primary users:** Students, fresh graduates, software developers, engineers, professionals, job switchers, and technical candidates
- **Secondary users:** Career coaches and resume consultants (MVP focused on individual job seekers)

**Why is it useful?**
ResumeForge AI provides explainable ATS compatibility scores, identifies matched and missing keywords, highlights skill gaps, and generates optimized resume content based on the user's actual experience — never fabricating information. Users maintain full control through manual editing and AI suggestion acceptance/rejection.

---

## 2. Problem Statement

Job seekers currently face these challenges:

| Problem | Impact |
|---------|--------|
| Generic resumes | Resumes that don't match specific job descriptions, resulting in low callback rates |
| Poor ATS keyword matching | Resumes filtered out by ATS before human review |
| Difficulty understanding Job Descriptions | Inability to identify required skills and qualifications from dense JD text |
| Missing important skills | Candidates unaware of skills they lack vs. what the role requires |
| Poor resume structure | Unclear section hierarchy, inconsistent formatting |
| Lack of actionable feedback | No clear guidance on what to improve or how |
| Excessive manual tailoring | Hours of repetitive work to tailor each resume |
| AI-generated resumes with fabricated information | Risk of listing skills/experience the candidate doesn't possess |

---

## 3. Product Vision

To become the most trusted AI-powered resume optimization platform that helps job seekers create ATS-compatible resumes while maintaining complete factual accuracy. ResumeForge AI will be the standard tool for job seekers who want to optimize their resumes for specific opportunities without compromising their integrity.

**Long-term goals:**
- Expand to support 20+ document types and languages
- Integrate with job boards for seamless job description import
- Provide career path recommendations based on skill gap analysis
- Build a trusted brand known for factual, honest AI assistance

---

## 4. Target Users

### Primary Users

| Segment | Description |
|---------|-------------|
| Students | Recent graduates entering the job market, often with internships and projects |
| Fresh Graduates | New entrants with limited professional experience |
| Software Developers/Engineers | Technical candidates with specific skill sets |
| Professionals | Mid-career professionals seeking advancement or role changes |
| Job Switchers | Professionals transitioning to new industries or roles |
| Technical Candidates | Roles requiring specific certifications, tools, or technologies |

### Secondary Users

| Segment | Description |
|---------|-------------|
| Career Coaches | Professionals who help multiple clients optimize resumes |
| Resume Consultants | Paid consultants providing resume optimization services |

*MVP focus: Individual job seekers. Secondary features will be considered post-MVP.*

---

## 5. Goals

| Goal | Metric | Target |
|------|--------|--------|
| Resume processing success rate | % of resumes parsed successfully | ≥ 90% |
| JD parsing success rate | % of job descriptions parsed successfully | ≥ 85% |
| AI generation success rate | % of AI generations completing without error | ≥ 80% |
| Average generation time | Seconds from analysis to generated resume | ≤ 60 seconds |
| Export success rate | % of exports that complete successfully | ≥ 95% |
| User editing completion rate | % of AI suggestions users accept/reject/edit | ≥ 70% |
| Resume optimization acceptance rate | % of generated resumes users keep after editing | ≥ 60% |
| Error rate | Unhandled errors per 100 operations | ≤ 5% |

---

## 6. Non-Goals (MVP Explicitly Excludes)

The following are explicitly out of scope for MVP:

- Automatic job applications
- LinkedIn automation
- Web scraping of job descriptions
- Recruiter marketplace
- Interview preparation platform
- Social networking features
- Payroll or compensation data
- Recruitment management system
- Job board integrations
- Multiple profile management
- Cover letter generation (P2 feature)
- Analytics dashboard (P2 feature)

---

## 7. Core Features

### 7.1 Resume Upload

| Feature | Details |
|---------|---------|
| Supported formats | PDF, DOCX |
| Maximum file size | 10MB per file |
| Drag & drop support | Yes |
| File selector | Yes |
| Upload progress indicator | Yes |
| Parsing status | Displayed after upload |

### 7.2 Job Description Input

| Feature | Details |
|---------|---------|
| Paste text | Unlimited characters, with autosave |
| Upload PDF | Supported, same validation as resume PDF |
| Upload DOCX | Supported, same validation as resume DOCX |
| File size limit | 10MB per file |

### 7.3 Resume Parsing

**Extracts structured information from the existing resume:**

| Section | Extractable Content |
|---------|---------------------|
| Contact information | Name, email, phone, location, LinkedIn, portfolio |
| Summary | Professional summary or objective |
| Skills | Technical skills, soft skills, languages, certifications |
| Experience | Job titles, companies, dates, descriptions |
| Education | Degrees, institutions, graduation years, honors |
| Projects | Project names, descriptions, technologies, durations |
| Certifications | Certification name, issuing body, date |
| Achievements | Quantifiable accomplishments, awards |

### 7.4 Job Description Analysis

**Extracts important information from the Job Description:**

| Category | Extractable Content |
|----------|---------------------|
| Job title | Official role title |
| Required skills | Mandatory skills and technologies |
| Preferred skills | Nice-to-have skills and technologies |
| Responsibilities | Key day-to-day duties |
| Qualifications | Minimum and preferred qualifications |
| Experience requirements | Years of experience, level |
| Tools | Specific tools and software |
| Technologies | Programming languages, frameworks, platforms |
| Domain keywords | Industry-specific terminology |
| Soft skills | Communication, leadership, teamwork |
| Important phrases | Key repeating themes from JD |

### 7.5 Resume/JD Matching

**Shows comparison results:**

| Metric | Description |
|--------|-------------|
| Matched skills | Skills present in both resume and JD |
| Missing skills | Skills in JD not evidenced in resume |
| Weak matches | Skills with partial overlap or synonyms |
| Keyword coverage | Percentage of JD keywords found in resume |
| Experience relevance | How well resume experience matches JD requirements |
| Responsibility relevance | How well resume responsibilities match JD duties |

### 7.6 ATS Score

**Create an explainable score:**

- **Name:** ATS Compatibility Score
- **Range:** 0-100
- **Methodology breakdown:**
  - Keyword relevance (40%)
  - Skills match (25%)
  - Responsibility match (20%)
  - Experience relevance (10%)
  - Resume structure (5%)
- **Does NOT claim** to be an exact representation of any specific ATS vendor
- **Label clearly:** "ResumeForge ATS Compatibility Score"
- **Explain methodology** to the user upon request

### 7.7 AI Optimization

**Allows the following AI-assisted improvements:**

| Category | Description |
|----------|-------------|
| Summary optimization | Improve professional summary alignment with JD |
| Experience bullet optimization | Improve action verbs, measurability, clarity |
| Skills optimization | Reframe skills to match JD terminology |
| Project optimization | Highlight relevant project experience |
| Keyword alignment | Suggest keyword integration where evidence exists |
| Grammar improvement | Fix grammar, improve flow and tone |

**AI may NOT:**
- Invent experience, skills, jobs, companies, or technologies
- Fabricate achievements or education
- Add claimed skills without evidence

### 7.8 Manual Editor

**Allow users to:**

| Action | Description |
|--------|-------------|
| Add | Add new sections or bullets |
| Edit | Modify existing content |
| Delete | Remove sections or bullets |
| Reorder | Change section order |
| Accept AI suggestion | Keep AI-generated improvement |
| Reject AI suggestion | Remove AI-generated improvement |
| Undo/Redo | Revert/redo last changes |

### 7.9 Templates

**Provide ATS-safe templates:**

| Template | Description |
|----------|-------------|
| Template 1 | Clean, minimal layout with standard sections |
| Template 2 | Technical resume format with skills emphasis |
| Template 3 | Creative format for portfolios (limited use) |

*Minimum 2, maximum 3 templates for MVP.*

### 7.10 Export

**Support export formats:**

| Format | Details |
|--------|---------|
| PDF | ATS-optimized PDF with preserved formatting |
| DOCX | Microsoft Word format for further editing |

### 7.11 Version History

**Allow users to retain:**

| Version type | Description |
|--------------|-------------|
| Original resume | The uploaded, unmodified resume |
| Generated resume | First AI-generated version |
| Edited versions | User-modified versions with timestamps |

*Users can switch between versions and restore any previous version.*

---

## 8. MVP Scope

### Must Have

- Resume upload (PDF, DOCX)
- Job description input (paste, PDF, DOCX)
- Resume parsing and structured extraction
- Job description parsing and analysis
- Resume/JD matching and keyword analysis
- ATS Compatibility Score with explanation
- AI optimization (summary, bullets, skills)
- Manual editor with accept/reject
- 2 ATS-safe templates
- PDF export
- DOCX export
- Version history (original + generated + edited)
- User authentication (register/login)
- Dashboard/overview screen

### Should Have

- AI suggestions per section (summary, experience, skills)
- Advanced synonym/acronym matching
- Real-time ATS analysis while editing
- Template selection UI
- Preview mode before export
- Email notifications

### Future

- Cover letter generation
- Job tracker
- Interview preparation
- Job board integrations
- LinkedIn integrations
- Multiple resume profiles
- Analytics dashboard
- Team/collaboration features

---

## 9. User Stories

| ID | User Story |
|----|-----------|
| US-001 | As a job seeker, I want to upload my resume so that the system can analyze my existing experience. |
| US-002 | As a job seeker, I want to provide a Job Description so that I can tailor my resume to a specific role. |
| US-003 | As a user, I want to see matched keywords so that I can understand which of my skills are relevant to the role. |
| US-004 | As a user, I want to see missing keywords so that I can decide whether I genuinely have those skills. |
| US-005 | As a user, I want to manually edit AI-generated content so that I remain in control of my resume. |
| US-006 | As a user, I want to accept or reject AI suggestions so that I can customize the output. |
| US-007 | As a user, I want to see an ATS compatibility score so that I know how well my resume matches the job. |
| US-008 | As a user, I want to download my resume in PDF format so that I can apply for jobs. |
| US-009 | As a user, I want to download my resume in DOCX format so that I can further edit it. |
| US-010 | As a user, I want to view my resume version history so that I can restore previous versions. |

---

## 10. Success Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Resume processing success rate | Percentage of uploaded resumes that are successfully parsed and extracted | ≥ 90% |
| JD parsing success rate | Percentage of job descriptions successfully parsed into structured data | ≥ 85% |
| AI generation success rate | Percentage of AI generation requests that complete without error | ≥ 80% |
| Average generation time | Mean time from analysis completion to generated resume ready | ≤ 60 seconds |
| Export success rate | Percentage of export attempts that complete successfully (PDF/DOCX) | ≥ 95% |
| User editing completion rate | Percentage of AI suggestions that users actively accept, reject, or edit | ≥ 70% |
| Resume optimization acceptance rate | Percentage of generated resumes that users keep (after editing) rather than starting over | ≥ 60% |
| Error rate | Number of unhandled errors per 100 user operations | ≤ 5% |
| User satisfaction score | Post-interview survey score (1-5) | ≥ 4.0 |

---

## 11. Assumptions

- Users have access to either PDF or DOCX versions of their resumes
- Job descriptions are provided in English (MVP language)
- Users can accurately describe their own experience
- AI providers (OpenAI, Anthropic, Gemini) have consistent API availability
- Users have basic digital literacy to upload files and use web forms
- Uploaded documents are not heavily encrypted or protected

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| AI hallucination | Implement factuality safeguards; never add skills without evidence; show "Missing/ Potential Keyword" with disclaimer |
| Incorrect keyword interpretation | Use hybrid matching (exact + normalized + synonym); allow user verification |
| PDF parsing failures | Handle image-only PDFs gracefully; provide fallback error messages |
| Poor formatting | Parse structured sections; warn about unusual formats |
| Incorrect ATS scoring | Clearly explain scoring methodology; do not claim specific ATS vendor accuracy |
| LLM API failures | Implement timeout handling; show graceful degradation; use error boundaries |
| Privacy concerns | Do not store document content longer than necessary; provide delete functionality |
| Large file uploads | Enforce 10MB size limit; show progress; reject oversized files |
| Prompt injection inside uploaded documents | Treat all document content as untrusted; sanitize before processing; do not trust document content to override system instructions |

---

## 13. Out of Scope

For MVP explicitly exclude:

- Automatic job applications
- LinkedIn automation
- Web scraping
- Recruiter marketplace
- Interview platform
- Social networking
- Payroll
- Recruitment management system
- Cover letter generation
- Job board integrations
- Multiple profile management
- Analytics/dashboard beyond basic metrics

---

## 14. Acceptance Criteria

| Feature | Acceptance Criteria |
|---------|---------------------|
| Resume upload | User can upload PDF or DOCX file ≤ 10MB; system parses and extracts structured data; error displayed for invalid/unsupported files |
| JD input | User can paste text or upload PDF/DOCX; system extracts job title, skills, responsibilities; error for empty JD |
| Resume parsing | System extracts: contact info, summary, skills, experience, education, projects, certifications, achievements; ≥ 90% extraction success rate |
| JD parsing | System extracts: job title, required skills, preferred skills, responsibilities, qualifications, experience requirements, tools, technologies, domain keywords, soft skills; ≥ 85% success rate |
| Resume/JD matching | System shows matched skills, missing skills, keyword coverage percentage, experience relevance, responsibility relevance; all categories displayed |
| ATS score | System calculates score 0-100 with breakdown by category; score labeled "ResumeForge ATS Compatibility Score"; methodology explained |
| AI optimization | AI rewrites existing content (not fabricates); preserves factual accuracy; user can accept/reject each suggestion |
| Manual editor | User can add/edit/delete sections and bullets; undo/redo available; changes saved to version history |
| PDF export | Exported PDF preserves formatted sections; text is selectable; ATS-friendly layout; file downloads successfully |
| DOCX export | Exported DOCX preserves formatted sections; compatible with Microsoft Word; file downloads successfully |
| Version history | Original resume preserved separately; generated versions tracked with timestamps; user can restore previous versions |
| Authentication | Registration/login works; protected routes require valid auth; password hashed securely |
| Error handling | User-friendly error messages for upload failure, parsing failure, AI failure, export failure; no stack traces shown to users |

---
