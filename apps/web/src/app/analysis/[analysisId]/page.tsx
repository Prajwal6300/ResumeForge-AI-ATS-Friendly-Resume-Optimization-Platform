"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  FileText,
  Briefcase,
  Download,
  Loader2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreGauge } from "@/components/analysis/score-gauge";
import { ScoreBreakdownCard } from "@/components/analysis/score-breakdown-card";
import { KeywordChips } from "@/components/analysis/keyword-chips";
import { RecommendationCard } from "@/components/analysis/recommendation-card";
import { AntiFabricationBanner } from "@/components/analysis/anti-fabrication-banner";
import { TemplatePreviewModal } from "@/components/editor/template-preview-modal";
import { useAnalysisDetail } from "@/hooks/use-analyses";
import { useOptimization } from "@/hooks/use-optimization";
import { formatDate } from "@/lib/utils";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.analysisId as string;
  const { data: analysis, isLoading, error } = useAnalysisDetail(analysisId);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const { optimizeFullResume } = useOptimization(analysis?.resume_id || "");

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full md:col-span-2 rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !analysis) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-foreground">Analysis Report Not Found</h2>
          <p className="text-xs text-muted-foreground">The requested analysis report does not exist or has expired.</p>
          <Link href="/dashboard">
            <Button size="sm" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const handleFullOptimization = async () => {
    try {
      setOptimizing(true);
      await optimizeFullResume({
        resume_id: analysis.resume_id,
        jd_id: analysis.jd_id,
      });
      router.push(`/resumes/${analysis.resume_id}/edit`);
    } catch (err: any) {
      alert("Failed to optimize resume: " + (err.message || "Unknown error"));
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8 animate-fade-in">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  ATS Match & Compatibility Report
                </h1>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {formatDate(analysis.created_at)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Report #{analysis.id.slice(0, 8)} &bull; Deterministic 5-Pillar Score
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/resumes/${analysis.resume_id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Open in Editor</span>
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export ATS PDF/DOCX</span>
            </Button>
            <Button
              onClick={handleFullOptimization}
              disabled={optimizing}
              variant="gradient"
              size="sm"
              className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow"
            >
              {optimizing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating Tailored Version...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>1-Click AI Optimize</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <AntiFabricationBanner />

        {/* Executive Summary Banner */}
        {analysis.summary_critique && (
          <Card className="border border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20 shadow-subtle">
            <CardContent className="p-5 sm:p-6 text-xs sm:text-sm text-foreground leading-relaxed flex items-start gap-3.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-subtle">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <strong className="font-bold text-foreground text-xs uppercase tracking-wider block text-primary">
                  Executive Analysis Summary
                </strong>
                <p className="text-muted-foreground leading-relaxed">{analysis.summary_critique}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 1: Score Gauge & 5-Pillar Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <ScoreGauge score={analysis.overall_score} />
          </div>
          <div className="lg:col-span-2">
            <ScoreBreakdownCard breakdown={analysis.breakdown} />
          </div>
        </div>

        {/* Section 2: Keyword Matching Matrix */}
        <KeywordChips
          matchedKeywords={analysis.matched_keywords}
          missingKeywords={analysis.missing_keywords}
          weakKeywords={analysis.weak_keywords}
        />

        {/* Section 3: Actionable Improvement Recommendations */}
        <RecommendationCard recommendations={analysis.recommendations} />

        <TemplatePreviewModal
          open={showPreviewModal}
          onOpenChange={setShowPreviewModal}
          resumeId={analysis.resume_id}
        />
      </div>
    </ProtectedRoute>
  );
}
