import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AntiFabricationBanner() {
  return (
    <Alert variant="info" className="bg-blue-50/70 border-blue-200 dark:bg-blue-950/40">
      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-xs font-semibold text-blue-900 dark:text-blue-200">
        Anti-Fabrication & Factual Integrity Guarantee
      </AlertTitle>
      <AlertDescription className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
        ResumeForge AI optimizes the phrasing, impact, and structure of your authentic qualifications.
        If a target Job Description lists required skills you do not currently possess, we will highlight them as missing — never fabricate false experience to artificially inflate scores.
      </AlertDescription>
    </Alert>
  );
}
