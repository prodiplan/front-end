"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { authService } from "@/lib/services/auth";
import { ApiError } from "@/lib/api";
import type {
  RegisterData,
  LoginCredentials,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  DeleteUserRequest,
} from "@/lib/services/auth";

export interface User {
  id: string;
  email: string;
  full_name: string;
  birth_date?: string;
  school_origin?: string;
  dream_major?: string;
  avatar_url?: string;
  phone_number?: string;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (oobCode: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users untuk testing tanpa backend (sesuai API Specification)
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "demo@prodiplan.id": {
    password: "demo123",
    user: {
      id: "user-demo-001",
      email: "demo@prodiplan.id",
      full_name: "Demo User",
      birth_date: "2005-01-15",
      school_origin: "SMAN 1 Jakarta",
      dream_major: "Computer Science",
      avatar_url: "https://api.example.com/avatars/demo.jpg",
      phone_number: "+62812345678",
      email_verified: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
  },
  "student@prodiplan.id": {
    password: "student123",
    user: {
      id: "user-student-001",
      email: "student@prodiplan.id",
      full_name: "Budi Santoso",
      birth_date: "2006-05-20",
      school_origin: "SMAN 2 Bandung",
      dream_major: "Teknik Informatika",
      avatar_url: "https://api.example.com/avatars/student.jpg",
      phone_number: "+62812345679",
      email_verified: true,
      created_at: "2024-01-16T09:15:00Z",
      updated_at: "2024-01-16T09:15:00Z",
    },
  },
  "test@prodiplan.id": {
    password: "test123",
    user: {
      id: "user-test-001",
      email: "test@prodiplan.id",
      full_name: "Siti Nur Azizah",
      birth_date: "2005-08-10",
      school_origin: "SMAN 3 Surabaya",
      dream_major: "Kedokteran",
      avatar_url: "https://api.example.com/avatars/test.jpg",
      phone_number: "+62812345680",
      email_verified: true,
      created_at: "2024-01-17T14:45:00Z",
      updated_at: "2024-01-17T14:45:00Z",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get("token");
      if (savedToken) {
        setToken(savedToken);
        try {
          await fetchUserProfile(savedToken);
        } catch (error) {
          // Token invalid, clear it
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      console.log("=== Fetching User Profile ===");
      const data = await authService.getProfile(authToken);
      console.log("Profile response from API:", data);
      if (data.success) {
        console.log("User data received:", data.data);
        console.log("Phone number in response:", data.data.phone_number);
        setUser(data.data);
      } else {
        throw new Error(data.error?.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user profile"
      );
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });

      if (!data.success) {
        throw new Error(data.error?.message || "Login failed");
      }

      const { user: userData, token: authToken, refresh_token } = data.data;

      console.log("=== Login Success ===");
      console.log("User data from login:", userData);
      console.log("Phone number:", userData.phone_number);

      // Save tokens
      Cookies.set("token", authToken, { expires: 7 });
      Cookies.set("refresh_token", refresh_token, { expires: 30 });

      setToken(authToken);
      setUser(userData);
    } catch (error: any) {
      // Deteksi jenis error berdasarkan status code dan error message
      let errorMessage = "Login gagal";
      
      // Check for deleted account
      if (error.statusCode === 403 ||
          error.statusCode === 410 ||
          error.message?.toLowerCase().includes('account deleted') ||
          error.message?.toLowerCase().includes('account has been deleted') ||
          error.message?.toLowerCase().includes('user deleted') ||
          error.errorCode === 'ACCOUNT_DELETED' ||
          error.errorCode === 'USER_DELETED') {
        errorMessage = "Akun ini telah dihapus dan tidak dapat digunakan lagi";
      } else if (error.statusCode === 404 || 
          error.message?.toLowerCase().includes('user not found') ||
          error.message?.toLowerCase().includes('email not found') ||
          error.message?.toLowerCase().includes('not registered') ||
          error.errorCode === 'USER_NOT_FOUND' ||
          error.errorCode === 'EMAIL_NOT_FOUND') {
        errorMessage = "Email tidak terdaftar";
      } else if (error.statusCode === 401 || 
                 error.message?.toLowerCase().includes('invalid password') ||
                 error.message?.toLowerCase().includes('wrong password') ||
                 error.message?.toLowerCase().includes('incorrect password') ||
                 error.errorCode === 'INVALID_PASSWORD' ||
                 error.errorCode === 'WRONG_PASSWORD') {
        errorMessage = "Password salah";
      } else if (error.message?.toLowerCase().includes('invalid_login_credentials') ||
                 error.message?.toLowerCase().includes('invalid credentials')) {
        // Fallback untuk error umum - coba deteksi dengan mengecek email terlebih dahulu
        // Untuk sementara, gunakan pesan umum atau bisa ditambahkan logika tambahan
        errorMessage = "Email atau password salah";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);

      if (!data.success) {
        throw new Error(data.error?.message || "Registration failed");
      }

      const { user: newUser, token: authToken, refresh_token } = data.data;

      // Save tokens
      Cookies.set("token", authToken, { expires: 7 });
      Cookies.set("refresh_token", refresh_token, { expires: 30 });

      setToken(authToken);
      setUser(newUser);

      toast.success("Registrasi berhasil!");
    } catch (error: any) {
      // Deteksi jenis error berdasarkan status code dan error message
      let errorMessage = "Registrasi gagal";
      
      if (error.statusCode === 409 || 
          error.message?.toLowerCase().includes('email already exists') ||
          error.message?.toLowerCase().includes('email sudah terdaftar') ||
          error.message?.toLowerCase().includes('email_exist') ||
          error.message?.toLowerCase().includes('already registered') ||
          error.errorCode === 'EMAIL_EXISTS' ||
          error.errorCode === 'EMAIL_ALREADY_EXISTS' ||
          error.errorCode === 'USER_ALREADY_EXISTS') {
        errorMessage = "Email sudah terdaftar";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call logout endpoint if token exists
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refresh_token");
    if (token) {
      // Fire and forget - don't await logout endpoint
      authService.logout(token, refreshToken).catch((error: Error) => {
        console.error("Logout API call failed:", error);
        // Continue with local logout even if API fails
      });
    }

    Cookies.remove("token");
    Cookies.remove("refresh_token");
    setToken(null);
    setUser(null);
    toast.success("Logout berhasil");
  };

  const refreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    if (!refresh_token) {
      logout();
      return;
    }

    try {
      const data = await authService.refreshToken({ refresh_token });

      if (!data.success) {
        throw new Error("Token refresh failed");
      }

      const { token: authToken } = data.data;
      Cookies.set("token", authToken, { expires: 7 });
      setToken(authToken);
    } catch (error) {
      logout();
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      // Backend expects PATCH /auth/profile
      // Only allows: full_name, phone_number, avatar_url, dream_major
      // Only send fields that actually changed
      const updateData: UpdateProfileRequest = {};
      
      if (userData.full_name !== undefined && userData.full_name !== user?.full_name) {
        updateData.full_name = userData.full_name;
      }
      
      // Note: phone_number is READ-ONLY, cannot be updated via API
      // if (userData.phone_number !== undefined && userData.phone_number !== user?.phone_number) {
      //   if (userData.phone_number) {
      //     updateData.phone_number = userData.phone_number;
      //   }
      // }
      
      if (userData.avatar_url !== undefined && userData.avatar_url !== user?.avatar_url) {
        // Only send if there's an actual value
        if (userData.avatar_url) {
          updateData.avatar_url = userData.avatar_url;
        }
      }
      
      if (userData.dream_major !== undefined && userData.dream_major !== user?.dream_major) {
        updateData.dream_major = userData.dream_major;
      }

      console.log("=== Auth Provider Update Profile Debug ===");
      console.log("Original user:", {
        full_name: user?.full_name,
        phone_number: user?.phone_number,
        dream_major: user?.dream_major,
        avatar_url: user?.avatar_url,
      });
      console.log("Received userData:", userData);
      console.log("Sending to API (only changed fields):", updateData);

      const data = await authService.updateProfile(updateData, token);

      console.log("Received from API:", data);

      if (!data.success) {
        throw new Error(data.error?.message || "Profile update failed");
      }

      console.log("Setting user to:", data.data);
      setUser(data.data);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil"
      );
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const data = await authService.forgotPassword({ email });

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to send reset email");
      }

      toast.success("Email reset password telah dikirim!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim email reset"
      );
      throw error;
    }
  };

  const resetPassword = async (oobCode: string, newPassword: string) => {
    try {
      const data = await authService.resetPassword({ oobCode, newPassword });

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to reset password");
      }

      toast.success("Password berhasil direset!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mereset password"
      );
      throw error;
    }
  };

  const deleteAccount = async (password: string) => {
    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      const data = await authService.deleteUser({ password }, token);

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to delete account");
      }

      // Call logout to properly clean up session and invalidate tokens on backend
      try {
        await authService.logout(token, Cookies.get("refresh_token"));
      } catch (logoutError) {
        // Continue even if logout fails, as account is already deleted
        console.warn("Logout after delete account failed:", logoutError);
      }

      // Clear local state
      Cookies.remove("token");
      Cookies.remove("refresh_token");
      setToken(null);
      setUser(null);

      // Toast success will be shown by the calling component (ProfileSettings)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus akun"
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        updateProfile,
        forgotPassword,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
