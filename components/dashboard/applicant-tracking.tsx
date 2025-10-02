"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Mail, Phone, FileText, Star, Users, ExternalLink } from "lucide-react"
import { apiClient, type JobApplication } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function ApplicantTracking() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getApplications()
      if (response.success) {
        setApplications(response.data)
      }
    } catch (error) {
      console.error("Failed to load applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.jobId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || application.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "SHORTLISTED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "HIRED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: JobApplication["status"]) => {
    try {
      const response = await apiClient.updateApplicationStatus(applicationId, newStatus)
      if (response.success) {
        await loadApplications()
        // Update selected application if it's the one being updated
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication({ ...selectedApplication, status: newStatus })
        }
        toast({
          title: "Success",
          description: "Application status updated successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to update application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusLabel = (status: JobApplication["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return "Submitted"
      case "IN_REVIEW":
        return "In Review"
      case "SHORTLISTED":
        return "Shortlisted"
      case "HIRED":
        return "Hired"
      case "REJECTED":
        return "Rejected"
      case "WITHDRAWN":
        return "Withdrawn"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Applicant Tracking</h1>
        <p className="text-slate-600 dark:text-slate-400">Review and manage job applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
            <SelectItem value="HIRED">Hired</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No applications found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {applications.length === 0
                  ? "No applications have been submitted yet."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`/.jpg?height=48&width=48&query=${application.candidateName}`}
                        alt={application.candidateName}
                      />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-700">
                        {application.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {application.candidateName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Job ID: {application.jobId}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.candidateEmail}
                        </span>
                        {application.candidatePhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.candidatePhone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Applied: {application.id ? "Recently" : "Unknown"}
                        </span>
                        {application.reviewedAt && (
                          <span className="text-slate-600 dark:text-slate-400">
                            Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(application.status)}>{getStatusLabel(application.status)}</Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{application.candidateName}</DialogTitle>
                          <DialogDescription>Application details and status management</DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage
                                  src={`/.jpg?height=64&width=64&query=${selectedApplication.candidateName}`}
                                  alt={selectedApplication.candidateName}
                                />
                                <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-lg">
                                  {selectedApplication.candidateName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold">{selectedApplication.candidateName}</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                  Job ID: {selectedApplication.jobId}
                                </p>
                                <Badge className={getStatusColor(selectedApplication.status)}>
                                  {getStatusLabel(selectedApplication.status)}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Contact Information</h4>
                                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                  <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {selectedApplication.candidateEmail}
                                  </p>
                                  {selectedApplication.candidatePhone && (
                                    <p className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      {selectedApplication.candidatePhone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {selectedApplication.coverLetter && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Cover Letter</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                  {selectedApplication.coverLetter}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <h4 className="font-medium">Documents & Links</h4>
                              <div className="space-y-2">
                                {selectedApplication.resumeUrl && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <a
                                      href={selectedApplication.resumeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                      Resume <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                                {selectedApplication.linkedinUrl && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <a
                                      href={selectedApplication.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                      LinkedIn Profile <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                                {selectedApplication.portfolioUrl && (
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    <a
                                      href={selectedApplication.portfolioUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                      Portfolio <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Update Status</h4>
                              <div className="flex flex-wrap gap-2">
                                {(
                                  ["SUBMITTED", "IN_REVIEW", "SHORTLISTED", "HIRED", "REJECTED", "WITHDRAWN"] as const
                                ).map((status) => (
                                  <Button
                                    key={status}
                                    variant={selectedApplication.status === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateApplicationStatus(selectedApplication.id!, status)}
                                  >
                                    {getStatusLabel(status)}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {selectedApplication.reviewedAt && selectedApplication.reviewerId && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Review Information</h4>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  <p>Reviewed by: {selectedApplication.reviewerId}</p>
                                  <p>Reviewed on: {new Date(selectedApplication.reviewedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
