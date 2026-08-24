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
} from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {user?.full_name || "Job Seeker"}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Your ATS optimization command center. Track resumes, match job descriptions, and optimize keywords.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/resumes/new">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" />
                <span>Upload Resume</span>
              </Button>
            </Link>
            <Link href="/job-descriptions/new">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Briefcase className="h-4 w-4" />
                <span>Add Target JD</span>
              </Button>
            </Link>
            <Link href="/analysis/new">
              <Button variant="gradient" size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>Run ATS Match</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Resumes</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{resumes.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target JDs</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{jobDescriptions.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <Briefcase className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ATS Analyses</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{analyses.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                <Sparkles className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg ATS Score</p>
                <h3 className={`text-2xl font-bold mt-1 ${getScoreColor(Number(avgScore))}`}>
                  {avgScore}%
                </h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses & Resumes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent ATS Matches */}
          <Card className="flex flex-col">
            <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Recent ATS Analysis Reports</span>
                </CardTitle>
                <CardDescription className="text-xs">Your latest resume vs JD compatibility runs.</CardDescription>
              </div>
              <Link href="/analysis/new">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  <span>New</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-6 pt-0 flex-1">
              {loadingAnalyses ? (
                <p className="text-xs text-muted-foreground py-4">Loading reports...</p>
              ) : analyses.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed text-center space-y-2 my-2">
                  <p className="text-xs text-muted-foreground">No ATS analyses run yet.</p>
                  <Link href="/analysis/new">
                    <Button size="sm" variant="outline" className="text-xs">
                      Run Your First ATS Match
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyses.slice(0, 4).map((a) => (
                    <Link
                      key={a.id}
                      href={`/analysis/${a.id}`}
                      className="block p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-xs text-foreground">
                            Analysis #{a.id.slice(0, 8)}
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            {formatDate(a.created_at)} &bull; {a.matched_keywords.length} matched, {a.missing_keywords.length} missing
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`font-bold text-xs border ${getScoreBgColor(a.overall_score)}`}
                        >
                          {a.overall_score.toFixed(0)}% ATS
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Resumes */}
          <Card className="flex flex-col">
            <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>My Resumes</span>
                </CardTitle>
                <CardDescription className="text-xs">Manage versions and tailored profiles.</CardDescription>
              </div>
              <Link href="/resumes">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-6 pt-0 flex-1">
              {loadingResumes ? (
                <p className="text-xs text-muted-foreground py-4">Loading resumes...</p>
              ) : resumes.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed text-center space-y-2 my-2">
                  <p className="text-xs text-muted-foreground">No resumes uploaded yet.</p>
                  <Link href="/resumes/new">
                    <Button size="sm" variant="outline" className="text-xs">
                      Upload PDF/DOCX Resume
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between gap-3"
                    >
                      <div className="truncate">
                        <Link href={`/resumes/${r.id}`} className="font-semibold text-xs text-foreground hover:underline truncate block">
                          {r.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          Updated {formatDate(r.updated_at)} &bull; {r.file_type || "manual"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link href={`/resumes/${r.id}/edit`}>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] px-2">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/analysis/new?resume_id=${r.id}`}>
                          <Button size="sm" variant="secondary" className="h-7 text-[11px] px-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
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
