"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FolderKanban,
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Edit,
  Eye,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  teamMembers: {
    id: string
    name: string
    role: string
    avatar?: string
  }[]
  tasks: {
    id: string
    title: string
    completed: boolean
    assignee: string
  }[]
  milestones: {
    id: string
    title: string
    date: string
    completed: boolean
  }[]
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Complete redesign and development of the company's e-commerce platform with modern UI/UX",
    status: "in-progress",
    priority: "high",
    progress: 75,
    startDate: "2024-01-01",
    endDate: "2024-03-15",
    budget: 150000,
    spent: 112500,
    teamMembers: [
      { id: "1", name: "Sarah Johnson", role: "Frontend Lead" },
      { id: "2", name: "Mike Chen", role: "Backend Developer" },
      { id: "3", name: "Emily Davis", role: "UI/UX Designer" },
    ],
    tasks: [
      { id: "1", title: "User Authentication System", completed: true, assignee: "Mike Chen" },
      { id: "2", title: "Product Catalog UI", completed: true, assignee: "Sarah Johnson" },
      { id: "3", title: "Payment Integration", completed: false, assignee: "Mike Chen" },
      { id: "4", title: "Mobile Responsive Design", completed: false, assignee: "Emily Davis" },
    ],
    milestones: [
      { id: "1", title: "MVP Release", date: "2024-02-01", completed: true },
      { id: "2", title: "Beta Testing", date: "2024-02-15", completed: true },
      { id: "3", title: "Production Launch", date: "2024-03-15", completed: false },
    ],
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    description: "Complete overhaul of the mobile application with new features and improved performance",
    status: "in-progress",
    priority: "medium",
    progress: 45,
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    budget: 80000,
    spent: 36000,
    teamMembers: [
      { id: "4", name: "Alex Rodriguez", role: "Mobile Developer" },
      { id: "5", name: "Lisa Wang", role: "UI Designer" },
    ],
    tasks: [
      { id: "5", title: "User Research", completed: true, assignee: "Lisa Wang" },
      { id: "6", title: "Wireframe Design", completed: true, assignee: "Lisa Wang" },
      { id: "7", title: "React Native Setup", completed: false, assignee: "Alex Rodriguez" },
      { id: "8", title: "API Integration", completed: false, assignee: "Alex Rodriguez" },
    ],
    milestones: [
      { id: "4", title: "Design System", date: "2024-02-15", completed: true },
      { id: "5", title: "Alpha Version", date: "2024-03-15", completed: false },
      { id: "6", title: "App Store Release", date: "2024-04-30", completed: false },
    ],
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integration with third-party APIs for enhanced functionality and data synchronization",
    status: "review",
    priority: "high",
    progress: 90,
    startDate: "2023-12-01",
    endDate: "2024-02-01",
    budget: 45000,
    spent: 40500,
    teamMembers: [
      { id: "6", name: "David Kim", role: "Backend Developer" },
      { id: "7", name: "Jennifer Liu", role: "DevOps Engineer" },
    ],
    tasks: [
      { id: "9", title: "API Documentation", completed: true, assignee: "David Kim" },
      { id: "10", title: "Authentication Setup", completed: true, assignee: "David Kim" },
      { id: "11", title: "Data Migration", completed: true, assignee: "Jennifer Liu" },
      { id: "12", title: "Testing & QA", completed: false, assignee: "David Kim" },
    ],
    milestones: [
      { id: "7", title: "API Endpoints", date: "2024-01-01", completed: true },
      { id: "8", title: "Integration Testing", date: "2024-01-15", completed: true },
      { id: "9", title: "Production Deployment", date: "2024-02-01", completed: false },
    ],
  },
  {
    id: "4",
    name: "Database Migration",
    description: "Migration from legacy database system to modern cloud-based solution",
    status: "planning",
    priority: "critical",
    progress: 30,
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    budget: 120000,
    spent: 36000,
    teamMembers: [
      { id: "8", name: "Robert Taylor", role: "Database Administrator" },
      { id: "9", name: "Maria Garcia", role: "Data Engineer" },
    ],
    tasks: [
      { id: "13", title: "Data Audit", completed: true, assignee: "Maria Garcia" },
      { id: "14", title: "Migration Strategy", completed: false, assignee: "Robert Taylor" },
      { id: "15", title: "Backup Procedures", completed: false, assignee: "Robert Taylor" },
      { id: "16", title: "Performance Testing", completed: false, assignee: "Maria Garcia" },
    ],
    milestones: [
      { id: "10", title: "Migration Plan", date: "2024-02-15", completed: false },
      { id: "11", title: "Test Migration", date: "2024-03-15", completed: false },
      { id: "12", title: "Production Migration", date: "2024-05-01", completed: false },
    ],
  },
]

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "on-hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressStatus = (progress: number, endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const isOverdue = today > end && progress < 100

    if (progress === 100) return { icon: CheckCircle, color: "text-green-500", label: "Completed" }
    if (isOverdue) return { icon: AlertTriangle, color: "text-red-500", label: "Overdue" }
    if (progress >= 75) return { icon: TrendingUp, color: "text-green-500", label: "On Track" }
    if (progress >= 50) return { icon: Clock, color: "text-yellow-500", label: "In Progress" }
    return { icon: Clock, color: "text-blue-500", label: "Starting" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Project Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track and manage ongoing projects with progress monitoring
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Set up a new project with timeline and team assignments.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Enter project name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Project description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" type="number" placeholder="0" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {projects.map((project) => {
          const progressStatus = getProgressStatus(project.progress, project.endDate)
          const StatusIcon = progressStatus.icon
          const completedTasks = project.tasks.filter((task) => task.completed).length
          const budgetUsed = (project.spent / project.budget) * 100

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FolderKanban className="w-5 h-5" />
                            {project.name}
                          </DialogTitle>
                          <DialogDescription>{project.description}</DialogDescription>
                        </DialogHeader>
                        {selectedProject && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{selectedProject.progress}%</span>
                                    <StatusIcon className={`w-5 h-5 ${progressStatus.color}`} />
                                  </div>
                                  <Progress value={selectedProject.progress} className="h-2" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Budget</p>
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold">${(selectedProject.spent / 1000).toFixed(0)}K</p>
                                  <p className="text-xs text-slate-500">
                                    of ${(selectedProject.budget / 1000).toFixed(0)}K ({budgetUsed.toFixed(0)}%)
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Timeline</p>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    {new Date(selectedProject.startDate).toLocaleDateString()} -{" "}
                                    {new Date(selectedProject.endDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {Math.ceil(
                                      (new Date(selectedProject.endDate).getTime() - new Date().getTime()) /
                                        (1000 * 60 * 60 * 24),
                                    )}{" "}
                                    days remaining
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tasks</p>
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold">
                                    {completedTasks}/{selectedProject.tasks.length}
                                  </p>
                                  <p className="text-xs text-slate-500">completed</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-medium flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Team Members
                                </h4>
                                <div className="space-y-3">
                                  {selectedProject.teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-xs">
                                          {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.role}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium">Tasks</h4>
                                <div className="space-y-2">
                                  {selectedProject.tasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                      <div
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                          task.completed
                                            ? "bg-green-500 border-green-500"
                                            : "border-slate-300 dark:border-slate-600"
                                        }`}
                                      >
                                        {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                                      </div>
                                      <div className="flex-1">
                                        <p
                                          className={`text-sm ${
                                            task.completed
                                              ? "line-through text-slate-500"
                                              : "text-slate-900 dark:text-slate-100"
                                          }`}
                                        >
                                          {task.title}
                                        </p>
                                        <p className="text-xs text-slate-500">{task.assignee}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-medium">Milestones</h4>
                              <div className="space-y-3">
                                {selectedProject.milestones.map((milestone, index) => (
                                  <div key={milestone.id} className="flex items-center gap-4">
                                    <div
                                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                        milestone.completed
                                          ? "bg-green-500 border-green-500"
                                          : "border-slate-300 dark:border-slate-600"
                                      }`}
                                    >
                                      {milestone.completed ? (
                                        <CheckCircle className="w-4 h-4 text-white" />
                                      ) : (
                                        <span className="text-xs font-medium">{index + 1}</span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p
                                        className={`font-medium ${
                                          milestone.completed
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-slate-900 dark:text-slate-100"
                                        }`}
                                      >
                                        {milestone.title}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {new Date(milestone.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${progressStatus.color}`} />
                      <span className="text-sm font-medium">{progressStatus.label}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {completedTasks}/{project.tasks.length} tasks completed
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(project.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.teamMembers.length} members
                      </span>
                    </div>
                    <span>
                      ${(project.spent / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
