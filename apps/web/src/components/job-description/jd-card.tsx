"use client";

import Link from "next/link";
import { Briefcase, Building, MapPin, Sparkles, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { JobDescription } from "@/types";

interface JDCardProps {
  jd: JobDescription;
  onDelete: (id: string) => Promise<void>;
}

export function JDCard({ jd, onDelete }: JDCardProps) {
  const reqSkills = jd.structured_content?.required_skills || [];

  return (
    <Card className="flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold truncate max-w-[200px] sm:max-w-[240px]">
                {jd.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {jd.company && (
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" /> {jd.company}
                  </span>
                )}
                <span>&bull; {formatDate(jd.created_at)}</span>
              </div>
            </div>
          </div>
          {jd.structured_content?.experience_level && (
            <Badge variant="outline" className="text-[10px]">
              {jd.structured_content.experience_level}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 pb-3 text-xs space-y-2">
        {reqSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {reqSkills.slice(0, 5).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px] font-normal">
                {skill}
              </Badge>
            ))}
            {reqSkills.length > 5 && (
              <span className="text-[11px] text-muted-foreground self-center">+{reqSkills.length - 5} more</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t bg-muted/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/job-descriptions/${jd.id}`}>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              View Details
            </Button>
          </Link>
          <Link href={`/analysis/new?jd_id=${jd.id}`}>
            <Button size="sm" variant="gradient" className="gap-1.5 h-8 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Match Resume</span>
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${jd.title}"?`)) {
              onDelete(jd.id);
            }
          }}
          title="Delete JD"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
