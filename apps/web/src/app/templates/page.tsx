"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Academic & Corporate",
    badge: "99% ATS Friendly",
    description: "Standard serif typography with subtle horizontal dividers. Ideal for traditional corporate roles, engineering, finance, and academia.",
    features: ["Single-column structure", "Standard section headings", "Clean bullet margins", "Full OCR & ATS parseability"],
    bestFor: "Software Engineers, Finance, Management, Fresh Graduates",
  },
  {
    id: "professional",
    name: "Professional Modern",
    badge: "98% ATS Friendly",
    description: "Modern sans-serif typography with navy blue headings. Balances executive polish with machine readability.",
    features: ["Deep navy accent styling", "Sub-header alignment", "High information density", "Standard date formatting"],
    bestFor: "Senior Developers, Tech Leads, Product Managers, Consultants",
  },
  {
    id: "modern",
    name: "Modern Tech & Design",
    badge: "98% ATS Friendly",
    description: "Clean teal accents with structured skill tagging. Tailored for startups, fast-growing tech companies, and tech roles.",
    features: ["Teal section markers", "Compact skill badge rows", "Optimized whitespace", "Clean contact header"],
    bestFor: "Full-Stack Engineers, DevOps, Data Scientists, UI/UX Engineers",
  },
  {
    id: "minimal",
    name: "Pure Minimalist",
    badge: "99% ATS Friendly",
    description: "Minimalist black and white hierarchy focusing 100% on quantifiable impact and clear readable typography.",
    features: ["Distraction-free layout", "Maximum text contrast", "Ultra-fast ATS parsing", "Crisp print margins"],
    bestFor: "Researchers, Architects, Systems Engineers",
  },
];

export default function TemplatesPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
          ATS-Compliant Document Gallery
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Engineered for Machine Parsing & Human Readability
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every ResumeForge template uses single-column layout hierarchies, standard headers, and zero unparseable graphics to ensure 100% ATS readability.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map((tpl) => (
          <Card key={tpl.id} className="flex flex-col justify-between border-2 hover:border-primary/40 transition-all shadow-sm">
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <CardTitle className="text-lg font-bold">{tpl.name}</CardTitle>
                <Badge variant="success" className="text-xs">
                  {tpl.badge}
                </Badge>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                {tpl.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-2 pb-4 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border">
                <span className="font-semibold text-foreground block mb-1">Best suited for:</span>
                <span className="text-muted-foreground">{tpl.bestFor}</span>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-foreground">ATS Features:</span>
                <ul className="grid grid-cols-2 gap-1.5 text-muted-foreground">
                  {tpl.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-3 border-t bg-muted/10 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Exports to PDF & DOCX</span>
              <Link href={user ? "/resumes/new" : "/register"}>
                <Button size="sm" className="gap-1 text-xs">
                  <span>Use Template</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
