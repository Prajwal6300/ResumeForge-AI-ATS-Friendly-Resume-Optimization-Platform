import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function AntiFabricationBanner() {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40 shadow-subtle flex items-start gap-3.5 transition-all">
      <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
        <ShieldCheck className="h-4.5 w-4.5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
          <span>Anti-Fabrication & Factual Integrity Guarantee</span>
        </h4>
        <p className="text-xs text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
          ResumeForge AI optimizes phrasing, action verbs, and ATS formatting for your authentic experience. Missing target keywords are flagged as recommendations — our engine <strong className="font-semibold text-emerald-950 dark:text-emerald-100">never fabricates fake qualifications</strong>.
        </p>
      </div>
    </div>
  );
}
