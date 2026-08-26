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
      <Card className="w-full">
        <CardContent className="p-6 text-center text-xs text-muted-foreground space-y-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm text-foreground">No Pending AI Suggestions</p>
          <p>Click &quot;AI Improve&quot; on any section or &quot;AI Rewrite&quot; on bullet points to get suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Pending AI Suggestions ({pending.length})</span>
        </h3>
      </div>

      {pending.map((item) => (
        <Card key={item.id} className="border-primary/30 shadow-sm bg-primary/5">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize text-[11px] font-semibold">
                Section: {item.section}
              </Badge>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Original:</span>
              <p className="line-through text-muted-foreground">{item.original_text}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-primary">Suggested Improvement:</span>
              <p className="font-medium text-foreground bg-background p-2 rounded border">{item.suggested_text}</p>
            </div>

            {item.reason && (
              <p className="text-[11px] text-muted-foreground italic">{item.reason}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 hover:text-destructive"
                onClick={() => onUpdateStatus(item.id, "rejected")}
              >
                <X className="h-3.5 w-3.5" />
                <span>Reject</span>
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs gap-1"
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
