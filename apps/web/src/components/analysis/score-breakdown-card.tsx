"use client";

import React from "react";
import { KeyRound, Code2, ListChecks, Briefcase, FileCheck, Check, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getScoreColor, getScoreProgressColor } from "@/lib/utils";
import { ATSScoreBreakdown } from "@/types";

interface ScoreBreakdownCardProps {
  breakdown: ATSScoreBreakdown;
}

export function ScoreBreakdownCard({ breakdown }: ScoreBreakdownCardProps) {
  const pillars = [
    {
      id: "keyword_relevance",
      label: "Keyword Relevance",
      weight: 40,
      data: breakdown.keyword_relevance,
      icon: KeyRound,
      iconBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800",
    },
    {
      id: "technical_skills",
      label: "Technical Skills Alignment",
      weight: 25,
      data: breakdown.technical_skills,
      icon: Code2,
      iconBg: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border-violet-200/80 dark:border-violet-800",
    },
    {
      id: "responsibilities",
      label: "Responsibilities Coverage",
      weight: 20,
      data: breakdown.responsibilities,
      icon: ListChecks,
      iconBg: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800",
    },
    {
      id: "experience_relevance",
      label: "Experience Depth",
      weight: 10,
      data: breakdown.experience_relevance,
      icon: Briefcase,
      iconBg: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800",
    },
    {
      id: "resume_structure",
      label: "ATS Formatting & Structure",
      weight: 5,
      data: breakdown.resume_structure,
      icon: FileCheck,
      iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800",
    },
  ];

  return (
    <Card className="w-full border border-border/80 shadow-dropdown bg-card">
      <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>5-Pillar Score Breakdown</span>
          </CardTitle>
          <Badge variant="outline" className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider">
            Deterministic Weights (100% Total)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const score = pillar.data?.score || 0;
          const weighted = pillar.data?.weighted_score || 0;

          return (
            <div key={pillar.id} className="space-y-3 border-b border-border/60 last:border-0 pb-6 last:pb-0">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 font-bold text-foreground">
                  <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shadow-subtle shrink-0 ${pillar.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span>{pillar.label}</span>
                    <span className="text-[11px] text-muted-foreground font-normal ml-2">
                      ({pillar.weight}% weight)
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono font-black text-sm sm:text-base ${getScoreColor(score)}`}>
                    {score.toFixed(0)}%
                  </span>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    (+{weighted.toFixed(1)} pts)
                  </span>
                </div>
              </div>

              <Progress
                value={score}
                indicatorClassName={getScoreProgressColor(score)}
                className="h-2.5 bg-muted/60"
              />

              {pillar.data?.feedback && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{pillar.data.feedback}</p>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {pillar.data?.strengths?.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-2 text-emerald-900 dark:text-emerald-300">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="leading-tight">{pillar.data.strengths[0]}</span>
                  </div>
                )}
                {pillar.data?.improvements?.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2 text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span className="leading-tight">{pillar.data.improvements[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
