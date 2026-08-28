"use client";

import Link from "next/link";
import { FileText, Edit3, Sparkles, Trash2, Calendar, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => Promise<void>;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const totalSkills = resume.parsed_content?.skills?.reduce(
    (acc, cat) => acc + (cat.items?.length || 0),
    0
  ) || 0;
  const totalExp = resume.parsed_content?.experience?.length || 0;

  return (
    <Card className="flex flex-col justify-between border border-border/80 bg-card hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 group">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-primary shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base font-bold truncate">
                {resume.title}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDate(resume.updated_at)}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold shrink-0">
            {resume.file_type || "manual"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 pb-3 text-xs text-muted-foreground space-y-2.5">
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline" className="text-[11px] gap-1 font-medium bg-muted/30">
            <Layers className="h-3 w-3 text-primary" />
            <span>{resume.version_count || 1} Version{(resume.version_count || 1) > 1 ? "s" : ""}</span>
          </Badge>
          {totalExp > 0 && (
            <span className="text-[11px] text-muted-foreground">&bull; {totalExp} Role{totalExp > 1 ? "s" : ""}</span>
          )}
          {totalSkills > 0 && (
            <span className="text-[11px] text-muted-foreground">&bull; {totalSkills} Skills</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/resumes/${resume.id}`}>
            <Button variant="outline" size="sm" className="gap-1 h-8 text-xs font-semibold px-2.5">
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
          </Link>
          <Link href={`/resumes/${resume.id}/edit`}>
            <Button size="sm" variant="default" className="gap-1 h-8 text-xs font-semibold px-2.5">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          </Link>
          <Link href={`/analysis/new?resume_id=${resume.id}`}>
            <Button size="sm" variant="secondary" className="gap-1 h-8 text-xs font-semibold px-2.5 text-primary bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Match JD</span>
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40"
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
              onDelete(resume.id);
            }
          }}
          title="Delete Resume"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
