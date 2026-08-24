/**
 * ResumeForge AI - Shared TypeScript Types and Interfaces
 * Canonical domain definitions across Web Client and API.
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  title?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  honors?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  url?: string;
  description?: string;
  technologies: string[];
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date?: string;
  description: string;
}

export interface StructuredResumeContent {
  personal: PersonalInfo;
  summary: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  custom_sections?: Array<{
    id: string;
    heading: string;
    items: string[];
  }>;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  original_filename?: string;
  file_url?: string;
  parsed_content: StructuredResumeContent;
  raw_text?: string;
  created_at: string;
  updated_at: string;
  current_version_id?: string;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  title: string;
  content: StructuredResumeContent;
  change_summary?: string;
  is_current: boolean;
  created_at: string;
}

export interface JobDescriptionStructured {
  job_title: string;
  company?: string;
  location?: string;
  experience_level?: string;
  years_of_experience?: string;
  required_skills: string[];
  preferred_skills: string[];
  responsibilities: string[];
  qualifications: string[];
  technologies: string[];
  soft_skills: string[];
  keywords: string[];
  domain_keywords: string[];
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company?: string;
  raw_text: string;
  structured_content: JobDescriptionStructured;
  created_at: string;
  updated_at: string;
}

export interface ScoreCategory {
  score: number;
  weight: number;
  weighted_score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ATSScoreBreakdown {
  keyword_relevance: ScoreCategory;
  technical_skills: ScoreCategory;
  responsibilities: ScoreCategory;
  experience_relevance: ScoreCategory;
  resume_structure: ScoreCategory;
}

export interface KeywordMatchDetail {
  keyword: string;
  category: 'technical' | 'soft' | 'domain' | 'general';
  importance: 'required' | 'preferred' | 'bonus';
  found_in_resume: boolean;
  frequency_in_jd: number;
  context?: string;
}

export interface ATSRecommendation {
  id: string;
  category: 'keyword' | 'experience' | 'structure' | 'impact' | 'formatting';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable_step: string;
  disclaimer?: string;
}

export interface ResumeAnalysis {
  id: string;
  user_id: string;
  resume_id: string;
  resume_version_id?: string;
  jd_id: string;
  overall_score: number;
  breakdown: ATSScoreBreakdown;
  matched_keywords: string[];
  missing_keywords: string[];
  weak_keywords: string[];
  keyword_details?: KeywordMatchDetail[];
  recommendations: ATSRecommendation[];
  summary_critique?: string;
  created_at: string;
}

export type AISuggestionStatus = 'pending' | 'accepted' | 'rejected';

export interface AISuggestion {
  id: string;
  user_id: string;
  resume_id: string;
  resume_version_id?: string;
  analysis_id?: string;
  section: string;
  item_id?: string;
  field?: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  status: AISuggestionStatus;
  created_at: string;
}

export type TemplateId = 'classic' | 'professional' | 'modern' | 'minimal';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  ats_score_rating: string;
  preview_image?: string;
  color_scheme: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export interface ExportRequest {
  resume_id: string;
  version_id?: string;
  format: 'pdf' | 'docx';
  template: TemplateId;
}

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
    request_id?: string;
  };
}
