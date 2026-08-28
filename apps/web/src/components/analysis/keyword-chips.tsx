"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Search, ShieldCheck, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeywordChipsProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  weakKeywords: string[];
}

export function KeywordChips({ matchedKeywords, missingKeywords, weakKeywords }: KeywordChipsProps) {
  const [search, setSearch] = useState("");

  const filterList = (list: string[]) => {
    if (!search.trim()) return list;
    return list.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredMatched = filterList(matchedKeywords);
  const filteredMissing = filterList(missingKeywords);
  const filteredWeak = filterList(weakKeywords);

  return (
    <Card className="w-full border border-border/80 shadow-dropdown bg-card">
      <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <span>ATS Keyword Match Matrix</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exact and synonym matches extracted from job posting vs your resume.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search keyword matrix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-6">
        <Tabs defaultValue="missing" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="missing" className="text-xs font-bold gap-1.5 py-2">
              <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span>Missing ({missingKeywords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="matched" className="text-xs font-bold gap-1.5 py-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Matched ({matchedKeywords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="weak" className="text-xs font-bold gap-1.5 py-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Weak Context ({weakKeywords.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Missing Keywords Tab */}
          <TabsContent value="missing" className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5 shadow-subtle">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span className="leading-relaxed">
                <strong>Anti-Fabrication Guardrail:</strong> Add missing keywords only if supported by your authentic qualifications and hands-on experience.
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredMissing.length > 0 ? (
                filteredMissing.map((kw, idx) => (
                  <Badge key={idx} variant="danger" className="text-xs py-1 px-3 gap-1 font-semibold">
                    <span>+</span> {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">No missing keywords found matching your filter.</p>
              )}
            </div>
          </TabsContent>

          {/* Matched Keywords Tab */}
          <TabsContent value="matched" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {filteredMatched.length > 0 ? (
                filteredMatched.map((kw, idx) => (
                  <Badge key={idx} variant="success" className="text-xs py-1 px-3 gap-1.5 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">No matched keywords found matching your filter.</p>
              )}
            </div>
          </TabsContent>

          {/* Weak Keywords Tab */}
          <TabsContent value="weak" className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              These terms appear in your resume but lack concrete metrics, impact numbers, or depth of project experience.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredWeak.length > 0 ? (
                filteredWeak.map((kw, idx) => (
                  <Badge key={idx} variant="warning" className="text-xs py-1 px-3 font-semibold">
                    {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">No weak keywords identified.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
