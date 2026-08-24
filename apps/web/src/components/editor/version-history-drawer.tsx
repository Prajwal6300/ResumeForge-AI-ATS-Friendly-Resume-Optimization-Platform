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
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span>Version History ({versions.length})</span>
        </h3>
        <span className="text-[11px] text-muted-foreground">Original Never Overwritten</span>
      </div>

      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className={`p-3.5 rounded-xl border transition-all ${
              ver.is_current
                ? "bg-primary/5 border-primary/40 shadow-sm"
                : "bg-background hover:bg-muted/30"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground">
                  Version {ver.version_number}
                </span>
                {ver.is_current && (
                  <Badge variant="default" className="text-[10px] h-4 py-0">
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
                    if (confirm(`Restore Version ${ver.version_number}? Current changes will be saved.`)) {
                      onRestore(ver.id);
                    }
                  }}
                  className="h-6 text-[11px] gap-1 px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restore</span>
                </Button>
              )}
            </div>

            <p className="text-xs font-medium text-muted-foreground line-clamp-1">{ver.title}</p>
            {ver.change_summary && (
              <p className="text-[11px] text-muted-foreground mt-1 italic">{ver.change_summary}</p>
            )}

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2 pt-2 border-t">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(ver.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
