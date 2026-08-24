"use client";

import React from "react";
import { Briefcase, Building, MapPin, CheckCircle, Clock, Award, Code2, ListChecks } from "lucide-react";
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
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                {company && (
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-primary" /> {company}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" /> {location}
                  </span>
                )}
                {structured.experience_level && (
                  <Badge variant="outline" className="text-xs">
                    {structured.experience_level}
                  </Badge>
                )}
                {structured.years_of_experience && (
                  <span className="flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" /> {structured.years_of_experience}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Skills */}
      {structured.required_skills?.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Core / Required Technical Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex flex-wrap gap-2">
              {structured.required_skills.map((skill, idx) => (
                <Badge key={idx} variant="info" className="text-xs py-1 px-2.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferred Skills */}
      {structured.preferred_skills?.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>Preferred / Nice-to-Have Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex flex-wrap gap-2">
              {structured.preferred_skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs py-1 px-2.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Responsibilities */}
      {structured.responsibilities?.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Key Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {structured.responsibilities.map((resp, idx) => (
                <li key={idx} className="leading-relaxed">{resp}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Qualifications */}
      {structured.qualifications?.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Qualifications & Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {structured.qualifications.map((qual, idx) => (
                <li key={idx} className="leading-relaxed">{qual}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Raw Text Accordion */}
      {rawText && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">Raw Job Posting Text</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-60 overflow-y-auto p-3 rounded-md bg-muted/40 border">
              {rawText}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
