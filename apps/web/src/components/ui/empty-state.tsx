import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionIcon: ActionIcon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-4 max-w-md mx-auto my-6",
        className
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-card border border-border/80 shadow-subtle flex items-center justify-center text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-bold text-base text-foreground tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm" variant="gradient" className="gap-2 text-xs font-semibold">
                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                <span>{actionLabel}</span>
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="gradient" onClick={onAction} className="gap-2 text-xs font-semibold">
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              <span>{actionLabel}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
