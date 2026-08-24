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
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full md:col-span-2" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !analysis) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-foreground">Analysis Report Not Found</h2>
          <Link href="/dashboard">
            <Button size="sm">Back to Dashboard</Button>
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  ATS Match & Compatibility Report
                </h1>
                <Badge variant="outline" className="text-xs">
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
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export ATS PDF/DOCX</span>
            </Button>
            <Button
              onClick={handleFullOptimization}
              disabled={optimizing}
              variant="gradient"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-sm"
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

        {/* Top Summary Banner */}
        {analysis.summary_critique && (
          <Card className="bg-muted/30 border-primary/20">
            <CardContent className="p-5 text-sm text-foreground leading-relaxed flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-foreground">Executive Analysis Summary: </strong>
                <span className="text-muted-foreground">{analysis.summary_critique}</span>
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
