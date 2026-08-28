"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, UploadCloud, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ResumeCard } from "@/components/resume/resume-card";
import { useResumes } from "@/hooks/use-resumes";

export default function ResumesPage() {
  const { resumes, isLoading, deleteResume } = useResumes();
  const [search, setSearch] = useState("");

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">My Resumes</h1>
              <Badge variant="secondary" className="font-bold text-xs">
                {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Manage versions, review parsed sections, and optimize against job descriptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/resumes/new">
              <Button size="sm" variant="gradient" className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow">
                <Plus className="h-4 w-4" />
                <span>Upload New Resume</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Resumes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl border border-border/60 bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={search ? "No Matching Resumes" : "No Resumes Uploaded Yet"}
            description={
              search
                ? `No resumes matched "${search}". Try searching with a different keyword.`
                : "Upload your existing PDF or Word resume to extract skills, calculate ATS scores, and tailor achievements."
            }
            actionLabel={search ? "Clear Search" : "Upload Your First Resume"}
            onAction={search ? () => setSearch("") : undefined}
            actionHref={search ? undefined : "/resumes/new"}
            actionIcon={search ? undefined : UploadCloud}
            className="my-8"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={deleteResume}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
