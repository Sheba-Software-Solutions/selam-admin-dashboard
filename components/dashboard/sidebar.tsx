"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, Briefcase, Users, FolderKanban, TrendingUp, LogOut, Building2 } from "lucide-react"
import type { DashboardView } from "./admin-dashboard"

interface SidebarProps {
  currentView: DashboardView
  onViewChange: (view: DashboardView) => void
  user: { email: string; name: string } | null
  onLogout: () => void
}

const menuItems = [
  { id: "overview" as DashboardView, label: "Overview", icon: LayoutDashboard },
  { id: "jobs" as DashboardView, label: "Job Vacancies", icon: Briefcase },
  { id: "applicants" as DashboardView, label: "Applicants", icon: Users },
  { id: "projects" as DashboardView, label: "Projects", icon: FolderKanban },
  { id: "revenue" as DashboardView, label: "Revenue", icon: TrendingUp },
]

export function Sidebar({ currentView, onViewChange, user, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <img src="/logo.svg" alt="Custom Icon" className="w-16 h-16 text-primary-foreground"/>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Selam Software Solutions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-11 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-slate-600 dark:text-slate-400 bg-transparent"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
