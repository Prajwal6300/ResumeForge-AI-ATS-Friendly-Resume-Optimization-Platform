"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, UploadCloud } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Resumes</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your uploaded and optimized resume profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/resumes/new">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" />
                <span>Upload New Resume</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
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
              <div key={n} className="h-44 rounded-xl border bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed bg-muted/10 space-y-4 max-w-md mx-auto my-12">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">No Resumes Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {search ? "No resumes matched your search term." : "Upload your first PDF or DOCX resume to begin ATS optimization."}
              </p>
            </div>
            <Link href="/resumes/new">
              <Button size="sm" className="gap-1.5 text-xs">
                <UploadCloud className="h-4 w-4" />
                <span>Upload Resume</span>
              </Button>
            </Link>
          </div>
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
