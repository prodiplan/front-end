'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  full_name: string
  birth_date?: string
  school_origin?: string
  dream_major?: string
  avatar_url?: string
  phone_number?: string
  email_verified?: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  birth_date: string
  school_origin: string
  dream_major: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get('token')
      if (savedToken) {
        setToken(savedToken)
        try {
          await fetchUserProfile(savedToken)
        } catch (error) {
          // Token invalid, clear it
          Cookies.remove('token')
          Cookies.remove('refresh_token')
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const data = await response.json()
    if (data.success) {
      setUser(data.data)
    } else {
      throw new Error(data.error?.message || 'Authentication failed')
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Login failed')
      }

      const { user: userData, token: authToken, refresh_token } = data.data

      // Save tokens
      Cookies.set('token', authToken, { expires: 7 }) // 7 days
      Cookies.set('refresh_token', refresh_token, { expires: 30 }) // 30 days

      setToken(authToken)
      setUser(userData)
      
      toast.success('Login berhasil!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login gagal')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Registration failed')
      }

      const { user: newUser, token: authToken, refresh_token } = data.data

      // Save tokens
      Cookies.set('token', authToken, { expires: 7 })
      Cookies.set('refresh_token', refresh_token, { expires: 30 })

      setToken(authToken)
      setUser(newUser)
      
      toast.success('Registrasi berhasil!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registrasi gagal')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    Cookies.remove('refresh_token')
    setToken(null)
    setUser(null)
    toast.success('Logout berhasil')
  }

  const refreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token')
    if (!refresh_token) {
      logout()
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error('Token refresh failed')
      }

      const { token: authToken } = data.data
      Cookies.set('token', authToken, { expires: 7 })
      setToken(authToken)
    } catch (error) {
      logout()
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Profile update failed')
      }

      setUser(data.data)
      toast.success('Profil berhasil diperbarui!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui profil')
      throw error
    }
  }

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
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
