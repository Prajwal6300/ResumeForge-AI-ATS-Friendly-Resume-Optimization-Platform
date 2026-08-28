"use client";

import Link from "next/link";
import { Briefcase, Building, MapPin, Sparkles, Trash2, Calendar, Eye, ChevronRight } from "lucide-react";
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
    <Card className="flex flex-col justify-between border border-border/80 bg-card hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 group">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-200/80 dark:border-violet-800 flex items-center justify-center text-violet-600 shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base font-bold truncate">
                {jd.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {jd.company && (
                  <span className="flex items-center gap-1 font-medium truncate">
                    <Building className="h-3 w-3 shrink-0" /> {jd.company}
                  </span>
                )}
                <span>&bull; {formatDate(jd.created_at)}</span>
              </div>
            </div>
          </div>
          {jd.structured_content?.experience_level && (
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider shrink-0">
              {jd.structured_content.experience_level}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 pb-3 text-xs space-y-2">
        {reqSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {reqSkills.slice(0, 5).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px] font-normal py-0 px-2">
                {skill}
              </Badge>
            ))}
            {reqSkills.length > 5 && (
              <span className="text-[11px] text-muted-foreground self-center pl-1 font-medium">+{reqSkills.length - 5} more</span>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">No required skills extracted</p>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/job-descriptions/${jd.id}`}>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-2.5">
              <Eye className="h-3.5 w-3.5 mr-1" />
              <span>Details</span>
            </Button>
          </Link>
          <Link href={`/analysis/new?jd_id=${jd.id}`}>
            <Button size="sm" variant="gradient" className="gap-1 h-8 text-xs font-bold px-2.5 shadow-subtle hover:shadow-glow">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Match Resume</span>
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40"
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${jd.title}"?`)) {
              onDelete(jd.id);
            }
          }}
          title="Delete JD"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
