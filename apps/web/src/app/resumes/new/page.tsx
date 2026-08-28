"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Edit3, ShieldCheck, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/resume/resume-uploader";
import { AntiFabricationBanner } from "@/components/analysis/anti-fabrication-banner";
import { useResumes } from "@/hooks/use-resumes";

export default function NewResumePage() {
  const router = useRouter();
  const { uploadResume, createResume, isUploading } = useResumes();

  const handleUpload = async (file: File) => {
    const created = await uploadResume(file);
    router.push(`/resumes/${created.id}`);
  };

  const handleCreateEmpty = async () => {
    const created = await createResume({
      title: "Untitled Resume",
      parsed_content: {
        personal: { name: "", email: "" },
        summary: "",
        skills: [{ category: "Technical Skills", items: [] }],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        achievements: [],
      },
    });
    router.push(`/resumes/${created.id}/edit`);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/resumes">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Import or Create Resume</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Upload your existing document for AI parsing or build an ATS-compliant resume from scratch.
            </p>
          </div>
        </div>

        <AntiFabricationBanner />

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="upload" className="text-xs font-bold gap-2">
              <UploadCloud className="h-4 w-4" />
              <span>Upload PDF / DOCX</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-xs font-bold gap-2">
              <Edit3 className="h-4 w-4" />
              <span>Build from Scratch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <ResumeUploader onUpload={handleUpload} isUploading={isUploading} />
          </TabsContent>

          <TabsContent value="manual">
            <Card className="border border-border/80 shadow-dropdown overflow-hidden">
              <CardHeader className="p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary mx-auto shadow-subtle">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Start with a Blank ATS Template</CardTitle>
                <CardDescription className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Create a structured resume from the ground up using our interactive section editor, XYZ action-verb generator, and live preview.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 text-center">
                <Button onClick={handleCreateEmpty} variant="gradient" size="lg" className="gap-2 font-bold text-xs shadow-subtle">
                  <Edit3 className="h-4 w-4" />
                  <span>Launch Blank Resume Studio</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
