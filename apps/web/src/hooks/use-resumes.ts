"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Resume, ResumeVersion, StructuredResumeContent } from "@/types";

export function useResumes() {
  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await apiClient.get<Resume[]>("/resumes");
      return res.data;
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post<Resume>("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const createResumeMutation = useMutation({
    mutationFn: async (payload: { title: string; parsed_content?: StructuredResumeContent }) => {
      const res = await apiClient.post<Resume>("/resumes", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      await apiClient.delete(`/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  return {
    resumes: resumesQuery.data || [],
    isLoading: resumesQuery.isLoading,
    error: resumesQuery.error,
    uploadResume: uploadResumeMutation.mutateAsync,
    isUploading: uploadResumeMutation.isPending,
    createResume: createResumeMutation.mutateAsync,
    deleteResume: deleteResumeMutation.mutateAsync,
  };
}

export function useResumeDetail(resumeId: string) {
  const queryClient = useQueryClient();

  const resumeQuery = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: async () => {
      if (!resumeId) return null;
      const res = await apiClient.get<Resume>(`/resumes/${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });

  const updateResumeMutation = useMutation({
    mutationFn: async (payload: { parsed_content: StructuredResumeContent; title?: string; change_summary?: string }) => {
      const res = await apiClient.put<Resume>(`/resumes/${resumeId}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["resume", resumeId], data);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume-versions", resumeId] });
    },
  });

  const versionsQuery = useQuery({
    queryKey: ["resume-versions", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const res = await apiClient.get<ResumeVersion[]>(`/resumes/${resumeId}/versions`);
      return res.data;
    },
    enabled: !!resumeId,
  });

  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const res = await apiClient.post<Resume>(`/resumes/${resumeId}/versions/${versionId}/restore`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["resume", resumeId], data);
      queryClient.invalidateQueries({ queryKey: ["resume-versions", resumeId] });
    },
  });

  return {
    resume: resumeQuery.data,
    isLoading: resumeQuery.isLoading,
    error: resumeQuery.error,
    updateResume: updateResumeMutation.mutateAsync,
    isSaving: updateResumeMutation.isPending,
    versions: versionsQuery.data || [],
    isLoadingVersions: versionsQuery.isLoading,
    restoreVersion: restoreVersionMutation.mutateAsync,
    isRestoring: restoreVersionMutation.isPending,
  };
}
