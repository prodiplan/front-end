import { apiCall, API_ENDPOINTS } from "../api";
import { User, ApiResponse } from "../../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  birth_date: string;
  school_origin: string;
  dream_major: string;
  // phone_number is NOT supported by backend during registration
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  oobCode: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  // phone_number is READ-ONLY, set only during registration
  avatar_url?: string;
  dream_major?: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (data: RegisterData) => {
    return apiCall(API_ENDPOINTS.auth.register, {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<ApiResponse<AuthResponse>>;
  },

  /**
   * Login user
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials) => {
    return apiCall(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    }) as Promise<ApiResponse<AuthResponse>>;
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken: async (data: RefreshTokenRequest) => {
    return apiCall(API_ENDPOINTS.auth.refresh, {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<ApiResponse<{ token: string; refresh_token: string }>>;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (token: string, refreshToken?: string) => {
    return apiCall(
      API_ENDPOINTS.auth.logout,
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
      token
    ) as Promise<ApiResponse<void>>;
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  getProfile: async (token: string) => {
    return apiCall(
      API_ENDPOINTS.auth.me,
      {
        method: "GET",
      },
      token
    ) as Promise<ApiResponse<User>>;
  },

  /**
   * Update user profile
   * PATCH /auth/profile
   */
  updateProfile: async (data: UpdateProfileRequest, token: string) => {
    return apiCall(
      API_ENDPOINTS.auth.profile,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<User>>;
  },

  /**
   * Request password reset email
   * POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return apiCall(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<ApiResponse<void>>;
  },

  /**
   * Reset password with code from email
   * POST /auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    return apiCall(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<ApiResponse<void>>;
  },

  /**
   * Delete user account
   * DELETE /auth/user
   */
  deleteUser: async (data: DeleteUserRequest, token: string) => {
    return apiCall(
      API_ENDPOINTS.auth.deleteUser,
      {
        method: "DELETE",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<void>>;
  },

  /**
   * Change password for logged-in user
   * POST /auth/change-password
   */
  changePassword: async (data: ChangePasswordRequest, token: string) => {
    return apiCall(
      API_ENDPOINTS.auth.changePassword,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ) as Promise<ApiResponse<void>>;
  },
};
