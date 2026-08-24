"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";
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
    <Card className="w-full">
      <CardHeader className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold">ATS Keyword Match Analysis</CardTitle>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <Tabs defaultValue="missing">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="missing" className="text-xs gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-rose-500" />
              <span>Missing ({missingKeywords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="matched" className="text-xs gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Matched ({matchedKeywords.length})</span>
            </TabsTrigger>
            <TabsTrigger value="weak" className="text-xs gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>Weak ({weakKeywords.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Missing Keywords Tab */}
          <TabsContent value="missing" className="space-y-3">
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> Add missing keywords only if you genuinely have authentic experience with them. Do not fabricate qualifications.
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredMissing.length > 0 ? (
                filteredMissing.map((kw, idx) => (
                  <Badge key={idx} variant="danger" className="text-xs py-1 px-2.5 gap-1 font-medium">
                    <span>+</span> {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No missing keywords found for this search.</p>
              )}
            </div>
          </TabsContent>

          {/* Matched Keywords Tab */}
          <TabsContent value="matched" className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {filteredMatched.length > 0 ? (
                filteredMatched.map((kw, idx) => (
                  <Badge key={idx} variant="success" className="text-xs py-1 px-2.5 gap-1 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No matched keywords found for this search.</p>
              )}
            </div>
          </TabsContent>

          {/* Weak Keywords Tab */}
          <TabsContent value="weak" className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              These keywords appear only in passing or lack demonstrated project context.
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredWeak.length > 0 ? (
                filteredWeak.map((kw, idx) => (
                  <Badge key={idx} variant="warning" className="text-xs py-1 px-2.5 font-medium">
                    {kw}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No weak keywords found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
