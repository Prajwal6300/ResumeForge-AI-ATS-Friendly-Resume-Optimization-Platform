"use client";

import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  FileText,
  Briefcase,
  ArrowRight,
  Zap,
  Target,
  FileCheck,
  Layers,
  Lock,
  Code2,
  KeyRound,
  ListChecks,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border/80 subtle-mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-5xl space-y-7">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-300 text-xs font-semibold shadow-subtle animate-fade-in">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Factual AI &bull; Strict Anti-Fabrication Guarantee</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Build an ATS-Optimized Resume <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-200">
              Without Hallucinated Experience.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Upload your resume and target job posting. Get a deterministic 5-pillar mathematical score, identify missing keywords, and tailor your bullet achievements with AI grounded strictly in your real career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2 text-sm font-bold shadow-card hover:shadow-glow">
                <span>{user ? "Go to Dashboard" : "Start Optimizing Free"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-semibold">
                Explore ATS Templates
              </Button>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Explainable 0-100 Math Score</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Zero Fake Experience Generation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Selectable-Text PDF & DOCX</span>
            </span>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-dropdown text-left transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-subtle">
                    88%
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      Senior Software Engineer &bull; Target Compatibility Report
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Algorithmic Match &bull; 40% Keyword &bull; 25% Tech Skills &bull; 20% Duties
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="self-start sm:self-auto text-xs font-bold py-1 px-2.5">
                  Strong Match (Tier 1)
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Matched Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="success" className="text-[11px] py-0 px-2 font-normal">Python</Badge>
                    <Badge variant="success" className="text-[11px] py-0 px-2 font-normal">FastAPI</Badge>
                    <Badge variant="success" className="text-[11px] py-0 px-2 font-normal">PostgreSQL</Badge>
                    <Badge variant="success" className="text-[11px] py-0 px-2 font-normal">Docker</Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Missing (Actionable)</span>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="danger" className="text-[11px] py-0 px-2 font-normal">+ Redis</Badge>
                    <Badge variant="danger" className="text-[11px] py-0 px-2 font-normal">+ AWS ECS</Badge>
                    <Badge variant="danger" className="text-[11px] py-0 px-2 font-normal">+ GraphQL</Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">AI Bullet Optimization</span>
                  <p className="text-xs text-foreground font-medium line-clamp-2">
                    &quot;Engineered REST APIs with FastAPI, reducing query latency by 42% across 500k daily requests.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-PILLAR ATS METHODOLOGY */}
      <section className="py-20 bg-muted/20 border-b border-border/80">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
              Transparent Mathematical Scoring
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How Your ATS Score is Calculated
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              No black-box guesses. We evaluate your resume against the target role using 5 deterministic, explainable criteria totaling exactly 100%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/40 hover:shadow-card-hover transition-all">
              <CardContent className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-primary font-black text-sm shadow-subtle">
                    40%
                  </div>
                  <Badge variant="info">Primary Pillar</Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Keyword Relevance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Exact and semantic synonym matching for core keywords from the job description across your entire resume.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 hover:shadow-card-hover transition-all">
              <CardContent className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/70 border border-violet-200/80 dark:border-violet-800 flex items-center justify-center text-violet-600 font-black text-sm shadow-subtle">
                    25%
                  </div>
                  <Badge variant="secondary">Critical</Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Technical Skills Alignment</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct coverage of mandatory programming languages, frameworks, databases, and DevOps tools.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 hover:shadow-card-hover transition-all">
              <CardContent className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800 flex items-center justify-center text-teal-600 font-black text-sm shadow-subtle">
                    20%
                  </div>
                  <Badge variant="secondary">Alignment</Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Responsibilities Coverage</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  How closely your work accomplishments and projects map to the target role’s day-to-day duties.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 hover:shadow-card-hover transition-all">
              <CardContent className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800 flex items-center justify-center text-purple-600 font-black text-sm shadow-subtle">
                    10%
                  </div>
                  <Badge variant="outline">Depth</Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Experience Depth</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluation of career progression, leadership scope, and chronological alignment with role seniority.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 hover:shadow-card-hover transition-all md:col-span-2">
              <CardContent className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center text-amber-600 font-black text-sm shadow-subtle">
                    5%
                  </div>
                  <Badge variant="warning">Compliance</Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Formatting & ATS Structure</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verification of standard heading conventions, contact completeness, bullet metrics, and single-column layout parseability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES BENTO GRID */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Engineered for High-Stakes Career Applications
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Every capability is designed to help you tailor multiple resumes cleanly without losing control of your data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-primary shadow-subtle">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">PDF & DOCX Parsing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Extracts layout structure, headings, dates, skills, and bullet achievements with high fidelity.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 shadow-subtle">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">XYZ Bullet Optimizer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transforms passive phrases into active verbs with measurable business metrics and impact scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 shadow-subtle">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Immutable Version Control</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your original resume is never overwritten. Roll back to any snapshot with 1-click safety.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 shadow-subtle">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">100% ATS-Compliant Exporters</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generates clean, selectable-text PDFs (ReportLab) and styled Word DOCX files with verified parseability.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shadow-subtle">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Prompt Injection Defense</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Adversarial instructions inside pasted job descriptions are safely isolated and never executed.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-subtle hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 shadow-subtle">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Zero Data Fabrication</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Missing skills are clearly marked as recommendations to add only if supported by real experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY CTA BANNER */}
      <section className="py-16 bg-gradient-to-tr from-zinc-900 via-indigo-950 to-zinc-900 text-white text-center border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-subtle">
            <Sparkles className="h-6 w-6 text-indigo-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Optimize Your Resume with Precision?
          </h2>
          <p className="text-zinc-300 text-sm max-w-xl mx-auto leading-relaxed">
            Upload your resume now and get your instant explainable ATS score and keyword gap matrix in seconds.
          </p>
          <div className="pt-2">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold shadow-lg text-sm px-8">
                Get Started Free Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
