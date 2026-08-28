"use client";

import React from "react";
import { getScoreColor, getScoreGrade, getScoreBgColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const grade = getScoreGrade(score);
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const strokeDashoffset = circumference - (circumference * clampedScore) / 100;

  // Determine stroke color
  let strokeColor = "#10b981"; // emerald
  if (score < 65) strokeColor = "#f43f5e"; // rose
  else if (score < 80) strokeColor = "#f59e0b"; // amber

  return (
    <Card className="w-full text-center overflow-hidden border border-border/80 shadow-dropdown bg-card">
      <CardContent className="p-8 sm:p-10 flex flex-col items-center justify-center space-y-5">
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-muted/20 dark:text-muted/40"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Score Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Label */}
          <div className="absolute flex flex-col items-center justify-center space-y-0.5">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${getScoreColor(score)}`}>
              {score.toFixed(0)}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              / 100 ATS
            </span>
          </div>
        </div>

        <div className="space-y-1.5 max-w-xs">
          <Badge variant="outline" className={`text-xs px-3.5 py-1 font-bold border ${getScoreBgColor(score)}`}>
            {grade.label}
          </Badge>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {grade.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border/60 w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Deterministic 5-pillar mathematical score</span>
        </div>
      </CardContent>
    </Card>
  );
}
