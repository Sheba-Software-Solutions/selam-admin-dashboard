"use client"

import { LoginForm } from "@/components/auth/login-form"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { useAuth } from "@/hooks/use-auth"

export function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  return <AdminDashboard user={user} onLogout={logout} />
}
