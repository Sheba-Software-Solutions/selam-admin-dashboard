"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Users, Package, MessageSquare, CheckCircle } from "lucide-react"
import { apiClient, type JobPosting, type Product } from "@/lib/api-client"

interface DashboardStats {
  activeJobs: number
  totalApplicants: number
  activeProducts: number
  newMessages: number
}

interface JobWithApplicants extends JobPosting {
  applicantCount: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalApplicants: 0,
    activeProducts: 0,
    newMessages: 0,
  })
  const [recentJobs, setRecentJobs] = useState<JobWithApplicants[]>([])
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [jobsRes, applicationsRes, productsRes, messagesRes] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getApplications(),
          apiClient.getProducts(),
          apiClient.getContactMessages(),
        ])

        const jobs = jobsRes.data
        const applications = applicationsRes.data
        const products = productsRes.data
        const messages = messagesRes.data

        // Calculate statistics
        const activeJobs = jobs.filter((job) => job.isPublished && !job.isArchived).length
        const totalApplicants = applications.length
        const activeProducts = products.filter((p) => p.status === "ACTIVE" && !p.isArchived).length
        const newMessages = messages.filter((m) => m.status === "NEW").length

        setStats({
          activeJobs,
          totalApplicants,
          activeProducts,
          newMessages,
        })

        // Get recent jobs with applicant counts
        const publishedJobs = jobs
          .filter((job) => job.isPublished && !job.isArchived)
          .slice(0, 3)
          .map((job) => ({
            ...job,
            applicantCount: applications.filter((app) => app.jobId === job.id).length,
          }))

        setRecentJobs(publishedJobs)

        // Get active products (top 4)
        const activeProductsList = products.filter((p) => p.status === "ACTIVE" && !p.isArchived).slice(0, 4)

        setActiveProducts(activeProductsList)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: "Active Job Postings",
      value: loading ? "..." : stats.activeJobs.toString(),
      change: "Published positions",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Total Applicants",
      value: loading ? "..." : stats.totalApplicants.toString(),
      change: "All applications",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Active Products",
      value: loading ? "..." : stats.activeProducts.toString(),
      change: "Live products",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "New Messages",
      value: loading ? "..." : stats.newMessages.toString(),
      change: "Unread contacts",
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ]

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening at your company.</p>
        </div>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening at your company.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
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
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading jobs...</p>
            ) : recentJobs.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No active job postings</p>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{job.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {job.isPublished ? "active" : "draft"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Active Products
            </CardTitle>
            <CardDescription>Current product status and ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading products...</p>
            ) : activeProducts.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No active products</p>
            ) : (
              activeProducts.map((product) => (
                <div key={product.slug} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{product.rating.toFixed(1)} ★</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <Progress value={(product.rating / 5) * 100} className="h-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {product.usersCount.toLocaleString()} users
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
