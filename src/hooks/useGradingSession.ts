import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gradingService } from "@/lib/services/grading";
import { useAuth } from "@/components/providers/auth-provider";
import {
  GradingSession,
  SessionMessage,
  SendMessageResponse,
  GradingResult,
} from "@/types";

export function useCreateSession() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      target_major: string;
      max_questions?: number;
      session_duration_minutes?: number;
    }) => {
      if (!token) throw new Error("Not authenticated");
      return gradingService.createSession(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grading-sessions", user?.id],
      });
    },
  });
}

export function useGradingSession(sessionId?: string) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["grading-session", user?.id, sessionId],
    queryFn: async () => {
      if (!token || !sessionId)
        throw new Error("Not authenticated or no session ID");
      const response = await gradingService.getSession(sessionId, token);
      return response.data;
    },
    enabled: !!token && !!sessionId,
    retry: 2, // Retry up to 2 times if data is not ready
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff: 1s, 2s
  });
}

export function useGradingSessions(
  params: { status?: string; limit?: number; offset?: number } = {},
) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["grading-sessions", user?.id, params],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await gradingService.listSessions(params, token);
      return response.data;
    },
    enabled: !!token && !!user,
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useCompleteSession() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data?: { final_score?: number; readiness_level?: string };
    }) => {
      if (!token) throw new Error("Not authenticated");
      return gradingService.completeSession(sessionId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["grading-session", user?.id, variables.sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["grading-sessions", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["grading-results", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["grading-result", user?.id, variables.sessionId],
      });
    },
  });
}

export function useSessionMessages(
  sessionId?: string,
  params: { limit?: number; offset?: number } = {},
) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["session-messages", user?.id, sessionId, params],
    queryFn: async () => {
      if (!token || !sessionId)
        throw new Error("Not authenticated or no session ID");
      const response = await gradingService.getMessages(
        sessionId,
        params,
        token,
      );
      return response.data;
    },
    enabled: !!token && !!sessionId,
  });
}

export function useSendMessage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: { message_type: "question" | "answer"; content: string };
    }) => {
      if (!token) throw new Error("Not authenticated");
      return gradingService.sendMessage(sessionId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-messages", user?.id, variables.sessionId],
      });
    },
  });
}

export function useGradingResult(sessionId?: string) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["grading-result", user?.id, sessionId],
    queryFn: async () => {
      if (!token || !sessionId)
        throw new Error("Not authenticated or no session ID");
      const response = await gradingService.getResult(sessionId, token);
      return response.data;
    },
    enabled: !!token && !!sessionId,
    retry: 3, // Retry up to 3 times if data is not ready
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff: 1s, 2s, 4s
    refetchInterval: (query) => {
      // Keep refetching every 5 seconds if:
      // 1. Data is not available yet, OR
      // 2. Verification status is still pending
      if (!query.state.data) return 2000; // Check every 2s if no data yet
      if (query.state.data.verification_status === "pending") return 5000; // Check every 5s if pending
      return false; // Stop refetching if approved or rejected
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useGradingResults(
  params: { readiness_level?: string; limit?: number; offset?: number } = {},
) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["grading-results", user?.id, params],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      const response = await gradingService.listResults(params, token);
      return response.data;
    },
    enabled: !!token && !!user,
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3000, // Auto-refetch every 3 seconds to detect new results
  });
}
