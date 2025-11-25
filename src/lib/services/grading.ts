import { apiCall, API_ENDPOINTS } from "../api";
import {
  GradingSession,
  SessionMessage,
  GradingResult,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

export const gradingService = {
  // Grading Sessions
  createSession: async (
    data: {
      target_major: string;
      max_questions?: number;
      session_duration_minutes?: number;
    },
    token: string
  ) => {
    return apiCall(
      API_ENDPOINTS.grading.createSession,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<GradingSession>>;
  },

  getSession: async (sessionId: string, token: string) => {
    return apiCall(
      API_ENDPOINTS.grading.getSession(sessionId),
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<GradingSession>>;
  },

  listSessions: async (
    params: { status?: string; limit?: number; offset?: number } = {},
    token: string
  ) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const url = `${API_ENDPOINTS.grading.listSessions}?${queryParams.toString()}`;
    return apiCall(
      url,
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<{ sessions: GradingSession[]; pagination: any }>>;
  },

  completeSession: async (
    sessionId: string,
    data: { final_score: number; readiness_level: string },
    token: string
  ) => {
    return apiCall(
      API_ENDPOINTS.grading.completeSession(sessionId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<void>>;
  },

  // Messages
  getMessages: async (
    sessionId: string,
    params: { limit?: number; offset?: number } = {},
    token: string
  ) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const url = `${API_ENDPOINTS.messages.list(sessionId)}?${queryParams.toString()}`;
    return apiCall(
      url,
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<{ messages: SessionMessage[]; pagination: any }>>;
  },

  sendMessage: async (
    sessionId: string,
    data: { message_type: "question" | "answer"; content: string },
    token: string
  ) => {
    return apiCall(
      API_ENDPOINTS.messages.send(sessionId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<SessionMessage>>;
  },

  // Results
  getResult: async (sessionId: string, token: string) => {
    return apiCall(
      API_ENDPOINTS.results.get(sessionId),
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<GradingResult>>;
  },

  listResults: async (
    params: { readiness_level?: string; limit?: number; offset?: number } = {},
    token: string
  ) => {
    const queryParams = new URLSearchParams();
    if (params.readiness_level)
      queryParams.append("readiness_level", params.readiness_level);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const url = `${API_ENDPOINTS.results.list}?${queryParams.toString()}`;
    return apiCall(
      url,
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<{ results: GradingResult[]; pagination: any }>>; // Assuming 'results' key based on pattern
  },
};
