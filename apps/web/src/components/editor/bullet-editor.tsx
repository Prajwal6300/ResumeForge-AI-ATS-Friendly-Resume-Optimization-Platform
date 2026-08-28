"use client";

import React, { useState } from "react";
import { Sparkles, Trash2, Check, RefreshCw, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <div className="flex items-start gap-2.5 group w-full">
      <span className="text-primary mt-2 font-bold text-xs select-none">&bull;</span>
      <textarea
        value={bullet}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="flex-1 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs shadow-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-y leading-relaxed transition-all"
        placeholder="Action verb + Context + Measurable Result (XYZ formula)..."
      />
      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenAI("impact")}
          className="h-8 px-2.5 text-[11px] gap-1.5 text-primary border-primary/30 hover:bg-primary/10 font-bold shadow-subtle"
          title="AI Rewrite Bullet Point"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Rewrite</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
          title="Delete Bullet"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* AI Rewrite Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl p-6 sm:p-8 rounded-2xl">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Bullet Point Optimizer</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Transforms passive statements into high-impact, measurable achievements using verified action verbs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-3">
            <div className="flex flex-wrap gap-1.5">
              {["impact", "concise", "jd_align", "grammar"].map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={selectedGoal === goal ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOpenAI(goal)}
                  className="text-xs h-7 capitalize font-semibold"
                >
                  {goal.replace("_", " ")}
                </Button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 text-xs">
              <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Original Draft:</span>
              <p className="text-foreground font-medium">{bullet}</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-2.5">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Optimizing phrasing with active metrics...</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5 shadow-subtle">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Recommended High-Impact Version:
                    </span>
                    {aiResult.impact_score_delta && (
                      <Badge variant="success" className="text-[10px] font-bold">
                        {aiResult.impact_score_delta} Impact
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                    {aiResult.suggested_bullet}
                  </p>
                  {aiResult.rationale && (
                    <p className="text-[11px] text-muted-foreground italic border-t border-indigo-200/50 dark:border-indigo-900/50 pt-2 mt-1">
                      Rationale: {aiResult.rationale}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => handleApplySuggestion(aiResult.suggested_bullet)}
                    className="w-full mt-2 gap-1.5 text-xs font-bold shadow-subtle"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Apply Recommended Version</span>
                  </Button>
                </div>

                {aiResult.alternative_options?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Alternative Options:</span>
                    {aiResult.alternative_options.map((alt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3 text-xs shadow-subtle"
                      >
                        <span className="flex-1 leading-relaxed">{alt}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplySuggestion(alt)}
                          className="h-7 text-[11px] font-semibold shrink-0"
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

          <DialogFooter className="pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
