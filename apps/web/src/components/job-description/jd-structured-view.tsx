"use client";

import React from "react";
import { Briefcase, Building, MapPin, CheckCircle, Clock, Award, Code2, ListChecks, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobDescriptionStructured } from "@/types";

interface JDStructuredViewProps {
  title: string;
  company?: string;
  location?: string;
  structured: JobDescriptionStructured;
  rawText?: string;
}

export function JDStructuredView({ title, company, location, structured, rawText }: JDStructuredViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border border-border/80 shadow-subtle overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                {company && (
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Building className="h-4 w-4 text-primary" /> {company}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-4 w-4 text-primary" /> {location}
                  </span>
                )}
                {structured.experience_level && (
                  <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider">
                    {structured.experience_level}
                  </Badge>
                )}
                {structured.years_of_experience && (
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {structured.years_of_experience}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Skills */}
      {structured.required_skills?.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Core / Required Technical Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4">
            <div className="flex flex-wrap gap-2">
              {structured.required_skills.map((skill, idx) => (
                <Badge key={idx} variant="info" className="text-xs py-1 px-3 font-semibold">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferred Skills */}
      {structured.preferred_skills?.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>Preferred / Nice-to-Have Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4">
            <div className="flex flex-wrap gap-2">
              {structured.preferred_skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs py-1 px-3 font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Responsibilities */}
      {structured.responsibilities?.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Key Responsibilities & Scope</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4">
            <ul className="list-disc pl-5 space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {structured.responsibilities.map((resp, idx) => (
                <li key={idx} className="leading-relaxed">{resp}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Qualifications */}
      {structured.qualifications?.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Qualifications & Eligibility Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4">
            <ul className="list-disc pl-5 space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {structured.qualifications.map((qual, idx) => (
                <li key={idx} className="leading-relaxed">{qual}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Raw Text Stream Card */}
      {rawText && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Raw Job Posting Text</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-60 overflow-y-auto p-4 rounded-xl bg-muted/30 border border-border/60">
              {rawText}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
