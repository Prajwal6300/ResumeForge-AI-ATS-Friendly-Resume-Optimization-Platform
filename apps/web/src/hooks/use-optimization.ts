"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AISuggestion, AISuggestionStatus, Resume } from "@/types";

export interface AISectionImprovementResult {
  section: string;
  item_id?: string;
  original_text: string;
  improved_text: string;
  changes_made: string[];
  reasoning: string;
  keywords_integrated: string[];
  anti_fabrication_notice: string;
}

export interface AIRewriteBulletResult {
  original_bullet: string;
  suggested_bullet: string;
  alternative_options: string[];
  impact_score_delta: string;
  rationale: string;
  matched_skills: string[];
}

export function useOptimization(resumeId: string) {
  const queryClient = useQueryClient();

  const suggestionsQuery = useQuery({
    queryKey: ["resume-suggestions", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const res = await apiClient.get<AISuggestion[]>(`/resumes/${resumeId}/suggestions`);
      return res.data;
    },
    enabled: !!resumeId,
  });

  const improveSectionMutation = useMutation({
    mutationFn: async (payload: {
      resume_id: string;
      section: string;
      item_id?: string;
      field?: string;
      current_content: string;
      jd_id?: string;
      instruction?: string;
      goal?: string;
    }) => {
      const res = await apiClient.post<AISectionImprovementResult>("/optimization/section", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-suggestions", resumeId] });
    },
  });

  const rewriteBulletMutation = useMutation({
    mutationFn: async (payload: {
      resume_id: string;
      original_bullet: string;
      jd_id?: string;
      goal?: string;
    }) => {
      const res = await apiClient.post<AIRewriteBulletResult>("/optimization/bullet", payload);
      return res.data;
    },
  });

  const optimizeFullResumeMutation = useMutation({
    mutationFn: async (payload: {
      resume_id: string;
      jd_id: string;
      version_title?: string;
    }) => {
      const res = await apiClient.post<Resume>("/optimization/full-resume", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["resume", resumeId], data);
      queryClient.invalidateQueries({ queryKey: ["resume-versions", resumeId] });
    },
  });

  const updateSuggestionMutation = useMutation({
    mutationFn: async (payload: { suggestionId: string; status: AISuggestionStatus }) => {
      const res = await apiClient.patch<AISuggestion>(`/suggestions/${payload.suggestionId}`, {
        status: payload.status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-suggestions", resumeId] });
    },
  });

  return {
    suggestions: suggestionsQuery.data || [],
    isLoadingSuggestions: suggestionsQuery.isLoading,
    improveSection: improveSectionMutation.mutateAsync,
    isImprovingSection: improveSectionMutation.isPending,
    rewriteBullet: rewriteBulletMutation.mutateAsync,
    isRewritingBullet: rewriteBulletMutation.isPending,
    optimizeFullResume: optimizeFullResumeMutation.mutateAsync,
    isOptimizingFull: optimizeFullResumeMutation.isPending,
    updateSuggestionStatus: updateSuggestionMutation.mutateAsync,
  };
}
