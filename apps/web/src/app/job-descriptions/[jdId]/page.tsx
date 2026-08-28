"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sparkles, Briefcase, Building } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JDStructuredView } from "@/components/job-description/jd-structured-view";
import { useJobDescriptionDetail } from "@/hooks/use-job-descriptions";

export default function JobDescriptionDetailPage() {
  const params = useParams();
  const jdId = params.jdId as string;
  const { data: jd, isLoading, error } = useJobDescriptionDetail(jdId);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !jd) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-12 text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-foreground">Job Description Not Found</h2>
          <p className="text-xs text-muted-foreground">The requested job description does not exist or has been deleted.</p>
          <Link href="/job-descriptions">
            <Button size="sm" variant="outline">Back to Job Descriptions</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <Link href="/job-descriptions">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{jd.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{jd.company || "Target Position Criteria"}</p>
            </div>
          </div>

          <Link href={`/analysis/new?jd_id=${jd.id}`}>
            <Button variant="gradient" size="sm" className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Match Against Resume</span>
            </Button>
          </Link>
        </div>

        <JDStructuredView
          title={jd.title}
          company={jd.company}
          location={jd.location}
          structured={jd.structured_content}
          rawText={jd.raw_text}
        />
      </div>
    </ProtectedRoute>
  );
}
