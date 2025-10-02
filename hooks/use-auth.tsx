"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { apiClient, type AdminUser } from "../lib/api-client"

interface AuthContextType {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          apiClient.setToken(token)
          const response = await apiClient.getProfile()
          if (response.success) {
            setUser(response.data)
          } else {
            // Token is invalid, clear it
            apiClient.clearToken()
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        apiClient.clearToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(email, password)

      if (response.success) {
        setUser(response.data)
        // Note: In a real implementation, the API should return a token
        // For now, we'll simulate storing a token
        const mockToken = btoa(`${email}:${Date.now()}`)
        apiClient.setToken(mockToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        await apiClient.logout(token)
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      apiClient.clearToken()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
