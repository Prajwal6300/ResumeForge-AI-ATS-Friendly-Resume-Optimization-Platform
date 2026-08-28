"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit3, Sparkles, Eye, Download, Layers, Calendar, FileText, Code2 } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeStructuredView } from "@/components/resume/resume-structured-view";
import { TemplatePreviewModal } from "@/components/editor/template-preview-modal";
import { useResumeDetail } from "@/hooks/use-resumes";
import { formatDate } from "@/lib/utils";

export default function ResumeDetailPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, error } = useResumeDetail(resumeId);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-foreground">Resume Not Found</h2>
          <p className="text-xs text-muted-foreground">The requested resume does not exist or you do not have permission to view it.</p>
          <Link href="/resumes">
            <Button size="sm" variant="outline">Back to Resumes</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-fade-in">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <Link href="/resumes">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{resume.title}</h1>
                <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-wider">
                  {resume.file_type || "manual"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updated {formatDate(resume.updated_at)} &bull; {resume.version_count || 1} Version{(resume.version_count || 1) > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/resumes/${resume.id}/edit`}>
              <Button size="sm" variant="default" className="gap-1.5 text-xs font-semibold">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Open Editor</span>
              </Button>
            </Link>
            <Link href={`/analysis/new?resume_id=${resume.id}`}>
              <Button variant="gradient" size="sm" className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Match Target JD</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview / Export</span>
            </Button>
          </div>
        </div>

        {/* Structured Content View */}
        <ResumeStructuredView content={resume.parsed_content} />

        {/* Raw Text Stream Card */}
        {resume.raw_text && (
          <Card className="border border-border/80 shadow-subtle">
            <CardContent className="p-6">
              <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5" />
                <span>Raw Extracted Text Stream</span>
              </h3>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-60 overflow-y-auto p-4 rounded-xl bg-muted/30 border border-border/60">
                {resume.raw_text}
              </pre>
            </CardContent>
          </Card>
        )}

        <TemplatePreviewModal
          open={showPreviewModal}
          onOpenChange={setShowPreviewModal}
          resumeId={resume.id}
        />
      </div>
    </ProtectedRoute>
  );
}
