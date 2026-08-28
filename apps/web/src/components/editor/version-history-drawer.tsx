"use client";

import React from "react";
import { History, RotateCcw, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { ResumeVersion } from "@/types";

interface VersionHistoryDrawerProps {
  versions: ResumeVersion[];
  onRestore: (versionId: string) => Promise<void>;
  isRestoring?: boolean;
  onClose?: () => void;
}

export function VersionHistoryDrawer({ versions, onRestore, isRestoring = false }: VersionHistoryDrawerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
          <History className="h-4 w-4 text-primary" />
          <span>Version History ({versions.length})</span>
        </h3>
        <Badge variant="outline" className="text-[10px] font-bold">
          Immutable Snapshots
        </Badge>
      </div>

      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className={`p-4 rounded-2xl border transition-all ${
              ver.is_current
                ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/60 shadow-subtle"
                : "bg-card border-border/70 hover:bg-muted/30 hover:border-primary/40 shadow-subtle"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-foreground">
                  Version {ver.version_number}
                </span>
                {ver.is_current && (
                  <Badge variant="success" className="text-[10px] font-bold py-0">
                    Active
                  </Badge>
                )}
              </div>

              {!ver.is_current && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isRestoring}
                  onClick={() => {
                    if (confirm(`Restore Version ${ver.version_number}? Current changes will be preserved as a new version.`)) {
                      onRestore(ver.id);
                    }
                  }}
                  className="h-7 text-xs font-semibold gap-1 px-2.5 shadow-subtle hover:bg-primary hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restore</span>
                </Button>
              )}
            </div>

            <p className="text-xs font-bold text-foreground line-clamp-1">{ver.title}</p>
            {ver.change_summary && (
              <p className="text-[11px] text-muted-foreground mt-1 italic leading-relaxed">{ver.change_summary}</p>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2.5 pt-2 border-t border-border/50">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(ver.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
