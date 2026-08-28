import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 text-muted-foreground text-xs">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-subtle">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-foreground text-sm tracking-tight">
                ResumeForge<span className="text-primary font-black">AI</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Deterministic 5-pillar mathematical ATS resume optimization platform. Real keyword gap matrix, fact-grounded bullet rewriting, and ATS-native document exporters.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 max-w-md shadow-subtle">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-medium">Strict Factual Integrity: AI never fabricates fake qualifications, jobs, or credentials.</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-3.5">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Command Center</Link></li>
              <li><Link href="/resumes" className="hover:text-foreground transition-colors">Resume Workspace</Link></li>
              <li><Link href="/job-descriptions" className="hover:text-foreground transition-colors">Target Job Descriptions</Link></li>
              <li><Link href="/analysis/new" className="hover:text-foreground transition-colors">ATS Match Matrix</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors">ATS Template Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-3.5">ATS Guarantees</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Explainable 0-100 Mathematical Scoring</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Deep Keyword & Synonym Gap Matrix</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Native ReportLab PDF Exporter</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Styled Word DOCX Exporter</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">&bull;</span>
            <span className="text-muted-foreground hidden sm:inline">100% Anti-Fabrication Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
