"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign, Briefcase } from "lucide-react"
import { apiClient, type JobPosting } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function JobManagement() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    compensationRange: "",
    description: "",
    requirements: [] as string[],
    responsibilities: [] as string[],
    isPublished: false,
    publishAt: "",
    closeAt: "",
  })
  const toast  = useToast()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getJobs()
      if (response.success) {
        setJobs(response.data)
      }
    } catch (error) {
      console.error("Failed to load jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      employmentType: "",
      compensationRange: "",
      description: "",
      requirements: [],
      responsibilities: [],
      isPublished: false,
      publishAt: "",
      closeAt: "",
    })
  }

  const handleCreate = async () => {
    try {
      if (!formData.title || !formData.department || !formData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const jobData = {
        ...formData,
        requirements: formData.requirements.length > 0 ? formData.requirements : [formData.requirements.join(", ")],
        responsibilities:
          formData.responsibilities.length > 0 ? formData.responsibilities : [formData.responsibilities.join(", ")],
        publishAt: formData.publishAt || new Date().toISOString(),
        closeAt: formData.closeAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }

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
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      compensationRange: job.compensationRange,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      isPublished: job.isPublished,
      publishAt: job.publishAt,
      closeAt: job.closeAt,
    })
  }

  const handleUpdate = async () => {
    try {
      if (!editingJob) return

      const response = await apiClient.updateJob(editingJob.id!, formData)
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
        description: "Failed to update job posting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (jobId: string) => {
    try {
      const response = await apiClient.deleteJob(jobId)
      if (response.success) {
        await loadJobs()
        toast({
          title: "Success",
          description: "Job posting archived successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast({
        title: "Error",
        description: "Failed to archive job posting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePublishToggle = async (jobId: string, publish: boolean) => {
    try {
      const response = await apiClient.publishJob(jobId, publish)
      if (response.success) {
        await loadJobs()
        toast({
          title: "Success",
          description: `Job posting ${publish ? "published" : "unpublished"} successfully.`,
        })
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error)
      toast({
        title: "Error",
        description: "Failed to update publish status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (isPublished: boolean, isArchived: boolean) => {
    if (isArchived) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    if (isPublished) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }

  const getStatusLabel = (isPublished: boolean, isArchived: boolean) => {
    if (isArchived) return "Archived"
    if (isPublished) return "Published"
    return "Draft"
  }

  const JobForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g. Engineering"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. San Francisco, CA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
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
            onChange={(e) => setFormData({ ...formData, compensationRange: e.target.value })}
            placeholder="e.g. $120,000 - $160,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isPublished">Status</Label>
          <Select
            value={formData.isPublished ? "published" : "draft"}
            onValueChange={(value) => setFormData({ ...formData, isPublished: value === "published" })}
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
            value={formData.publishAt ? new Date(formData.publishAt).toISOString().slice(0, 16) : ""}
            onChange={(e) =>
              setFormData({ ...formData, publishAt: e.target.value ? new Date(e.target.value).toISOString() : "" })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closeAt">Close Date</Label>
          <Input
            id="closeAt"
            type="datetime-local"
            value={formData.closeAt ? new Date(formData.closeAt).toISOString().slice(0, 16) : ""}
            onChange={(e) =>
              setFormData({ ...formData, closeAt: e.target.value ? new Date(e.target.value).toISOString() : "" })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the role and responsibilities..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={Array.isArray(formData.requirements) ? formData.requirements.join("\n") : formData.requirements}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value.split("\n").filter((r) => r.trim()) })
          }
          placeholder="List the required skills and qualifications (one per line)..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities">Responsibilities</Label>
        <Textarea
          id="responsibilities"
          value={
            Array.isArray(formData.responsibilities) ? formData.responsibilities.join("\n") : formData.responsibilities
          }
          onChange={(e) =>
            setFormData({ ...formData, responsibilities: e.target.value.split("\n").filter((r) => r.trim()) })
          }
          placeholder="List the key responsibilities (one per line)..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingJob(null)
            } else {
              setIsCreateDialogOpen(false)
            }
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button onClick={isEdit ? handleUpdate : handleCreate}>{isEdit ? "Update Job" : "Create Job"}</Button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>Fill in the details for the new job vacancy.</DialogDescription>
            </DialogHeader>
            <JobForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No job postings found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Get started by creating your first job posting.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.isPublished, job.isArchived)}>
                        {getStatusLabel(job.isPublished, job.isArchived)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.employmentType}
                      </span>
                      {job.compensationRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.compensationRange}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishToggle(job.id!, !job.isPublished)}
                      disabled={job.isArchived}
                    >
                      {job.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.id!)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Description</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{job.description}</p>
                  </div>
                  {job.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Requirements</h4>
                      <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.responsibilities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Responsibilities</h4>
                      <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>Published: {job.publishAt ? new Date(job.publishAt).toLocaleDateString() : "Not set"}</span>
                      <span>Department: {job.department}</span>
                    </div>
                    {job.closeAt && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Closes: {new Date(job.closeAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>Update the job details below.</DialogDescription>
          </DialogHeader>
          <JobForm isEdit />
        </DialogContent>
      </Dialog>
    </div>
  )
}
