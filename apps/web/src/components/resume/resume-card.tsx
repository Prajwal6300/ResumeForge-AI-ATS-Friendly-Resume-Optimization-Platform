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
  return (
    <Card className="flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold truncate max-w-[200px] sm:max-w-[240px]">
                {resume.title}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(resume.updated_at)}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize text-[11px]">
            {resume.file_type || "manual"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 pb-3 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>{resume.version_count || 1} Version{(resume.version_count || 1) > 1 ? "s" : ""}</span>
          </div>
          {resume.parsed_content?.experience?.length > 0 && (
            <span>&bull; {resume.parsed_content.experience.length} Roles</span>
          )}
          {resume.parsed_content?.skills?.length > 0 && (
            <span>&bull; {resume.parsed_content.skills.reduce((acc, cat) => acc + cat.items.length, 0)} Skills</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t bg-muted/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/resumes/${resume.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
          </Link>
          <Link href={`/resumes/${resume.id}/edit`}>
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          </Link>
          <Link href={`/analysis/new?resume_id=${resume.id}`}>
            <Button variant="secondary" size="sm" className="gap-1.5 h-8 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Match JD</span>
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
              onDelete(resume.id);
            }
          }}
          title="Delete Resume"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
