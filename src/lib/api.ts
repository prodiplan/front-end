// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.prodiplan.my.id";

export const API_ENDPOINTS = {
  // Auth endpoints - using /v1 prefix as per API documentation
  auth: {
    register: `${API_BASE_URL}/v1/auth/register`,
    login: `${API_BASE_URL}/v1/auth/login`,
    refresh: `${API_BASE_URL}/v1/auth/refresh`,
    me: `${API_BASE_URL}/v1/auth/me`,
    profile: `${API_BASE_URL}/v1/auth/profile`,
    logout: `${API_BASE_URL}/v1/auth/logout`,
    forgotPassword: `${API_BASE_URL}/v1/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/v1/auth/reset-password`,
    changePassword: `${API_BASE_URL}/v1/auth/change-password`,
    deleteUser: `${API_BASE_URL}/v1/auth/user`,
  },
  // Grading Session endpoints
  grading: {
    createSession: `${API_BASE_URL}/v1/grading-sessions`,
    getSession: (id: string) => `${API_BASE_URL}/v1/grading-sessions/${id}`,
    listSessions: `${API_BASE_URL}/v1/grading-sessions`,
    completeSession: (id: string) =>
      `${API_BASE_URL}/v1/grading-sessions/${id}/complete`,
    deleteSession: (id: string) => `${API_BASE_URL}/v1/grading-sessions/${id}`,
  },
  // Messages endpoints
  messages: {
    list: (sessionId: string) =>
      `${API_BASE_URL}/v1/grading-sessions/${sessionId}/messages`,
    send: (sessionId: string) =>
      `${API_BASE_URL}/v1/grading-sessions/${sessionId}/messages`,
  },
  // Grading Results endpoints
  results: {
    get: (sessionId: string) =>
      `${API_BASE_URL}/v1/grading-results/${sessionId}`,
    list: `${API_BASE_URL}/v1/grading-results`,
    statistics: `${API_BASE_URL}/v1/grading-results/statistics`,
  },
};

/**
 * Custom error class untuk API errors
 */
export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  
  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper with default headers
 */
export async function apiCall(
  url: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new ApiError(
      `Failed to parse response: ${response.statusText}`,
      response.status
    );
  }

  if (!response.ok) {
    const errorMessage =
      data.error?.message || data.message || `API Error: ${response.status}`;
    const errorCode = data.error?.code || data.code;
    throw new ApiError(errorMessage, response.status, errorCode);
  }

  return data;
}
