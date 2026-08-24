"use client";

import React from "react";
import { Lightbulb, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ATSRecommendation } from "@/types";

interface RecommendationCardProps {
  recommendations: ATSRecommendation[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="danger" className="text-[10px] uppercase tracking-wider font-semibold">High Priority</Badge>;
      case "medium":
        return <Badge variant="warning" className="text-[10px] uppercase tracking-wider font-semibold">Medium Priority</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Optimization</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span>Actionable Improvement Recommendations</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border bg-muted/20 space-y-2.5 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>{rec.title}</span>
              </h4>
              {getPriorityBadge(rec.priority)}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {rec.description}
            </p>

            <div className="p-3 rounded-lg bg-background border text-xs text-foreground flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary font-semibold">Actionable Step: </strong>
                <span>{rec.actionable_step}</span>
              </div>
            </div>

            {rec.disclaimer && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>{rec.disclaimer}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
