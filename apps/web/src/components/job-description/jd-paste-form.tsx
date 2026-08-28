"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Briefcase, Building, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JDPasteFormProps {
  onSubmit: (data: { title: string; company?: string; raw_text: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function JDPasteForm({ onSubmit, isSubmitting = false }: JDPasteFormProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!rawText.trim() || rawText.trim().length < 20) {
      setError("Please paste the job description text (minimum 20 characters).");
      return;
    }

    try {
      await onSubmit({
        title: title.trim() || "Target Job Position",
        company: company.trim() || undefined,
        raw_text: rawText.trim(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to analyze job description.");
    }
  };

  return (
    <Card className="w-full border border-border/80 shadow-dropdown overflow-hidden">
      <CardHeader className="p-6 sm:p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-200/80 dark:border-violet-800 flex items-center justify-center text-violet-600 shrink-0 shadow-subtle">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold">Paste Target Job Description</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-0.5">
              Our deterministic extractor isolates required skills, responsibilities, and qualifications.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Job Title (Optional)</span>
              </label>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Company (Optional)</span>
              </label>
              <Input
                placeholder="e.g. Stripe / Google / Remote"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Job Description Text <span className="text-destructive">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Min. 20 characters</span>
            </div>
            <Textarea
              placeholder="Paste the full job description, requirements, responsibilities, and qualifications here..."
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="text-xs leading-relaxed font-mono resize-y"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !rawText.trim()}
            variant="gradient"
            className="w-full h-10 gap-2 font-bold text-xs sm:text-sm shadow-subtle mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting Target Criteria & Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Job Description & Extract Keywords</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
