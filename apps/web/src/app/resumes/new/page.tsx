"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Edit3, ShieldCheck } from "lucide-react";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/resumes">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Resume</h1>
            <p className="text-xs text-muted-foreground">
              Upload your existing document or build an ATS resume from scratch.
            </p>
          </div>
        </div>

        <AntiFabricationBanner />

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto mb-6">
            <TabsTrigger value="upload" className="text-xs gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload PDF / DOCX</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-xs gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Build from Scratch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <ResumeUploader onUpload={handleUpload} isUploading={isUploading} />
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader className="p-6 text-center space-y-2">
                <CardTitle className="text-lg font-semibold">Start with a Blank ATS Template</CardTitle>
                <CardDescription className="text-xs max-w-md mx-auto">
                  Create a structured resume from the ground up using our interactive section editor and AI writing assistants.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center">
                <Button onClick={handleCreateEmpty} variant="gradient" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Open Resume Editor</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
