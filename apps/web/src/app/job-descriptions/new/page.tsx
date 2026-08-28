"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, UploadCloud, Briefcase, Building, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JDPasteForm } from "@/components/job-description/jd-paste-form";
import { useJobDescriptions } from "@/hooks/use-job-descriptions";

export default function NewJobDescriptionPage() {
  const router = useRouter();
  const { pasteJD, uploadJD, isPasting, isUploading } = useJobDescriptions();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCompany, setUploadCompany] = useState("");

  const handlePasteSubmit = async (data: { title: string; company?: string; raw_text: string }) => {
    const created = await pasteJD(data);
    router.push(`/job-descriptions/${created.id}`);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    const titleFallback = uploadFile.name.includes(".")
      ? uploadFile.name.substring(0, uploadFile.name.lastIndexOf("."))
      : uploadFile.name;
    const created = await uploadJD({
      file: uploadFile,
      title: uploadTitle.trim() || titleFallback,
      company: uploadCompany.trim() || undefined,
    });
    router.push(`/job-descriptions/${created.id}`);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/job-descriptions">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Add Target Job Description</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Paste or upload a job posting to extract required technical skills, criteria, and responsibilities.
            </p>
          </div>
        </div>

        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="paste" className="text-xs font-bold gap-2">
              <Edit3 className="h-4 w-4" />
              <span>Paste Job Text</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs font-bold gap-2">
              <UploadCloud className="h-4 w-4" />
              <span>Upload PDF / Word</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste">
            <JDPasteForm onSubmit={handlePasteSubmit} isSubmitting={isPasting} />
          </TabsContent>

          <TabsContent value="upload">
            <Card className="border border-border/80 shadow-dropdown overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Job Title (Optional)</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Company (Optional)</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Stripe / Amazon"
                        value={uploadCompany}
                        onChange={(e) => setUploadCompany(e.target.value)}
                        className="h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Select PDF or Word Document <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      required
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="flex h-10 w-full rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary cursor-pointer shadow-subtle"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    variant="gradient"
                    className="w-full h-10 gap-2 font-bold text-xs sm:text-sm shadow-subtle mt-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Extracting Criteria & Requirements...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        <span>Upload & Analyze Job Description</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
