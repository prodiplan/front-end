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

interface User {
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
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  birth_date: string;
  school_origin: string;
  dream_major: string;
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

  // API base URL (fallback to local storage for demo mode)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const USE_DEMO_MODE =
    !process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL.includes("localhost");

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
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    if (data.success) {
      setUser(data.data);
    } else {
      throw new Error(data.error?.message || "Authentication failed");
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if we should use demo mode
      if (USE_DEMO_MODE) {
        // Demo mode - check against local demo users
        const demoUser = DEMO_USERS[email];
        if (!demoUser || demoUser.password !== password) {
          throw new Error("Email atau password salah");
        }

        // Generate fake token for demo
        const fakeToken = "demo-token-" + Date.now();

        // Save tokens
        Cookies.set("token", fakeToken, { expires: 7 });
        Cookies.set("refresh_token", fakeToken, { expires: 30 });

        setToken(fakeToken);
        setUser(demoUser.user);

        toast.success("Login berhasil! (Demo Mode)");
        return;
      }

      // Real API mode
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Login failed");
      }

      const { user: userData, token: authToken, refresh_token } = data.data;

      // Save tokens
      Cookies.set("token", authToken, { expires: 7 });
      Cookies.set("refresh_token", refresh_token, { expires: 30 });

      setToken(authToken);
      setUser(userData);

      toast.success("Login berhasil!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Demo mode - create new user locally
      if (USE_DEMO_MODE) {
        // For demo, we'll just accept any registration and simulate success
        const newUser: User = {
          id: "user-" + Date.now(),
          email: userData.email,
          full_name: userData.full_name,
          birth_date: userData.birth_date,
          school_origin: userData.school_origin,
          dream_major: userData.dream_major,
          avatar_url: "",
          phone_number: "",
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const fakeToken = "demo-token-" + Date.now();

        // Save tokens
        Cookies.set("token", fakeToken, { expires: 7 });
        Cookies.set("refresh_token", fakeToken, { expires: 30 });

        setToken(fakeToken);
        setUser(newUser);

        toast.success("Registrasi berhasil! (Demo Mode)");
        return;
      }

      // Real API mode
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Registration failed");
      }

      const { user: newUser, token: authToken, refresh_token } = data.data;

      // Save tokens
      Cookies.set("token", authToken, { expires: 7 });
      Cookies.set("refresh_token", refresh_token, { expires: 30 });

      setToken(authToken);
      setUser(newUser);

      toast.success("Registrasi berhasil!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi gagal");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Profile update failed");
      }

      setUser(data.data);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil"
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
