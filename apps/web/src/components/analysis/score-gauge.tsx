"use client";

import React from "react";
import { getScoreColor, getScoreGrade, getScoreBgColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const grade = getScoreGrade(score);
  const strokeDashoffset = 283 - (283 * Math.min(100, Math.max(0, score))) / 100;

  // Determine stroke color
  let strokeColor = "#10b981"; // emerald
  if (score < 65) strokeColor = "#f43f5e"; // rose
  else if (score < 80) strokeColor = "#f59e0b"; // amber

  return (
    <Card className="w-full text-center overflow-hidden border-2">
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-muted/30"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Score Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(score)}`}>
              {score.toFixed(0)}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              / 100 ATS
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={`text-xs px-3 py-1 font-semibold border ${getScoreBgColor(score)}`}>
              {grade.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            {grade.description}
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground italic max-w-sm pt-2 border-t">
          *ResumeForge ATS Compatibility Score is an algorithmic estimate based on 5 weighted pillars.
        </p>
      </CardContent>
    </Card>
  );
}
