"use client";

import React from "react";
import { KeyRound, Code2, ListChecks, Briefcase, FileCheck, Check, AlertTriangle } from "lucide-react";
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
      color: "text-blue-600",
    },
    {
      id: "technical_skills",
      label: "Technical Skills Alignment",
      weight: 25,
      data: breakdown.technical_skills,
      icon: Code2,
      color: "text-indigo-600",
    },
    {
      id: "responsibilities",
      label: "Responsibilities Coverage",
      weight: 20,
      data: breakdown.responsibilities,
      icon: ListChecks,
      color: "text-teal-600",
    },
    {
      id: "experience_relevance",
      label: "Experience Depth",
      weight: 10,
      data: breakdown.experience_relevance,
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      id: "resume_structure",
      label: "ATS Formatting & Structure",
      weight: 5,
      data: breakdown.resume_structure,
      icon: FileCheck,
      color: "text-amber-600",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>5-Pillar Score Breakdown</span>
          <Badge variant="outline" className="text-xs font-normal">
            Deterministic Weights (100% Total)
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const score = pillar.data?.score || 0;
          const weighted = pillar.data?.weighted_score || 0;

          return (
            <div key={pillar.id} className="space-y-2 border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Icon className={`h-4 w-4 ${pillar.color}`} />
                  <span>{pillar.label}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    (Weight: {pillar.weight}%)
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold ${getScoreColor(score)}`}>{score.toFixed(0)}%</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    (+{weighted.toFixed(1)} pts)
                  </span>
                </div>
              </div>

              <Progress
                value={score}
                indicatorClassName={getScoreProgressColor(score)}
                className="h-2"
              />

              {pillar.data?.feedback && (
                <p className="text-xs text-muted-foreground">{pillar.data.feedback}</p>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                {pillar.data?.strengths?.length > 0 && (
                  <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{pillar.data.strengths[0]}</span>
                  </div>
                )}
                {pillar.data?.improvements?.length > 0 && (
                  <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{pillar.data.improvements[0]}</span>
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
