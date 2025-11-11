// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

export const API_ENDPOINTS = {
  // Auth endpoints - v1/auth prefix
  auth: {
    register: `${API_BASE_URL}/v1/auth/register`,
    login: `${API_BASE_URL}/v1/auth/login`,
    refresh: `${API_BASE_URL}/v1/auth/refresh`,
    me: `${API_BASE_URL}/v1/auth/me`,
    profile: `${API_BASE_URL}/v1/auth/profile`,
    logout: `${API_BASE_URL}/v1/auth/logout`,
    forgotPassword: `${API_BASE_URL}/v1/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/v1/auth/reset-password`,
  },
  // Token verification endpoint
  token: {
    verify: `${API_BASE_URL}/v1/token/verify`,
    verifyHeader: `${API_BASE_URL}/v1/token/verify-header`,
    health: `${API_BASE_URL}/v1/token/health`,
  },
};

/**
 * Fetch wrapper with default headers
 */
export async function apiCall(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `API Error: ${response.status}`);
  }

  return data;
}
