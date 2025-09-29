"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Users, FolderKanban, TrendingUp, Clock, CheckCircle } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Active Job Postings",
      value: "12",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Total Applicants",
      value: "248",
      change: "+18 this week",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "8",
      change: "2 completed",
      icon: FolderKanban,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "$124K",
      change: "+12% from last month",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentJobs = [
    { title: "Senior Frontend Developer", applicants: 24, status: "active" },
    { title: "Product Manager", applicants: 18, status: "active" },
    { title: "DevOps Engineer", applicants: 12, status: "paused" },
  ]

  const activeProjects = [
    { name: "E-commerce Platform", progress: 75, status: "on-track" },
    { name: "Mobile App Redesign", progress: 45, status: "on-track" },
    { name: "API Integration", progress: 90, status: "ahead" },
    { name: "Database Migration", progress: 30, status: "delayed" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening at your company.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Postings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Recent Job Postings
            </CardTitle>
            <CardDescription>Latest job vacancies and their application status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{job.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{job.applicants} applicants</p>
                </div>
                <Badge
                  className={
                    job.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Active Projects
            </CardTitle>
            <CardDescription>Current project status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{project.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{project.progress}%</span>
                    {project.status === "on-track" && <Clock className="w-4 h-4 text-blue-500" />}
                    {project.status === "ahead" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {project.status === "delayed" && <Clock className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
