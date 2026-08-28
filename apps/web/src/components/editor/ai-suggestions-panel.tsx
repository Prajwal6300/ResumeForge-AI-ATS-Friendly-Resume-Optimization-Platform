"use client";

import React from "react";
import { Sparkles, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AISuggestion, AISuggestionStatus } from "@/types";

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  onUpdateStatus: (id: string, status: AISuggestionStatus) => Promise<void>;
  onApplyText?: (section: string, suggestedText: string) => void;
}

export function AISuggestionsPanel({ suggestions, onUpdateStatus, onApplyText }: AISuggestionsPanelProps) {
  const pending = suggestions.filter((s) => s.status === "pending");

  if (pending.length === 0) {
    return (
      <Card className="w-full border border-border/80 shadow-subtle bg-card">
        <CardContent className="p-6 text-center text-xs text-muted-foreground space-y-2.5">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary mx-auto shadow-subtle">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="font-bold text-sm text-foreground">No Pending AI Suggestions</p>
          <p className="leading-relaxed">Click &quot;AI Improve&quot; on any section or &quot;AI Rewrite&quot; on bullet points to get suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Pending AI Suggestions ({pending.length})</span>
        </h3>
      </div>

      {pending.map((item) => (
        <Card key={item.id} className="border border-indigo-200/80 dark:border-indigo-900/60 shadow-subtle bg-indigo-50/30 dark:bg-indigo-950/20 rounded-2xl overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize text-[10px] font-bold tracking-wider">
                Section: {item.section}
              </Badge>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Fact-Grounded</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Original:</span>
              <p className="line-through text-muted-foreground leading-relaxed">{item.original_text}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Suggested Tailoring:</span>
              <p className="font-medium text-foreground bg-card p-3 rounded-xl border border-border/80 shadow-subtle leading-relaxed">{item.suggested_text}</p>
            </div>

            {item.reason && (
              <p className="text-[11px] text-muted-foreground italic leading-relaxed">{item.reason}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 hover:text-destructive hover:border-destructive/40 font-semibold"
                onClick={() => onUpdateStatus(item.id, "rejected")}
              >
                <X className="h-3.5 w-3.5" />
                <span>Reject</span>
              </Button>
              <Button
                size="sm"
                variant="gradient"
                className="h-8 text-xs gap-1 font-bold shadow-subtle"
                onClick={async () => {
                  onApplyText?.(item.section, item.suggested_text);
                  await onUpdateStatus(item.id, "accepted");
                }}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept & Apply</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
