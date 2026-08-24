"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ResumeAnalysis } from "@/types";

export function useAnalyses() {
  const queryClient = useQueryClient();

  const analysesQuery = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      const res = await apiClient.get<ResumeAnalysis[]>("/analyses");
      return res.data;
    },
  });

  const runAnalysisMutation = useMutation({
    mutationFn: async (payload: { resume_id: string; jd_id: string; resume_version_id?: string }) => {
      const res = await apiClient.post<ResumeAnalysis>("/analyses", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["analysis", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });

  return {
    analyses: analysesQuery.data || [],
    isLoading: analysesQuery.isLoading,
    error: analysesQuery.error,
    runAnalysis: runAnalysisMutation.mutateAsync,
    isAnalyzing: runAnalysisMutation.isPending,
  };
}

export function useAnalysisDetail(analysisId: string) {
  return useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: async () => {
      if (!analysisId) return null;
      const res = await apiClient.get<ResumeAnalysis>(`/analyses/${analysisId}`);
      return res.data;
    },
    enabled: !!analysisId,
  });
}
