"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, UploadCloud } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/job-descriptions">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Target Job Description</h1>
            <p className="text-xs text-muted-foreground">
              Paste or upload a job posting to extract required technical skills, criteria, and responsibilities.
            </p>
          </div>
        </div>

        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto mb-6">
            <TabsTrigger value="paste" className="text-xs gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Paste Text</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload PDF / Word</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste">
            <JDPasteForm onSubmit={handlePasteSubmit} isSubmitting={isPasting} />
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Amazon / Microsoft"
                        value={uploadCompany}
                        onChange={(e) => setUploadCompany(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Select PDF or Word Document</label>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      required
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary"
                    />
                  </div>

                  <Button type="submit" disabled={isUploading || !uploadFile} className="w-full gap-2 text-xs">
                    <UploadCloud className="h-4 w-4" />
                    <span>{isUploading ? "Extracting Criteria..." : "Upload & Analyze JD"}</span>
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
