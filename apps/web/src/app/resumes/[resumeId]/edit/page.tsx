"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-foreground">Resume Not Found</h2>
          <p className="text-xs text-muted-foreground">The requested resume does not exist or you do not have permission to edit it.</p>
          <Link href="/resumes">
            <Button size="sm">Back to Resumes</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
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
