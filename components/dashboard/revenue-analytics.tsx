"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Users, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState } from "react"

const monthlyRevenue = [
  { month: "Jan", revenue: 85000, expenses: 45000, profit: 40000, clients: 12 },
  { month: "Feb", revenue: 92000, expenses: 48000, profit: 44000, clients: 15 },
  { month: "Mar", revenue: 78000, expenses: 42000, profit: 36000, clients: 11 },
  { month: "Apr", revenue: 105000, expenses: 52000, profit: 53000, clients: 18 },
  { month: "May", revenue: 118000, expenses: 58000, profit: 60000, clients: 22 },
  { month: "Jun", revenue: 124000, expenses: 61000, profit: 63000, clients: 25 },
  { month: "Jul", revenue: 132000, expenses: 65000, profit: 67000, clients: 28 },
  { month: "Aug", revenue: 128000, expenses: 63000, profit: 65000, clients: 26 },
  { month: "Sep", revenue: 145000, expenses: 70000, profit: 75000, clients: 32 },
  { month: "Oct", revenue: 138000, expenses: 68000, profit: 70000, clients: 30 },
  { month: "Nov", revenue: 152000, expenses: 74000, profit: 78000, clients: 35 },
  { month: "Dec", revenue: 165000, expenses: 80000, profit: 85000, clients: 38 },
]

const revenueByService = [
  { name: "Web Development", value: 45, revenue: 540000, color: "#3b82f6" },
  { name: "Mobile Apps", value: 25, revenue: 300000, color: "#10b981" },
  { name: "Consulting", value: 20, revenue: 240000, color: "#f59e0b" },
  { name: "Maintenance", value: 10, revenue: 120000, color: "#ef4444" },
]

const quarterlyGrowth = [
  { quarter: "Q1 2023", revenue: 255000, growth: 8.5 },
  { quarter: "Q2 2023", revenue: 347000, growth: 12.3 },
  { quarter: "Q3 2023", revenue: 405000, growth: 15.2 },
  { quarter: "Q4 2023", revenue: 455000, growth: 18.7 },
  { quarter: "Q1 2024", revenue: 520000, growth: 22.1 },
]

const topClients = [
  { name: "TechCorp Inc.", revenue: 85000, projects: 3, status: "active" },
  { name: "StartupXYZ", revenue: 72000, projects: 2, status: "active" },
  { name: "Enterprise Solutions", revenue: 68000, projects: 4, status: "completed" },
  { name: "Digital Ventures", revenue: 55000, projects: 2, status: "active" },
  { name: "Innovation Labs", revenue: 48000, projects: 1, status: "active" },
]

export function RevenueAnalytics() {
  const [timeRange, setTimeRange] = useState("12months")

  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue
  const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2].revenue
  const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0)
  const totalProfit = monthlyRevenue.reduce((sum, month) => sum + month.profit, 0)
  const totalClients = monthlyRevenue[monthlyRevenue.length - 1].clients
  const avgMonthlyRevenue = totalRevenue / monthlyRevenue.length

  const stats = [
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: `+${revenueGrowth.toFixed(1)}%`,
      changeType: revenueGrowth > 0 ? "positive" : "negative",
      icon: DollarSign,
    },
    {
      title: "Monthly Average",
      value: `$${(avgMonthlyRevenue / 1000).toFixed(0)}K`,
      change: "+8.2%",
      changeType: "positive",
      icon: TrendingUp,
    },
    {
      title: "Total Profit",
      value: `$${(totalProfit / 1000).toFixed(0)}K`,
      change: "+12.5%",
      changeType: "positive",
      icon: Target,
    },
    {
      title: "Active Clients",
      value: totalClients.toString(),
      change: "+6 this month",
      changeType: "positive",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Revenue Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Track financial performance and business metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="2years">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
            <CardDescription>Monthly revenue and profit over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Breakdown of revenue sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueByService}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {revenueByService.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">${(service.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quarterly Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Growth</CardTitle>
            <CardDescription>Revenue growth over quarters</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quarterlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="quarter" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
            <CardDescription>Highest revenue generating clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{client.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{client.projects} projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      ${(client.revenue / 1000).toFixed(0)}K
                    </p>
                    <Badge
                      className={
                        client.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue Growth</span>
                  <span className="text-sm font-bold text-green-600">+{revenueGrowth.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(revenueGrowth * 5, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Profit Margin</span>
                  <span className="text-sm font-bold text-blue-600">52.1%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: "52%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Client Retention</span>
                  <span className="text-sm font-bold text-purple-600">89.5%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "89%" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Project Success Rate</span>
                  <span className="text-sm font-bold text-orange-600">94.2%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "94%" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
