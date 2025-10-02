"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardOverview } from "./dashboard-overview"
import { JobManagement } from "./job-management"
import { ApplicantTracking } from "./applicant-tracking"
import { ProductManagement } from "./product-management"
import { ContactManagement } from "./contact-management"
import { RevenueAnalytics } from "./revenue-analytics"
import type { AdminUser } from "@/lib/api-client"

interface AdminDashboardProps {
  user: AdminUser | null
  onLogout: () => void
}

export type DashboardView = "overview" | "jobs" | "applicants" | "products" | "contact" | "revenue"

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview")

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview />
      case "jobs":
        return <JobManagement />
      case "applicants":
        return <ApplicantTracking />
      case "products":
        return <ProductManagement />
      case "contact":
        return <ContactManagement />
      case "revenue":
        return <RevenueAnalytics />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
