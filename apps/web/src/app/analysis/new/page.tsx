"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, FileText, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      setError("Please select both a resume and a target job description.");
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
        <Card className="border-2 hover:border-primary/40 transition-colors">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>1. Select Resume</span>
            </CardTitle>
            <CardDescription className="text-xs">Choose the resume profile to evaluate.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {loadingResumes ? (
              <p className="text-xs text-muted-foreground">Loading resumes...</p>
            ) : resumes.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-muted-foreground">No resumes found.</p>
                <Link href="/resumes/new">
                  <Button size="sm" variant="outline" className="text-xs">Upload Resume First</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {resumes.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedResumeId === r.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resume_select"
                      value={r.id}
                      checked={selectedResumeId === r.id}
                      onChange={() => setSelectedResumeId(r.id)}
                      className="mt-1"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-xs truncate">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground">
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
        <Card className="border-2 hover:border-indigo-500/40 transition-colors">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              <span>2. Select Target Job Description</span>
            </CardTitle>
            <CardDescription className="text-xs">Choose the role you are applying for.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {loadingJDs ? (
              <p className="text-xs text-muted-foreground">Loading job descriptions...</p>
            ) : jobDescriptions.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-muted-foreground">No job descriptions saved.</p>
                <Link href="/job-descriptions/new">
                  <Button size="sm" variant="outline" className="text-xs">Add Job Description First</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {jobDescriptions.map((jd) => (
                  <label
                    key={jd.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedJDId === jd.id
                        ? "border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="jd_select"
                      value={jd.id}
                      checked={selectedJDId === jd.id}
                      onChange={() => setSelectedJDId(jd.id)}
                      className="mt-1"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-xs truncate">{jd.title}</p>
                      <p className="text-[11px] text-muted-foreground">
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

      {error && <p className="text-xs text-destructive text-center font-medium">{error}</p>}

      <Button
        type="submit"
        disabled={isAnalyzing || !selectedResumeId || !selectedJDId}
        size="lg"
        variant="gradient"
        className="w-full gap-2 font-semibold shadow-md"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Computing 5-Pillar ATS Compatibility Score...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Run ATS Match & Generate Gap Report</span>
          </>
        )}
      </Button>
    </form>
  );
}

export default function NewAnalysisPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Run ATS Resume Compatibility Match</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Select your candidate resume and target job description to compute your 5-pillar ATS compatibility score.
          </p>
        </div>

        <AntiFabricationBanner />

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <NewAnalysisForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
