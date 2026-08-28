"use client";

import React from "react";
import { Lightbulb, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, ListChecks } from "lucide-react";
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
        return <Badge variant="danger" className="text-[10px] uppercase tracking-wider font-bold">High Priority</Badge>;
      case "medium":
        return <Badge variant="warning" className="text-[10px] uppercase tracking-wider font-bold">Medium Priority</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">Optimization</Badge>;
    }
  };

  return (
    <Card className="w-full border border-border/80 shadow-dropdown bg-card">
      <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/60">
        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span>Actionable Improvement Recommendations</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-2xl border border-border/70 bg-muted/10 space-y-3 transition-all hover:border-primary/40 hover:shadow-subtle"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>{rec.title}</span>
              </h4>
              {getPriorityBadge(rec.priority)}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {rec.description}
            </p>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 text-xs text-foreground flex items-start gap-2.5 shadow-subtle">
              <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-primary font-bold">Next Action: </strong>
                <span>{rec.actionable_step}</span>
              </div>
            </div>

            {rec.disclaimer && (
              <div className="flex items-center gap-2 text-[11px] text-amber-900 dark:text-amber-300 font-medium bg-amber-50/70 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-900/50">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>{rec.disclaimer}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
