"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Briefcase } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JDCard } from "@/components/job-description/jd-card";
import { useJobDescriptions } from "@/hooks/use-job-descriptions";

export default function JobDescriptionsPage() {
  const { jobDescriptions, isLoading, deleteJD } = useJobDescriptions();
  const [search, setSearch] = useState("");

  const filtered = jobDescriptions.filter(
    (jd) =>
      jd.title.toLowerCase().includes(search.toLowerCase()) ||
      (jd.company && jd.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Target Job Descriptions</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Save and manage target roles to compare with your resumes and extract ATS keywords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/job-descriptions/new">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" />
                <span>Add Job Description</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* JDs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 rounded-xl border bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed bg-muted/10 space-y-4 max-w-md mx-auto my-12">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mx-auto">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">No Job Descriptions Saved</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {search ? "No positions matched your search query." : "Paste a target job posting to analyze required skills and extract keywords."}
              </p>
            </div>
            <Link href="/job-descriptions/new">
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                <span>Add Job Description</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((jd) => (
              <JDCard key={jd.id} jd={jd} onDelete={deleteJD} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
