"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, FileText, Briefcase, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AntiFabricationBanner } from "@/components/analysis/anti-fabrication-banner";
import { useResumes } from "@/hooks/use-resumes";
import { useJobDescriptions } from "@/hooks/use-job-descriptions";
import { useAnalyses } from "@/hooks/use-analyses";

function NewAnalysisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialResumeId = searchParams.get("resume_id") || "";
  const initialJDId = searchParams.get("jd_id") || "";

  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [selectedJDId, setSelectedJDId] = useState(initialJDId);
  const [error, setError] = useState<string | null>(null);

  const { resumes, isLoading: loadingResumes } = useResumes();
  const { jobDescriptions, isLoading: loadingJDs } = useJobDescriptions();
  const { runAnalysis, isAnalyzing } = useAnalyses();

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  useEffect(() => {
    if (!selectedJDId && jobDescriptions.length > 0) {
      setSelectedJDId(jobDescriptions[0].id);
    }
  }, [jobDescriptions, selectedJDId]);

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedResumeId || !selectedJDId) {
      setError("Please select both a candidate resume and a target job description.");
      return;
    }

    try {
      const result = await runAnalysis({
        resume_id: selectedResumeId,
        jd_id: selectedJDId,
      });
      router.push(`/analysis/${result.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to calculate ATS score.");
    }
  };

  return (
    <form onSubmit={handleRunMatch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Select Resume */}
        <Card className="border border-border/80 shadow-dropdown bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>1. Select Resume Profile</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                Step 1
              </Badge>
            </div>
            <CardDescription className="text-xs">Choose the resume to evaluate.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-3">
            {loadingResumes ? (
              <div className="space-y-2 py-2">
                {[1, 2].map((n) => (
                  <div key={n} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-muted-foreground">No resumes uploaded yet.</p>
                <Link href="/resumes/new">
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 font-semibold">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Resume First</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {resumes.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedResumeId === r.id
                        ? "border-primary bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-primary shadow-subtle"
                        : "border-border/70 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resume_select"
                      value={r.id}
                      checked={selectedResumeId === r.id}
                      onChange={() => setSelectedResumeId(r.id)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <div className="truncate min-w-0">
                      <p className="font-bold text-xs truncate text-foreground">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {r.parsed_content?.experience?.length || 0} roles &bull; {r.parsed_content?.skills?.length || 0} skill categories
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Select Job Description */}
        <Card className="border border-border/80 shadow-dropdown bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-600" />
                <span>2. Select Target Job</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                Step 2
              </Badge>
            </div>
            <CardDescription className="text-xs">Choose the target job posting.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-3">
            {loadingJDs ? (
              <div className="space-y-2 py-2">
                {[1, 2].map((n) => (
                  <div key={n} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
                ))}
              </div>
            ) : jobDescriptions.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-muted-foreground">No job descriptions saved yet.</p>
                <Link href="/job-descriptions/new">
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 font-semibold">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Target Job First</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {jobDescriptions.map((jd) => (
                  <label
                    key={jd.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedJDId === jd.id
                        ? "border-violet-600 bg-violet-50/40 dark:bg-violet-950/30 ring-1 ring-violet-600 shadow-subtle"
                        : "border-border/70 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="jd_select"
                      value={jd.id}
                      checked={selectedJDId === jd.id}
                      onChange={() => setSelectedJDId(jd.id)}
                      className="mt-0.5 accent-violet-600"
                    />
                    <div className="truncate min-w-0">
                      <p className="font-bold text-xs truncate text-foreground">{jd.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {jd.company || "Target Company"} &bull; {jd.structured_content?.required_skills?.length || 0} required skills
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isAnalyzing || !selectedResumeId || !selectedJDId}
        size="lg"
        variant="gradient"
        className="w-full h-12 gap-2 font-bold text-sm shadow-card hover:shadow-glow"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Calculating Deterministic 5-Pillar Score...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Run ATS Match & Generate Gap Audit</span>
          </>
        )}
      </Button>
    </form>
  );
}

export default function NewAnalysisPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Run ATS Resume Compatibility Match</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pair your candidate resume with a target job description to compute explainable 5-pillar compatibility.
          </p>
        </div>

        <AntiFabricationBanner />

        <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
          <NewAnalysisForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
