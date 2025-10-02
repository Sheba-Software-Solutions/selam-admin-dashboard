"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Mail, MessageSquare, Clock, User, CheckCircle } from "lucide-react"
import { apiClient, type ContactMessage } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function ContactManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast  = useToast()

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getContactMessages()
      if (response.success) {
        setMessages(response.data)
      }
    } catch (error) {
      console.error("Failed to load contact messages:", error)
      toast({
        title: "Error",
        description: "Failed to load contact messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || message.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: ContactMessage["status"]) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "RESOLVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "DISMISSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateMessageStatus = async (messageId: string, newStatus: ContactMessage["status"]) => {
    try {
      const response = await apiClient.updateContactMessageStatus(messageId, newStatus)
      if (response.success) {
        await loadMessages()
        // Update selected message if it's the one being updated
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus })
        }
        toast({
          title: "Success",
          description: "Message status updated successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to update message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusLabel = (status: ContactMessage["status"]) => {
    switch (status) {
      case "NEW":
        return "New"
      case "IN_PROGRESS":
        return "In Progress"
      case "RESOLVED":
        return "Resolved"
      case "DISMISSED":
        return "Dismissed"
      default:
        return status
    }
  }

  const getStatusIcon = (status: ContactMessage["status"]) => {
    switch (status) {
      case "NEW":
        return MessageSquare
      case "IN_PROGRESS":
        return Clock
      case "RESOLVED":
        return CheckCircle
      case "DISMISSED":
        return User
      default:
        return MessageSquare
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contact Messages</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage and respond to customer inquiries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search messages..."
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
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="DISMISSED">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Grid */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No messages found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {messages.length === 0
                  ? "No contact messages have been received yet."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => {
            const StatusIcon = getStatusIcon(message.status)
            return (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-slate-100 dark:bg-slate-700">
                          {message.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <CardTitle className="text-lg">{message.subject}</CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {message.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {message.email}
                            </span>
                          </CardDescription>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{message.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(message.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(message.status)}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{message.subject}</DialogTitle>
                            <DialogDescription>Contact message details and status management</DialogDescription>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-lg">
                                    {selectedMessage.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                  <h3 className="text-xl font-semibold">{selectedMessage.name}</h3>
                                  <p className="text-slate-600 dark:text-slate-400">{selectedMessage.email}</p>
                                  <Badge className={getStatusColor(selectedMessage.status)}>
                                    {getStatusLabel(selectedMessage.status)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Subject</h4>
                                  <p className="text-slate-900 dark:text-slate-100">{selectedMessage.subject}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Message</h4>
                                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                      {selectedMessage.message}
                                    </p>
                                  </div>
                                </div>

                                {selectedMessage.handledAt && selectedMessage.handledById && (
                                  <div>
                                    <h4 className="font-medium mb-2">Handling Information</h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                      <p>Handled by: {selectedMessage.handledById}</p>
                                      <p>Handled on: {new Date(selectedMessage.handledAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(["NEW", "IN_PROGRESS", "RESOLVED", "DISMISSED"] as const).map((status) => (
                                    <Button
                                      key={status}
                                      variant={selectedMessage.status === status ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateMessageStatus(selectedMessage.id!, status)}
                                    >
                                      {getStatusLabel(status)}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                  variant="outline"
                                  className="w-full bg-transparent"
                                  onClick={() => {
                                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
                                  }}
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Reply via Email
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Received: {message.id ? "Recently" : "Unknown"}</span>
                    {message.handledAt && <span>Handled: {new Date(message.handledAt).toLocaleDateString()}</span>}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
