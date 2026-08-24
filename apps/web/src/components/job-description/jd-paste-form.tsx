"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Briefcase, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <Card className="w-full">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Paste Job Description</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Paste the full job post text. Our engine will extract required technical skills, qualifications, and domain keywords.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Job Title (Optional)</span>
              </label>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Company (Optional)</span>
              </label>
              <Input
                placeholder="e.g. Google / Stripe / Remote"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Job Description Text <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Paste the full job description, requirements, responsibilities, and qualifications here..."
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="text-xs leading-relaxed font-mono"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting || !rawText.trim()} className="w-full gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting Criteria & Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Job Description</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
