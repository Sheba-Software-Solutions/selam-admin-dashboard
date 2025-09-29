"use client"

import { useState } from "react"
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
import { Search, Eye, Mail, Phone, MapPin, Calendar, FileText, Star, Users } from "lucide-react"

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  location: string
  jobTitle: string
  appliedDate: string
  status: "new" | "reviewing" | "interview" | "offer" | "rejected" | "hired"
  experience: string
  skills: string[]
  resume: string
  rating: number
  notes: string
}

const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-20",
    status: "interview",
    experience: "6 years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    resume: "sarah-johnson-resume.pdf",
    rating: 4.5,
    notes: "Strong technical background, excellent portfolio. Scheduled for technical interview.",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-18",
    status: "reviewing",
    experience: "5 years",
    skills: ["React", "Vue.js", "JavaScript", "CSS"],
    resume: "michael-chen-resume.pdf",
    rating: 4.0,
    notes: "Good experience with modern frameworks. Need to review portfolio.",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    jobTitle: "Product Manager",
    appliedDate: "2024-01-15",
    status: "offer",
    experience: "4 years",
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    resume: "emily-rodriguez-resume.pdf",
    rating: 4.8,
    notes: "Excellent product sense and leadership skills. Ready to extend offer.",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 321-0987",
    location: "Seattle, WA",
    jobTitle: "DevOps Engineer",
    appliedDate: "2024-01-12",
    status: "new",
    experience: "3 years",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    resume: "david-kim-resume.pdf",
    rating: 0,
    notes: "",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    phone: "+1 (555) 654-3210",
    location: "Los Angeles, CA",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-10",
    status: "rejected",
    experience: "2 years",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    resume: "lisa-wang-resume.pdf",
    rating: 2.5,
    notes: "Lacks required experience for senior role. Consider for junior positions.",
  },
]

export function ApplicantTracking() {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter
    const matchesJob = jobFilter === "all" || applicant.jobTitle === jobFilter

    return matchesSearch && matchesStatus && matchesJob
  })

  const getStatusColor = (status: Applicant["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "offer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "hired":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateApplicantStatus = (applicantId: string, newStatus: Applicant["status"]) => {
    setApplicants(
      applicants.map((applicant) => (applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant)),
    )
  }

  const uniqueJobs = Array.from(new Set(applicants.map((a) => a.jobTitle)))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Applicant Tracking</h1>
        <p className="text-slate-600 dark:text-slate-400">Review and manage job applicants</p>
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {uniqueJobs.map((job) => (
              <SelectItem key={job} value={job}>
                {job}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applicants Grid */}
      <div className="grid gap-4">
        {filteredApplicants.map((applicant) => (
          <Card key={applicant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={`/abstract-geometric-shapes.png?key=al7tm&height=48&width=48&query=${applicant.name}`}
                    />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-700">
                      {applicant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{applicant.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{applicant.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {applicant.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {applicant.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {applicant.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">Experience: {applicant.experience}</span>
                      {applicant.rating > 0 && (
                        <div className="flex items-center gap-1">
                          {renderStars(applicant.rating)}
                          <span className="text-slate-600 dark:text-slate-400 ml-1">({applicant.rating})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {applicant.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{applicant.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(applicant.status)}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedApplicant(applicant)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{applicant.name}</DialogTitle>
                        <DialogDescription>Applicant details and status management</DialogDescription>
                      </DialogHeader>
                      {selectedApplicant && (
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?key=zzzg0&height=64&width=64&query=${selectedApplicant.name}`}
                              />
                              <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-lg">
                                {selectedApplicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                              <p className="text-slate-600 dark:text-slate-400">{selectedApplicant.jobTitle}</p>
                              <div className="flex items-center gap-1">
                                {renderStars(selectedApplicant.rating)}
                                <span className="text-slate-600 dark:text-slate-400 ml-2">
                                  ({selectedApplicant.rating}/5)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Contact Information</h4>
                              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                <p className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {selectedApplicant.email}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {selectedApplicant.phone}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {selectedApplicant.location}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Application Details</h4>
                              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                <p className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Applied: {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                                </p>
                                <p>Experience: {selectedApplicant.experience}</p>
                                <p className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  {selectedApplicant.resume}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplicant.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {selectedApplicant.notes && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Notes</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                {selectedApplicant.notes}
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="font-medium">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {["new", "reviewing", "interview", "offer", "hired", "rejected"].map((status) => (
                                <Button
                                  key={status}
                                  variant={selectedApplicant.status === status ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateApplicantStatus(selectedApplicant.id, status as Applicant["status"])
                                  }
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No applicants found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
