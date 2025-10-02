"use client"

import { AuthProvider } from "@/hooks/use-auth"
import { AppContent } from "@/components/app-context"

export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
