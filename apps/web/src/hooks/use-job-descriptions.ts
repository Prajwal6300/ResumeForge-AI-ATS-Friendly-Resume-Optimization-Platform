"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { JobDescription } from "@/types";

export function useJobDescriptions() {
  const queryClient = useQueryClient();

  const jdsQuery = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: async () => {
      const res = await apiClient.get<JobDescription[]>("/job-descriptions");
      return res.data;
    },
  });

  const pasteJDMutation = useMutation({
    mutationFn: async (payload: { title: string; company?: string; raw_text: string }) => {
      const res = await apiClient.post<JobDescription>("/job-descriptions/paste", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
    },
  });

  const uploadJDMutation = useMutation({
    mutationFn: async (payload: { file: File; title: string; company?: string }) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("title", payload.title);
      if (payload.company) formData.append("company", payload.company);
      const res = await apiClient.post<JobDescription>("/job-descriptions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
    },
  });

  const deleteJDMutation = useMutation({
    mutationFn: async (jdId: string) => {
      await apiClient.delete(`/job-descriptions/${jdId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
    },
  });

  return {
    jobDescriptions: jdsQuery.data || [],
    isLoading: jdsQuery.isLoading,
    error: jdsQuery.error,
    pasteJD: pasteJDMutation.mutateAsync,
    isPasting: pasteJDMutation.isPending,
    uploadJD: uploadJDMutation.mutateAsync,
    isUploading: uploadJDMutation.isPending,
    deleteJD: deleteJDMutation.mutateAsync,
  };
}

export function useJobDescriptionDetail(jdId: string) {
  return useQuery({
    queryKey: ["job-description", jdId],
    queryFn: async () => {
      if (!jdId) return null;
      const res = await apiClient.get<JobDescription>(`/job-descriptions/${jdId}`);
      return res.data;
    },
    enabled: !!jdId,
  });
}
