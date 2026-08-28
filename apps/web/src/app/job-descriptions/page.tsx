"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Briefcase, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Target Job Descriptions</h1>
              <Badge variant="secondary" className="font-bold text-xs">
                {jobDescriptions.length} {jobDescriptions.length === 1 ? "Role" : "Roles"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Save and manage target roles to compare with your resumes and extract ATS keywords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/job-descriptions/new">
              <Button size="sm" variant="gradient" className="gap-1.5 text-xs font-bold shadow-subtle hover:shadow-glow">
                <Plus className="h-4 w-4" />
                <span>Add Job Description</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
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
              <div key={n} className="h-48 rounded-2xl border border-border/60 bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={search ? "No Matching Job Postings" : "No Target Job Postings Yet"}
            description={
              search
                ? `No jobs matched "${search}". Try searching with a different role title or company.`
                : "Paste a target job posting to extract required technical skills, evaluate responsibilities, and calculate match scores."
            }
            actionLabel={search ? "Clear Search" : "Paste Your First Job Description"}
            onAction={search ? () => setSearch("") : undefined}
            actionHref={search ? undefined : "/job-descriptions/new"}
            actionIcon={search ? undefined : Plus}
            className="my-8"
          />
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
