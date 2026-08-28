"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, Code2, Sparkles, FolderGit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StructuredResumeContent } from "@/types";

interface ResumeStructuredViewProps {
  content: StructuredResumeContent;
}

export function ResumeStructuredView({ content }: ResumeStructuredViewProps) {
  const { personal, summary, skills, experience, education, projects, certifications, achievements } = content;

  return (
    <div className="space-y-6">
      {/* Personal Header */}
      <Card className="border border-border/80 shadow-subtle overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {personal?.name || "Candidate Name"}
            </h1>
            {personal?.title && (
              <p className="text-sm sm:text-base font-bold text-primary tracking-wide">
                {personal.title}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-2">
              {personal?.email && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-primary" /> {personal.email}
                </span>
              )}
              {personal?.phone && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {personal.phone}
                </span>
              )}
              {personal?.location && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {personal.location}
                </span>
              )}
              {personal?.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
                  <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn
                </a>
              )}
              {personal?.github && (
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
                  <Github className="h-3.5 w-3.5 text-primary" /> GitHub
                </a>
              )}
              {personal?.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
                  <Globe className="h-3.5 w-3.5 text-primary" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      {summary && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {summary}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Technical Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-3.5">
            {skills.map((cat, idx) => (
              <div key={idx} className="text-xs sm:text-sm space-y-1.5">
                <span className="font-bold text-foreground">{cat.category}:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {cat.items.map((skill, sIdx) => (
                    <Badge key={sIdx} variant="secondary" className="font-normal text-xs py-0.5 px-2">
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
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Work Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-6">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-2 border-b border-border/50 last:border-0 pb-6 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-bold text-sm text-foreground">{exp.position}</h4>
                  <Badge variant="outline" className="self-start sm:self-auto text-[11px] font-medium">
                    {exp.start_date} – {exp.end_date || (exp.is_current ? "Present" : "")}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {exp.company}{exp.location ? ` &bull; ${exp.location}` : ""}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                  {exp.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="leading-relaxed">{hl}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" />
              <span>Key Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-1.5 border-b border-border/50 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">{proj.title}</h4>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      View Project &rarr;
                    </a>
                  )}
                </div>
                {proj.description && <p className="text-xs text-muted-foreground">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t, tIdx) => (
                      <Badge key={tIdx} variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-4">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">{edu.degree}</h4>
                  <span className="text-xs text-muted-foreground font-medium">
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
        <Card className="border border-border/80 shadow-subtle">
          <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-4 space-y-2.5">
            {certifications.map((c, idx) => (
              <div key={c.id || idx} className="text-xs text-muted-foreground flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">{c.name}</span>
                  {c.issuer && <span className="text-muted-foreground"> &bull; {c.issuer}</span>}
                </div>
                {c.issue_date && <Badge variant="outline" className="text-[10px]">{c.issue_date}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
