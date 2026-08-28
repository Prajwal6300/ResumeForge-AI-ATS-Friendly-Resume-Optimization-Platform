"use client";

import Link from "next/link";
import {
  FileText,
  Briefcase,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  ChevronRight,
  UploadCloud,
  FileCheck,
} from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth-context";
import { useResumes } from "@/hooks/use-resumes";
import { useJobDescriptions } from "@/hooks/use-job-descriptions";
import { useAnalyses } from "@/hooks/use-analyses";
import { formatDate, getScoreColor, getScoreBgColor } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { resumes, isLoading: loadingResumes } = useResumes();
  const { jobDescriptions, isLoading: loadingJDs } = useJobDescriptions();
  const { analyses, isLoading: loadingAnalyses } = useAnalyses();

  const avgScore =
    analyses.length > 0
      ? (analyses.reduce((acc, a) => acc + a.overall_score, 0) / analyses.length).toFixed(0)
      : "0";

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8 animate-fade-in">
        {/* Welcome Command Header */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-indigo-50/30 dark:to-indigo-950/20 p-6 sm:p-8 shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Career Optimization Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {user?.full_name || "Job Seeker"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Track ATS compatibility across applications, eliminate keyword gaps, and tailor factual achievements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href="/resumes/new">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Resume</span>
                </Button>
              </Link>
              <Link href="/job-descriptions/new">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Add Target JD</span>
                </Button>
              </Link>
              <Link href="/analysis/new">
                <Button size="sm" variant="gradient" className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Run ATS Match</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-primary/40 hover:shadow-card transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Active Resumes</p>
                <h3 className="text-2xl font-extrabold text-foreground">{resumes.length}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-primary shadow-subtle">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 hover:shadow-card transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Target JDs</p>
                <h3 className="text-2xl font-extrabold text-foreground">{jobDescriptions.length}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-violet-50 dark:bg-violet-950 border border-violet-200/80 dark:border-violet-800 flex items-center justify-center text-violet-600 shadow-subtle">
                <Briefcase className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 hover:shadow-card transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ATS Analyses</p>
                <h3 className="text-2xl font-extrabold text-foreground">{analyses.length}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200/80 dark:border-teal-800 flex items-center justify-center text-teal-600 shadow-subtle">
                <Sparkles className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 hover:shadow-card transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg ATS Score</p>
                <h3 className={`text-2xl font-extrabold ${getScoreColor(Number(avgScore))}`}>
                  {avgScore}%
                </h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shadow-subtle">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Grid: Recent Reports & Resumes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent ATS Matches */}
          <Card className="flex flex-col border border-border/80 shadow-subtle">
            <CardHeader className="p-5 sm:p-6 pb-3 flex flex-row items-center justify-between border-b border-border/60">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Recent ATS Analysis Reports</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  5-pillar compatibility scores and keyword gap audits.
                </CardDescription>
              </div>
              <Link href="/analysis/new">
                <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold gap-1 h-7">
                  <span>New Match</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-4 flex-1">
              {loadingAnalyses ? (
                <div className="space-y-2.5 py-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
                  ))}
                </div>
              ) : analyses.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No ATS Analyses Yet"
                  description="Match your resume against a target job description to calculate your 5-pillar ATS score."
                  actionLabel="Run ATS Match"
                  actionHref="/analysis/new"
                  actionIcon={Sparkles}
                  className="my-2"
                />
              ) : (
                <div className="space-y-2.5">
                  {analyses.slice(0, 4).map((a) => (
                    <Link
                      key={a.id}
                      href={`/analysis/${a.id}`}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all shadow-subtle"
                    >
                      <div className="space-y-0.5 min-w-0 pr-3">
                        <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate block">
                          Report #{a.id.slice(0, 8)}
                        </span>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {formatDate(a.created_at)} &bull; {a.matched_keywords.length} matched, {a.missing_keywords.length} missing
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`font-black text-xs px-2.5 py-0.5 border ${getScoreBgColor(a.overall_score)}`}
                        >
                          {a.overall_score.toFixed(0)}% ATS
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Resumes */}
          <Card className="flex flex-col border border-border/80 shadow-subtle">
            <CardHeader className="p-5 sm:p-6 pb-3 flex flex-row items-center justify-between border-b border-border/60">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>My Resumes</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Manage versions and tailored profiles.
                </CardDescription>
              </div>
              <Link href="/resumes">
                <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold gap-1 h-7">
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-4 flex-1">
              {loadingResumes ? (
                <div className="space-y-2.5 py-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No Resumes Uploaded"
                  description="Upload your PDF or Word DOCX resume to start tailoring."
                  actionLabel="Upload Resume"
                  actionHref="/resumes/new"
                  actionIcon={UploadCloud}
                  className="my-2"
                />
              ) : (
                <div className="space-y-2.5">
                  {resumes.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl border border-border/70 bg-card flex items-center justify-between gap-3 shadow-subtle hover:border-primary/40 transition-all"
                    >
                      <div className="truncate">
                        <Link href={`/resumes/${r.id}`} className="font-bold text-xs text-foreground hover:text-primary hover:underline truncate block">
                          {r.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Updated {formatDate(r.updated_at)} &bull; {r.version_count || 1} Version{(r.version_count || 1) > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link href={`/resumes/${r.id}/edit`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 font-semibold">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/analysis/new?resume_id=${r.id}`}>
                          <Button size="sm" variant="secondary" className="h-7 text-xs px-2.5 font-semibold text-primary bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
                            Match
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
