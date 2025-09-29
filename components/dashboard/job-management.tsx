"use client"

import { useEffect, useState } from "react"
import { listJobs, createJob, updateJob, deleteJob as apiDeleteJob } from "@/lib/api"
import type { JobPosting } from "@/lib/types"
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
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign } from "lucide-react"

type Job = JobPosting & { id?: string; applicants?: number }



  const [jobs, setJobs] = useState<Job[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<JobPosting>({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    description: "",
    requirements: [],
    responsibilities: [],
    compensationRange: "",
    isPublished: false,
    isArchived: false,
    publishAt: "",
    closeAt: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    listJobs()
      .then((res) => setJobs(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      employmentType: "",
      description: "",
      requirements: [],
      responsibilities: [],
      compensationRange: "",
      isPublished: false,
      isArchived: false,
      publishAt: "",
      closeAt: "",
    })
  }

  const handleCreate = async () => {
    setLoading(true)
    setError(null)
    try {
      await createJob(formData)
      const res = await listJobs()
      setJobs(res.data)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      description: job.description,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      compensationRange: job.compensationRange,
      isPublished: job.isPublished,
      isArchived: job.isArchived,
      publishAt: job.publishAt,
      closeAt: job.closeAt,
    })
  }

  const handleUpdate = async () => {
    if (!editingJob) return
    setLoading(true)
    setError(null)
    try {
      // Assume job has an id field
      await updateJob(editingJob.id as string, formData)
      const res = await listJobs()
      setJobs(res.data)
      setEditingJob(null)
      resetForm()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiDeleteJob(jobId)
      setJobs(jobs.filter((job) => job.id !== jobId))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Status color based on isPublished/isArchived
  const getStatusColor = (job: Job) => {
    if (job.isArchived) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    if (job.isPublished) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }

  const JobForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    // For requirements, use a comma-separated string for editing
    const [requirementsInput, setRequirementsInput] = useState(formData.requirements.join(", "));
    // For responsibilities, use a comma-separated string for editing
    const [responsibilitiesInput, setResponsibilitiesInput] = useState(formData.responsibilities.join(", "));

    // Sync input fields with formData when editing
    useEffect(() => {
      setRequirementsInput(formData.requirements.join(", "));
      setResponsibilitiesInput(formData.responsibilities.join(", "));
    }, [formData]);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentType">Job Type</Label>
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

        <div className="space-y-2">
          <Label htmlFor="compensationRange">Salary Range</Label>
          <Input
            id="compensationRange"
            value={formData.compensationRange}
            onChange={(e) => setFormData({ ...formData, compensationRange: e.target.value })}
            placeholder="e.g. $120,000 - $160,000"
          />
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
          <Label htmlFor="requirements">Requirements (comma separated)</Label>
          <Textarea
            id="requirements"
            value={requirementsInput}
            onChange={(e) => {
              setRequirementsInput(e.target.value);
              setFormData({ ...formData, requirements: e.target.value.split(",").map(s => s.trim()).filter(Boolean) });
            }}
            placeholder="List the required skills and qualifications..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsibilities">Responsibilities (comma separated)</Label>
          <Textarea
            id="responsibilities"
            value={responsibilitiesInput}
            onChange={(e) => {
              setResponsibilitiesInput(e.target.value);
              setFormData({ ...formData, responsibilities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) });
            }}
            placeholder="List the responsibilities..."
            rows={2}
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
    );
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

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {job.isPublished ? "Published" : "Draft"}
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
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.compensationRange}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(job.id as string)}
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
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Requirements</h4>
                  <ul className="text-slate-600 dark:text-slate-400 text-sm list-disc ml-5">
                    {job.requirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>Publish At: {job.publishAt ? new Date(job.publishAt).toLocaleDateString() : "-"}</span>
                    <span>Department: {job.department}</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {job.applicants || 0} applicants
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

