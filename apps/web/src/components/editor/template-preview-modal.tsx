"use client";

import React, { useState } from "react";
import { Download, FileText, Check, LayoutTemplate, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { TemplateId } from "@/types";

interface TemplatePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

const TEMPLATES: Array<{ id: TemplateId; name: string; desc: string; atsRating: string; color: string }> = [
  {
    id: "classic",
    name: "Classic ATS",
    desc: "Single-column traditional layout with standard typography. Maximum compatibility with all legacy and modern ATS systems.",
    atsRating: "99% ATS Score",
    color: "border-gray-900 bg-gray-50",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Navy blue accented headings with clean aligned metadata and structured skill tables.",
    atsRating: "98% ATS Score",
    color: "border-blue-800 bg-blue-50/50",
  },
  {
    id: "modern",
    name: "Modern Minimal",
    desc: "Teal accents with clean typography and high whitespace efficiency for tech roles.",
    atsRating: "98% ATS Score",
    color: "border-teal-700 bg-teal-50/50",
  },
  {
    id: "minimal",
    name: "Pure Minimal",
    desc: "Distraction-free high contrast formatting for maximum parsing speed.",
    atsRating: "99% ATS Score",
    color: "border-neutral-700 bg-neutral-50/50",
  },
];

export function TemplatePreviewModal({ open, onOpenChange, resumeId }: TemplatePreviewModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDOCX, setIsExportingDOCX] = useState(false);

  const handleExport = async (format: "pdf" | "docx") => {
    try {
      if (format === "pdf") setIsExportingPDF(true);
      else setIsExportingDOCX(true);

      const res = await apiClient.post("/exports", {
        resume_id: resumeId,
        format,
        template: selectedTemplate,
      });

      const { download_url, filename } = res.data;

      // Trigger browser file download
      const downloadRes = await apiClient.get(download_url, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      alert("Failed to export document: " + (e.message || "Unknown error"));
    } finally {
      setIsExportingPDF(false);
      setIsExportingDOCX(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-6 sm:p-8 rounded-2xl">
        <DialogHeader className="mb-3 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                <span>ATS Resume Preview & Export</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select an ATS-parsed layout and download a compliant PDF or DOCX file.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isExportingDOCX}
                onClick={() => handleExport("docx")}
                className="gap-1.5 text-xs h-9 font-semibold shadow-subtle"
              >
                {isExportingDOCX ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                <span>Export DOCX</span>
              </Button>
              <Button
                size="sm"
                variant="gradient"
                disabled={isExportingPDF}
                onClick={() => handleExport("pdf")}
                className="gap-1.5 text-xs h-9 font-bold shadow-subtle hover:shadow-glow"
              >
                {isExportingPDF ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                <span>Export PDF</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedTemplate === tpl.id
                  ? "border-primary bg-indigo-50/50 dark:bg-indigo-950/30 shadow-subtle ring-1 ring-primary"
                  : "border-border/70 hover:border-primary/40 bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-foreground">{tpl.name}</span>
                {selectedTemplate === tpl.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
              <Badge variant="success" className="text-[9px] py-0 px-2 font-semibold">
                {tpl.atsRating}
              </Badge>
            </button>
          ))}
        </div>

        {/* Live Rendered Preview Frame */}
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-white shadow-card h-[520px]">
          <iframe
            src={`/api/v1/resumes/${resumeId}/preview?template=${selectedTemplate}`}
            className="w-full h-full border-0 bg-white"
            title="Resume Live ATS Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
