"use client";

import React, { useState } from "react";
import { Sparkles, Trash2, Check, RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BulletEditorProps {
  bullet: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  onRewriteAI: (bullet: string, goal: string) => Promise<any>;
  isRewriting?: boolean;
}

export function BulletEditor({ bullet, onChange, onDelete, onRewriteAI, isRewriting = false }: BulletEditorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("impact");

  const handleOpenAI = async (goal: string = "impact") => {
    setSelectedGoal(goal);
    setModalOpen(true);
    setLoading(true);
    try {
      const res = await onRewriteAI(bullet, goal);
      setAiResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (text: string) => {
    onChange(text);
    setModalOpen(false);
    setAiResult(null);
  };

  return (
    <div className="flex items-start gap-2 group w-full">
      <span className="text-muted-foreground mt-2 font-bold text-xs select-none">&bull;</span>
      <textarea
        value={bullet}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="flex-1 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y leading-relaxed"
      />
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenAI("impact")}
          className="h-8 px-2 text-[11px] gap-1 text-primary hover:bg-primary/10"
          title="AI Rewrite Bullet"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Rewrite</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Delete Bullet"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* AI Rewrite Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Bullet Point Optimizer</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Transforms passive statements into high-impact, measurable achievements using action verbs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="flex flex-wrap gap-1.5">
            {["impact", "concise", "jd_align", "grammar"].map((goal) => (
              <Button
                key={goal}
                type="button"
                variant={selectedGoal === goal ? "default" : "outline"}
                size="sm"
                onClick={() => handleOpenAI(goal)}
                className="text-xs h-7 capitalize"
              >
                {goal.replace("_", " ")}
              </Button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border text-xs">
            <span className="font-semibold text-muted-foreground block mb-1">Original Text:</span>
            <p className="text-foreground">{bullet}</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Optimizing phrasing with active verbs...</p>
            </div>
          ) : aiResult ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-primary flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Recommended High-Impact Version:
                  </span>
                  {aiResult.impact_score_delta && (
                    <Badge variant="success" className="text-[10px]">
                      {aiResult.impact_score_delta} Impact
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {aiResult.suggested_bullet}
                </p>
                {aiResult.rationale && (
                  <p className="text-xs text-muted-foreground italic border-t pt-1.5 mt-1.5">
                    {aiResult.rationale}
                  </p>
                )}
                <Button
                  size="sm"
                  onClick={() => handleApplySuggestion(aiResult.suggested_bullet)}
                  className="w-full mt-2 gap-1.5 text-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Apply Recommended Version</span>
                </Button>
              </div>

              {aiResult.alternative_options?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Alternative Options:</span>
                  {aiResult.alternative_options.map((alt: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="flex-1">{alt}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplySuggestion(alt)}
                        className="h-7 text-[11px] shrink-0"
                      >
                        Use This
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
