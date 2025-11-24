import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingService } from '@/lib/services/grading';
import { useAuth } from '@/components/providers/auth-provider';
import { GradingSession, SessionMessage, GradingResult } from '@/types';

export function useCreateSession() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { target_major: string; max_questions?: number; session_duration_minutes?: number }) => {
      if (!token) throw new Error('Not authenticated');
      return gradingService.createSession(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grading-sessions'] });
    },
  });
}

export function useGradingSession(sessionId?: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['grading-session', sessionId],
    queryFn: async () => {
      if (!token || !sessionId) throw new Error('Not authenticated or no session ID');
      const response = await gradingService.getSession(sessionId, token);
      return response.data;
    },
    enabled: !!token && !!sessionId,
  });
}

export function useGradingSessions(params: { status?: string; limit?: number; offset?: number } = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['grading-sessions', params],
    queryFn: async () => {
      if (!token) throw new Error('Not authenticated');
      const response = await gradingService.listSessions(params, token);
      return response.data;
    },
    enabled: !!token,
  });
}

export function useCompleteSession() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: { final_score: number; readiness_level: string } }) => {
      if (!token) throw new Error('Not authenticated');
      return gradingService.completeSession(sessionId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grading-session', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['grading-sessions'] });
    },
  });
}

export function useSessionMessages(sessionId?: string, params: { limit?: number; offset?: number } = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['session-messages', sessionId, params],
    queryFn: async () => {
      if (!token || !sessionId) throw new Error('Not authenticated or no session ID');
      const response = await gradingService.getMessages(sessionId, params, token);
      return response.data;
    },
    enabled: !!token && !!sessionId,
  });
}

export function useSendMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: { message_type: 'question' | 'answer'; content: string } }) => {
      if (!token) throw new Error('Not authenticated');
      return gradingService.sendMessage(sessionId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session-messages', variables.sessionId] });
    },
  });
}

export function useGradingResult(sessionId?: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['grading-result', sessionId],
    queryFn: async () => {
      if (!token || !sessionId) throw new Error('Not authenticated or no session ID');
      const response = await gradingService.getResult(sessionId, token);
      return response.data;
    },
    enabled: !!token && !!sessionId,
  });
}

export function useGradingResults(params: { readiness_level?: string; limit?: number; offset?: number } = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['grading-results', params],
    queryFn: async () => {
      if (!token) throw new Error('Not authenticated');
      const response = await gradingService.listResults(params, token);
      return response.data;
    },
    enabled: !!token,
  });
}
