"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StructuredResumeContent } from "@/types";

interface ResumeStructuredViewProps {
  content: StructuredResumeContent;
}

export function ResumeStructuredView({ content }: ResumeStructuredViewProps) {
  const { personal, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="space-y-6">
      {/* Personal Header */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{personal?.name || "Candidate Name"}</h1>
            {personal?.title && <p className="text-sm font-medium text-primary">{personal.title}</p>}
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-2">
              {personal?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-primary" /> {personal.email}
                </span>
              )}
              {personal?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {personal.phone}
                </span>
              )}
              {personal?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {personal.location}
                </span>
              )}
              {personal?.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-blue-600">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
              {personal?.github && (
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-foreground">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
              {personal?.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-primary">
                  <Globe className="h-3.5 w-3.5" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      {summary && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold">Professional Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed">
            {summary}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Technical Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {skills.map((cat, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-semibold text-foreground mr-2">{cat.category}:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {cat.items.map((skill, sIdx) => (
                    <Badge key={sIdx} variant="secondary" className="font-normal text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Work Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-6">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-2 border-b last:border-0 pb-5 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-semibold text-sm text-foreground">{exp.position}</h4>
                  <span className="text-xs text-muted-foreground font-medium">
                    {exp.start_date} – {exp.end_date || (exp.is_current ? "Present" : "")}
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground italic">
                  {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                  {exp.highlights.map((hl, hIdx) => (
                    <li key={hIdx}>{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-semibold text-sm text-foreground">{edu.degree}</h4>
                  <span className="text-xs text-muted-foreground">
                    {edu.start_date ? `${edu.start_date} – ` : ""}{edu.end_date || ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{edu.institution}{edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            {certifications.map((c, idx) => (
              <div key={c.id || idx} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{c.name}</span>
                {c.issuer && <span> — {c.issuer}</span>}
                {c.issue_date && <span> ({c.issue_date})</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
