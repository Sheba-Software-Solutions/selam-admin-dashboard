"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import {
  Archive,
  Building2,
  Calendar,
  Clock,
  Edit,
  Globe,
  MoreVertical,
  Plus,
  Trash2,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Define JobPosting interface based on previous context
interface JobPosting {
  id?: string
  title: string
  department: string
  location: string
  employmentType: string
  description: string
  requirements: string[]
  responsibilities: string[]
  compensationRange: string
  isPublished: boolean
  isArchived: boolean
  publishAt: string
  closeAt: string
}

type JobFormData = Omit<JobPosting, "id" | "requirements" | "responsibilities"> & {
  requirementsText: string
  responsibilitiesText: string
}

// FIX: Move JobForm outside of JobManagement component
// This prevents the form from re-rendering and losing focus on every input change.
const JobForm = ({
  formData,
  setFormData,
  isEdit = false,
  onSubmit,
  onCancel,
}: {
  formData: JobFormData
  setFormData: React.Dispatch<React.SetStateAction<JobFormData>>
  isEdit?: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) => (
  <form
    onSubmit={onSubmit}
    className="space-y-4"
    // Prevent default form submission which causes page reload
    onClick={(e) => e.stopPropagation()}
  >
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="e.g. Senior Frontend Developer"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department *</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, department: e.target.value }))
          }
          placeholder="e.g. Engineering"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="e.g. San Francisco, CA"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="employmentType">Employment Type</Label>
        <Select
          value={formData.employmentType}
          onValueChange={(value: string) =>
            setFormData((prev) => ({ ...prev, employmentType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="compensationRange">Compensation Range</Label>
        <Input
          id="compensationRange"
          value={formData.compensationRange}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, compensationRange: e.target.value }))
          }
          placeholder="e.g. $120,000 - $160,000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="isPublished">Status</Label>
        <Select
          value={formData.isPublished ? "published" : "draft"}
          onValueChange={(value: string) =>
            setFormData((prev) => ({ ...prev, isPublished: value === "published" }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="publishAt">Publish Date</Label>
        <Input
          id="publishAt"
          type="datetime-local"
          value={formData.publishAt || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, publishAt: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="closeAt">Close Date</Label>
        <Input
          id="closeAt"
          type="datetime-local"
          value={formData.closeAt || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, closeAt: e.target.value }))
          }
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Job Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Describe the role and responsibilities..."
        rows={3}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="requirements">Requirements</Label>
      <Textarea
        id="requirements"
        value={formData.requirementsText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData((prev) => ({ ...prev, requirementsText: e.target.value }))
        }
        placeholder="List the required skills and qualifications (one per line)..."
        rows={3}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="responsibilities">Responsibilities</Label>
      <Textarea
        id="responsibilities"
        value={formData.responsibilitiesText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData((prev) => ({ ...prev, responsibilitiesText: e.target.value }))
        }
        placeholder="List the key responsibilities (one per line)..."
        rows={3}
      />
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{isEdit ? "Update Job" : "Create Job"}</Button>
    </div>
  </form>
)

export function JobManagement() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const initialFormData: JobFormData = {
    title: "",
    department: "",
    location: "",
    employmentType: "Full-time",
    description: "",
    requirementsText: "",
    responsibilitiesText: "",
    compensationRange: "",
    isPublished: false,
    isArchived: false,
    publishAt: "",
    closeAt: "",
  }

  const [formData, setFormData] = useState<JobFormData>(initialFormData)
  const toast = useToast()

  const toLocalDatetimeInput = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ""
    const pad = (n: number) => (n < 10 ? "0" + n : n)
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const hh = pad(d.getHours())
    const mi = pad(d.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getJobs()
      if (response.success && Array.isArray(response.data)) {
        setJobs(response.data)
      } else {
        setJobs([])
      }
    } catch (error) {
      console.error("Failed to load jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load job postings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.department || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirementsText.split("\n").filter(Boolean),
        responsibilities: formData.responsibilitiesText.split("\n").filter(Boolean),
      }
      // @ts-ignore
      delete jobData.requirementsText
      // @ts-ignore
      delete jobData.responsibilitiesText

      const response = await apiClient.createJob(jobData)
      if (response.success) {
        await loadJobs()
        setIsCreateDialogOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: "Job posting created successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to create job:", error)
      toast({
        title: "Error",
        description: "Failed to create job posting.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job)
    setFormData({
      ...job,
      requirementsText: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      responsibilitiesText: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
      publishAt: toLocalDatetimeInput(job.publishAt),
      closeAt: toLocalDatetimeInput(job.closeAt),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingJob || !editingJob.id) return

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirementsText.split("\n").filter(Boolean),
        responsibilities: formData.responsibilitiesText.split("\n").filter(Boolean),
      }
      // @ts-ignore
      delete jobData.requirementsText
      // @ts-ignore
      delete jobData.responsibilitiesText

      const response = await apiClient.updateJob(editingJob.id, jobData)
      if (response.success) {
        await loadJobs()
        setEditingJob(null)
        resetForm()
        toast({
          title: "Success",
          description: "Job posting updated successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to update job:", error)
      toast({
        title: "Error",
        description: "Failed to update job posting.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await apiClient.deleteJob(id)
        if (response.success) {
          await loadJobs()
          toast({
            title: "Success",
            description: "Job posting deleted successfully.",
          })
        }
      } catch (error) {
        console.error("Failed to delete job:", error)
        toast({
          title: "Error",
          description: "Failed to delete job posting.",
          variant: "destructive",
        })
      }
    }
  }

  const getStatus = (isPublished: boolean, isArchived: boolean) => {
    if (isArchived) return "Archived"
    if (isPublished) return "Published"
    return "Draft"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Job Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Create, edit, and manage job vacancies</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                resetForm()
                setIsCreateDialogOpen(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>Fill in the details for the new job vacancy.</DialogDescription>
            </DialogHeader>
            {/* FIX: Pass props to the extracted JobForm component */}
            <JobForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              onCancel={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="hidden sm:flex">
                      <AvatarImage src={`/api/placeholder/40/40`} />
                      <AvatarFallback>
                        {job.department?.substring(0, 2).toUpperCase() || "??_"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {job.title}
                        </h3>
                        <Badge
                          variant={
                            getStatus(job.isPublished, job.isArchived) === "Published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {getStatus(job.isPublished, job.isArchived)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" /> {job.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> {job.employmentType}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(job.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <h3 className="text-lg font-semibold">No Job Postings Found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Get started by creating a new job posting.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingJob} onOpenChange={(isOpen) => !isOpen && setEditingJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>Update the job details below.</DialogDescription>
          </DialogHeader>
          {/* FIX: Pass props to the extracted JobForm component */}
          <JobForm
            isEdit
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingJob(null)
              resetForm()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}