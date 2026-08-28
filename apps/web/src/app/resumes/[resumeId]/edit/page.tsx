"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { useResumeDetail } from "@/hooks/use-resumes";

export default function ResumeEditPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const {
    resume,
    isLoading,
    error,
    updateResume,
    isSaving,
    versions,
    restoreVersion,
  } = useResumeDetail(resumeId);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6 animate-pulse">
          <Skeleton className="h-12 w-80 rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4 animate-fade-in">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Resume Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested resume does not exist or you do not have permission to access it.
          </p>
          <Link href="/resumes">
            <Button size="sm" variant="outline">Back to Resumes</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6 animate-fade-in">
        <ResumeEditor
          resume={resume}
          versions={versions}
          onSave={updateResume}
          onRestoreVersion={restoreVersion}
          isSaving={isSaving}
        />
      </div>
    </ProtectedRoute>
  );
}
