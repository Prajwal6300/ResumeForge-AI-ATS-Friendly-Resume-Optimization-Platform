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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-background to-background dark:from-blue-950/20 pt-16 pb-20 md:pt-24 md:pb-32 border-b">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm animate-pulse-subtle">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Factual AI &bull; Strict Anti-Fabrication Guarantee</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Beat ATS Filters with <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
              Explainable AI Optimization
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your resume and target job description. Get a mathematical 5-pillar ATS compatibility score, identify missing keywords, and optimize with AI that <strong className="text-foreground">never invents false qualifications</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2 text-sm font-semibold shadow-md">
                <span>{user ? "Go to Dashboard" : "Start Optimizing Free"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm">
                Browse ATS Templates
              </Button>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Explainable 5-Pillar Score
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Never Fabricates Experience
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> PDF & DOCX Export
            </span>
          </div>
        </div>
      </section>

      {/* 5-PILLAR ATS EXPLANATION */}
      <section className="py-20 bg-muted/20 border-b">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
              Deterministic Methodology
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How Your ATS Score is Actually Calculated
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              No black-box guesses. We evaluate your resume against the job description using 5 transparent, weighted criteria totaling 100%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-500/20 bg-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-bold text-sm">
                    40%
                  </span>
                  <Badge variant="info">Primary Pillar</Badge>
                </div>
                <h3 className="font-semibold text-base">Keyword Relevance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Exact and synonym matching for core keywords from the job description across your entire resume.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-500/20 bg-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    25%
                  </span>
                  <Badge variant="secondary">Critical</Badge>
                </div>
                <h3 className="font-semibold text-base">Technical Skills</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Alignment of mandatory programming languages, frameworks, databases, and cloud tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-500/20 bg-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 font-bold text-sm">
                    20%
                  </span>
                  <Badge variant="secondary">Alignment</Badge>
                </div>
                <h3 className="font-semibold text-base">Responsibilities Match</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  How closely your work accomplishments map to the target role’s day-to-day duties.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 font-bold text-sm">
                    10%
                  </span>
                  <Badge variant="outline">Depth</Badge>
                </div>
                <h3 className="font-semibold text-base">Experience Relevance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluation of career progression, leadership scope, and chronological alignment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-500/20 bg-card md:col-span-2">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 font-bold text-sm">
                    5%
                  </span>
                  <Badge variant="warning">Compliance</Badge>
                </div>
                <h3 className="font-semibold text-base">Resume Structure & Formatting</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verification of standard heading conventions, contact completeness, bullet metrics, and single-column layout parseability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Production Features for Real Job Seekers
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to tailor multiple resumes for specific applications without losing control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">PDF & DOCX Parsing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-precision structural extraction preserving personal info, dates, and bullet achievements.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">AI Section & Bullet Optimizer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rewrites bullets using strong action verbs and measurable XYZ impact formulas with 1-click preview.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Immutable Version Control</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your original resume is always preserved. Create snapshots and restore any previous version anytime.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">ATS-Friendly Templates</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Classic, Professional, Modern ATS, and Minimal designs guaranteed to be 100% parseable by ATS engines.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Prompt Injection Defense</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Adversarial instructions inside pasted job descriptions are safely isolated and never executed.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-2.5">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Zero Data Fabrication</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Missing skills are clearly marked as suggestions to add only if you possess genuine hands-on experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Optimize Your Resume for Your Dream Job?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Upload your resume now and get your instant explainable ATS score and keyword gap report in seconds.
          </p>
          <Link href={user ? "/dashboard" : "/register"}>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-lg text-sm">
              Get Started Free Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
