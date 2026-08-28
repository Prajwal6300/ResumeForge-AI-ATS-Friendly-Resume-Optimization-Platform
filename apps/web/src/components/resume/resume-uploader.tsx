"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function ResumeUploader({ onUpload, isUploading = false }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setErrorMessage("Unsupported format. Please upload a PDF or Word DOCX file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds the 10MB limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    try {
      setUploadStep("Uploading document...");
      setTimeout(() => setUploadStep("Parsing layout & text streams..."), 600);
      setTimeout(() => setUploadStep("Extracting structured resume sections..."), 1300);
      await onUpload(selectedFile);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload and parse resume.");
      setUploadStep("");
    }
  };

  return (
    <Card className="w-full border border-border/80 shadow-dropdown overflow-hidden">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-primary bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99] shadow-glow"
              : "border-border/80 bg-muted/10 hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-primary shadow-subtle group-hover:scale-105 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm sm:text-base text-foreground">
                Drop your resume here, or <span className="text-primary underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Select a standard single or multi-page resume document
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2">
                PDF (.pdf)
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2">
                Word (.docx)
              </Badge>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2">
                Max 10 MB
              </Badge>
            </div>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="py-2.5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {selectedFile && (
          <div className="p-4 rounded-xl border border-border/80 bg-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle animate-fade-in">
            <div className="flex items-center gap-3 w-full sm:w-auto truncate">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="truncate text-left">
                <p className="font-bold text-xs sm:text-sm truncate text-foreground">{selectedFile.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull; {selectedFile.name.endsWith(".pdf") ? "PDF Document" : "Word DOCX"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              variant="gradient"
              className="w-full sm:w-auto gap-2 font-bold text-xs shadow-subtle shrink-0"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{uploadStep || "Parsing Document..."}</span>
                </>
              ) : (
                <>
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Parse & Import Resume</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
