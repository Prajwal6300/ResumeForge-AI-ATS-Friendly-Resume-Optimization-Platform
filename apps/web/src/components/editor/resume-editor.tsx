"use client";

import React, { useState } from "react";
import {
  Save,
  Sparkles,
  Eye,
  History,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  FileText,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  FolderGit2,
  Layers,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BulletEditor } from "@/components/editor/bullet-editor";
import { VersionHistoryDrawer } from "@/components/editor/version-history-drawer";
import { AISuggestionsPanel } from "@/components/editor/ai-suggestions-panel";
import { TemplatePreviewModal } from "@/components/editor/template-preview-modal";
import { useOptimization } from "@/hooks/use-optimization";
import { useJobDescriptions } from "@/hooks/use-job-descriptions";
import { Resume, ResumeVersion, StructuredResumeContent } from "@/types";

interface ResumeEditorProps {
  resume: Resume;
  versions: ResumeVersion[];
  onSave: (payload: { parsed_content: StructuredResumeContent; title?: string; change_summary?: string }) => Promise<any>;
  onRestoreVersion: (versionId: string) => Promise<any>;
  isSaving?: boolean;
}

export function ResumeEditor({
  resume,
  versions,
  onSave,
  onRestoreVersion,
  isSaving = false,
}: ResumeEditorProps) {
  const [content, setContent] = useState<StructuredResumeContent>(resume.parsed_content);
  const [title, setTitle] = useState(resume.title);
  const [changeSummary, setChangeSummary] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedJDId, setSelectedJDId] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { jobDescriptions } = useJobDescriptions();
  const {
    suggestions,
    improveSection,
    isImprovingSection,
    rewriteBullet,
    isRewritingBullet,
    updateSuggestionStatus,
  } = useOptimization(resume.id);

  const handleSave = async () => {
    try {
      await onSave({
        parsed_content: content,
        title,
        change_summary: changeSummary.trim() || undefined,
      });
      setChangeSummary("");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  // Helper mutators
  const updatePersonal = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSummary = (value: string) => {
    setContent((prev) => ({ ...prev, summary: value }));
  };

  // AI Improve Section Handler
  const handleAIImproveSummary = async () => {
    try {
      const res = await improveSection({
        resume_id: resume.id,
        section: "summary",
        current_content: content.summary,
        jd_id: selectedJDId || undefined,
        goal: "impact",
      });
      if (res.improved_text) {
        setContent((prev) => ({ ...prev, summary: res.improved_text }));
      }
    } catch (e: any) {
      alert(e.message || "Failed to improve summary");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Command Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card shadow-dropdown">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary shrink-0 shadow-subtle">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-extrabold text-sm sm:text-base h-8 px-2 py-0 max-w-sm border-transparent hover:border-border/80 focus:border-primary transition-colors"
            />
            <p className="text-[11px] text-muted-foreground pl-2">
              Live Document Editor &bull; Immutable Version History
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Target JD Selector for Contextual AI */}
          {jobDescriptions.length > 0 && (
            <select
              value={selectedJDId}
              onChange={(e) => setSelectedJDId(e.target.value)}
              aria-label="Align AI with Target JD"
              className="h-9 text-xs font-semibold rounded-xl border border-border/80 bg-background px-3 py-1 text-foreground shadow-subtle focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="">Align with Target JD...</option>
              {jobDescriptions.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title} ({jd.company || "Target"})
                </option>
              ))}
            </select>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`gap-1.5 text-xs h-9 font-semibold shadow-subtle ${showSuggestions ? "border-primary bg-primary/5 text-primary" : ""}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AI Suggestions</span>
            {suggestions.filter((s) => s.status === "pending").length > 0 && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 font-bold">
                {suggestions.filter((s) => s.status === "pending").length}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className={`gap-1.5 text-xs h-9 font-semibold shadow-subtle ${showHistory ? "border-primary bg-primary/5 text-primary" : ""}`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Versions ({versions.length})</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreviewModal(true)}
            className="gap-1.5 text-xs h-9 font-semibold shadow-subtle"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview & Export</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="gradient"
            size="sm"
            className="gap-1.5 text-xs h-9 font-bold shadow-subtle hover:shadow-glow"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Saved Version!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save New Version</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Editor Tabs + Sidebar Drawers */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor Main Content */}
        <div className={`space-y-6 ${showHistory || showSuggestions ? "lg:col-span-3" : "lg:col-span-4"}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full h-auto p-1.5 gap-1.5 bg-muted/50 rounded-2xl border border-border/60">
              <TabsTrigger value="personal" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <UserIcon className="h-3.5 w-3.5" />
                <span>Personal</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <FileText className="h-3.5 w-3.5" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <Code2 className="h-3.5 w-3.5" />
                <span>Skills</span>
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Experience</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs font-bold py-2 gap-1.5 rounded-xl">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Education</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Personal Details */}
            <TabsContent value="personal" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 border-b border-border/60">
                  <CardTitle className="text-base sm:text-lg font-bold">Contact & Header Information</CardTitle>
                  <CardDescription className="text-xs">
                    Standard single-line ATS contact format for optimal parsing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Full Name</label>
                      <Input
                        value={content.personal.name || ""}
                        onChange={(e) => updatePersonal("name", e.target.value)}
                        placeholder="Alex Mercer"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Professional Title</label>
                      <Input
                        value={content.personal.title || ""}
                        onChange={(e) => updatePersonal("title", e.target.value)}
                        placeholder="Senior Full-Stack Engineer"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Email Address</label>
                      <Input
                        type="email"
                        value={content.personal.email || ""}
                        onChange={(e) => updatePersonal("email", e.target.value)}
                        placeholder="alex@example.com"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Phone Number</label>
                      <Input
                        value={content.personal.phone || ""}
                        onChange={(e) => updatePersonal("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Location (City, State / Country)</label>
                      <Input
                        value={content.personal.location || ""}
                        onChange={(e) => updatePersonal("location", e.target.value)}
                        placeholder="San Francisco, CA"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">LinkedIn URL</label>
                      <Input
                        value={content.personal.linkedin || ""}
                        onChange={(e) => updatePersonal("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/alexmercer"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">GitHub URL</label>
                      <Input
                        value={content.personal.github || ""}
                        onChange={(e) => updatePersonal("github", e.target.value)}
                        placeholder="https://github.com/alexmercer"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Portfolio Website</label>
                      <Input
                        value={content.personal.website || ""}
                        onChange={(e) => updatePersonal("website", e.target.value)}
                        placeholder="https://alexmercer.dev"
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Summary */}
            <TabsContent value="summary" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/60">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold">Professional Summary</CardTitle>
                    <CardDescription className="text-xs">
                      2-3 concise lines describing your core expertise and quantifiable value proposition.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isImprovingSection || !content.summary}
                    onClick={handleAIImproveSummary}
                    className="gap-1.5 text-xs text-primary font-bold shadow-subtle border-primary/30 hover:bg-primary/10"
                  >
                    {isImprovingSection ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    <span>AI Enhance Summary</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <Textarea
                    rows={5}
                    value={content.summary || ""}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Performance-driven Full-Stack Engineer with 5+ years of experience..."
                    className="text-xs sm:text-sm leading-relaxed"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Skills */}
            <TabsContent value="skills" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/60">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold">Technical Skills</CardTitle>
                    <CardDescription className="text-xs">
                      Organized by category for clean ATS scanning.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        skills: [...prev.skills, { category: "New Category", items: ["Skill1", "Skill2"] }],
                      }));
                    }}
                    className="gap-1.5 text-xs font-semibold shadow-subtle"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Category</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {content.skills?.map((cat, catIdx) => (
                    <div key={catIdx} className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-3 shadow-subtle">
                      <div className="flex items-center justify-between gap-3">
                        <Input
                          value={cat.category}
                          onChange={(e) => {
                            const updated = [...content.skills];
                            updated[catIdx].category = e.target.value;
                            setContent((prev) => ({ ...prev, skills: updated }));
                          }}
                          className="h-8 font-bold text-xs max-w-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = content.skills.filter((_, i) => i !== catIdx);
                            setContent((prev) => ({ ...prev, skills: updated }));
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground">Skills (Comma-separated):</label>
                        <Input
                          value={cat.items.join(", ")}
                          onChange={(e) => {
                            const updated = [...content.skills];
                            updated[catIdx].items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            setContent((prev) => ({ ...prev, skills: updated }));
                          }}
                          placeholder="e.g. Python, FastAPI, React, PostgreSQL"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Experience */}
            <TabsContent value="experience" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/60">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold">Work Experience</CardTitle>
                    <CardDescription className="text-xs">
                      Chronological roles with achievement-driven bullet points.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        experience: [
                          {
                            id: Math.random().toString(),
                            company: "Company Name",
                            position: "Software Engineer",
                            start_date: "Jan 2023",
                            end_date: "Present",
                            is_current: true,
                            highlights: ["Architected microservices improving system throughput by 30%."],
                          },
                          ...prev.experience,
                        ],
                      }));
                    }}
                    className="gap-1.5 text-xs font-semibold shadow-subtle"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Position</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {content.experience?.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-4 shadow-subtle">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground">Position Title</label>
                            <Input
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...content.experience];
                                updated[expIdx].position = e.target.value;
                                setContent((prev) => ({ ...prev, experience: updated }));
                              }}
                              className="h-9 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground">Company</label>
                            <Input
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...content.experience];
                                updated[expIdx].company = e.target.value;
                                setContent((prev) => ({ ...prev, experience: updated }));
                              }}
                              className="h-9 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-foreground">Dates</label>
                            <Input
                              value={exp.start_date + (exp.end_date ? ` – ${exp.end_date}` : "")}
                              onChange={(e) => {
                                const updated = [...content.experience];
                                updated[expIdx].start_date = e.target.value;
                                setContent((prev) => ({ ...prev, experience: updated }));
                              }}
                              placeholder="Jan 2022 – Present"
                              className="h-9 text-xs"
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = content.experience.filter((_, i) => i !== expIdx);
                            setContent((prev) => ({ ...prev, experience: updated }));
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg shrink-0 mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-3 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Key Achievements & Bullets:
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = [...content.experience];
                              updated[expIdx].highlights.push("Engineered new feature delivering quantifiable business impact.");
                              setContent((prev) => ({ ...prev, experience: updated }));
                            }}
                            className="h-7 text-xs text-primary font-bold gap-1 hover:bg-primary/10"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Bullet</span>
                          </Button>
                        </div>

                        <div className="space-y-2.5">
                          {exp.highlights.map((hl, hlIdx) => (
                            <BulletEditor
                              key={hlIdx}
                              bullet={hl}
                              onChange={(newVal) => {
                                const updated = [...content.experience];
                                updated[expIdx].highlights[hlIdx] = newVal;
                                setContent((prev) => ({ ...prev, experience: updated }));
                              }}
                              onDelete={() => {
                                const updated = [...content.experience];
                                updated[expIdx].highlights = updated[expIdx].highlights.filter((_, i) => i !== hlIdx);
                                setContent((prev) => ({ ...prev, experience: updated }));
                              }}
                              onRewriteAI={(bullet, goal) =>
                                rewriteBullet({
                                  resume_id: resume.id,
                                  original_bullet: bullet,
                                  jd_id: selectedJDId || undefined,
                                  goal,
                                })
                              }
                              isRewriting={isRewritingBullet}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: Projects */}
            <TabsContent value="projects" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/60">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold">Technical Projects</CardTitle>
                    <CardDescription className="text-xs">
                      Key engineering projects showcasing real-world technical implementation.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        projects: [
                          {
                            id: Math.random().toString(),
                            title: "New Technical Project",
                            technologies: ["React", "FastAPI"],
                            description: "Full stack web platform",
                            highlights: ["Architected microservices backend with real-time updates."],
                          },
                          ...prev.projects,
                        ],
                      }));
                    }}
                    className="gap-1.5 text-xs font-semibold shadow-subtle"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {content.projects?.map((proj, projIdx) => (
                    <div key={proj.id || projIdx} className="p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-3 shadow-subtle">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <Input
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...content.projects];
                              updated[projIdx].title = e.target.value;
                              setContent((prev) => ({ ...prev, projects: updated }));
                            }}
                            placeholder="Project Title"
                            className="h-9 text-xs font-bold"
                          />
                          <Input
                            value={proj.technologies.join(", ")}
                            onChange={(e) => {
                              const updated = [...content.projects];
                              updated[projIdx].technologies = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                              setContent((prev) => ({ ...prev, projects: updated }));
                            }}
                            placeholder="Technologies (e.g. Next.js, Python, AWS)"
                            className="h-9 text-xs"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = content.projects.filter((_, i) => i !== projIdx);
                            setContent((prev) => ({ ...prev, projects: updated }));
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        {proj.highlights?.map((hl, hlIdx) => (
                          <BulletEditor
                            key={hlIdx}
                            bullet={hl}
                            onChange={(newVal) => {
                              const updated = [...content.projects];
                              updated[projIdx].highlights[hlIdx] = newVal;
                              setContent((prev) => ({ ...prev, projects: updated }));
                            }}
                            onDelete={() => {
                              const updated = [...content.projects];
                              updated[projIdx].highlights = updated[projIdx].highlights.filter((_, i) => i !== hlIdx);
                              setContent((prev) => ({ ...prev, projects: updated }));
                            }}
                            onRewriteAI={(bullet, goal) =>
                              rewriteBullet({
                                resume_id: resume.id,
                                original_bullet: bullet,
                                jd_id: selectedJDId || undefined,
                                goal,
                              })
                            }
                            isRewriting={isRewritingBullet}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 6: Education */}
            <TabsContent value="education" className="mt-4">
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/60">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold">Education</CardTitle>
                    <CardDescription className="text-xs">
                      Degrees, institutions, graduation dates, and GPA.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        education: [
                          {
                            id: Math.random().toString(),
                            degree: "Bachelor of Science in Computer Science",
                            institution: "University Name",
                            start_date: "2018",
                            end_date: "2022",
                            gpa: "3.8/4.0",
                            honors: [],
                          },
                          ...prev.education,
                        ],
                      }));
                    }}
                    className="gap-1.5 text-xs font-semibold shadow-subtle"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Degree</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {content.education?.map((edu, eduIdx) => (
                    <div key={edu.id || eduIdx} className="p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-3 shadow-subtle">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[eduIdx].degree = e.target.value;
                              setContent((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Degree"
                            className="h-9 text-xs font-bold"
                          />
                          <Input
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[eduIdx].institution = e.target.value;
                              setContent((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="University / College"
                            className="h-9 text-xs"
                          />
                          <Input
                            value={edu.gpa || ""}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[eduIdx].gpa = e.target.value;
                              setContent((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="GPA (e.g. 3.8/4.0)"
                            className="h-9 text-xs"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = content.education.filter((_, i) => i !== eduIdx);
                            setContent((prev) => ({ ...prev, education: updated }));
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Drawer / Sidebar */}
        {(showHistory || showSuggestions) && (
          <div className="lg:col-span-1 space-y-4">
            {showHistory && (
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardContent className="p-4 sm:p-5">
                  <VersionHistoryDrawer
                    versions={versions}
                    onRestore={onRestoreVersion}
                  />
                </CardContent>
              </Card>
            )}

            {showSuggestions && (
              <Card className="border border-border/80 shadow-dropdown bg-card">
                <CardContent className="p-4 sm:p-5">
                  <AISuggestionsPanel
                    suggestions={suggestions}
                    onUpdateStatus={async (suggestionId, status) => {
                      await updateSuggestionStatus({ suggestionId, status });
                    }}
                    onApplyText={(section, suggestedText) => {
                      if (section === "summary") {
                        setContent((prev) => ({ ...prev, summary: suggestedText }));
                      }
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Template Preview & Export Modal */}
      <TemplatePreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        resumeId={resume.id}
      />
    </div>
  );
}
