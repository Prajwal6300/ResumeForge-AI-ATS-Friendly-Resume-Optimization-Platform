import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 text-muted-foreground text-sm">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground text-base">ResumeForge AI</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              AI-Powered ATS Resume Optimization & Job Matching Platform. Built with deterministic mathematical scoring and strict Anti-Fabrication guardrails.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-200 max-w-md">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Strict Factual Integrity: AI never fabricates fake qualifications or experiences.</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/resumes" className="hover:text-foreground">Resume Builder</Link></li>
              <li><Link href="/job-descriptions" className="hover:text-foreground">Job Descriptions</Link></li>
              <li><Link href="/analysis/new" className="hover:text-foreground">ATS Matcher</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">ATS Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">ATS Compatibility</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Explainable 0-100 Scoring</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Keyword & Synonym Gap Analysis</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Selectable-Text PDF Export</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Clean Microsoft Word DOCX</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
          <p className="text-muted-foreground">Deterministic ATS Compatibility Estimates. No fake data.</p>
        </div>
      </div>
    </footer>
  );
}
