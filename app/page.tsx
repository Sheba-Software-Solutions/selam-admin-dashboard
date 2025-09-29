"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, this would validate against a backend
    if (email && password) {
      setUser({ email, name: email.split("@")[0] })
      setIsAuthenticated(true)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}
