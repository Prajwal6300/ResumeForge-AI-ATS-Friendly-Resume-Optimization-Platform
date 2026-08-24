"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      setErrorMessage("File size exceeds 10MB limit.");
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
      setUploadStep("Uploading file...");
      setTimeout(() => setUploadStep("Parsing layout & text streams..."), 500);
      setTimeout(() => setUploadStep("Extracting structured resume sections..."), 1200);
      await onUpload(selectedFile);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload and parse resume.");
      setUploadStep("");
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">
                Drag and drop your resume here, or <span className="text-primary font-semibold underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF and DOCX documents (up to 10MB)
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {selectedFile && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto truncate">
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="truncate text-left">
                <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull; {selectedFile.name.endsWith(".pdf") ? "PDF Document" : "Word Document"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full sm:w-auto gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{uploadStep || "Processing..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
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
