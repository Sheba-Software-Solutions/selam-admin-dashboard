const API_BASE_URL ="http://localhost:8080/api/v1"

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface AdminUser {
  email: string
  displayName: string
  role: string
  isActive: boolean
}

export interface Product {
  slug: string
  name: string
  category: string
  shortDescription: string
  longDescription: string
  features: string[]
  priceModel: string
  status: "ACTIVE" | "COMING_SOON" | "DISCONTINUED"
  heroImageUrl: string
  gallery: string[]
  rating: number
  usersCount: number
  isArchived: boolean
}

export interface JobPosting {
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

export interface JobApplication {
  id?: string
  jobId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  coverLetter: string
  resumeUrl: string
  linkedinUrl: string
  portfolioUrl: string
  status: "SUBMITTED" | "IN_REVIEW" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN"
  reviewedAt?: string
  reviewerId?: string
}

export interface ContactMessage {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED"
  handledById?: string
  handledAt?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Try to get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<AdminUser>> {
    const response = await this.request<AdminUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response
  }

  async logout(token: string): Promise<ApiResponse<any>> {
    return this.request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async getProfile(userId?: string): Promise<ApiResponse<AdminUser>> {
    const query = userId ? `?userId=${userId}` : ""
    return this.request<AdminUser>(`/auth/me${query}`)
  }

  // Product endpoints
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>("/products")
  }

  async createProduct(product: Omit<Product, "isArchived">): Promise<ApiResponse<Product>> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  async updateProductStatus(id: string, status: Product["status"]): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    })
  }

  // Job endpoints
  async getJobs(): Promise<ApiResponse<JobPosting[]>> {
    return this.request<JobPosting[]>("/jobs")
  }

  async createJob(job: Omit<JobPosting, "id" | "isArchived">): Promise<ApiResponse<JobPosting>> {
    return this.request<JobPosting>("/jobs", {
      method: "POST",
      body: JSON.stringify(job),
    })
  }

  async updateJob(id: string, job: Partial<JobPosting>): Promise<ApiResponse<JobPosting>> {
    return this.request<JobPosting>(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(job),
    })
  }

  async deleteJob(id: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}`, {
      method: "DELETE",
    })
  }

  async publishJob(id: string, publish: boolean): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ publish }),
    })
  }

  // Application endpoints
  async getApplications(): Promise<ApiResponse<JobApplication[]>> {
    return this.request<JobApplication[]>("/applications/applications")
  }

  async getApplication(id: string): Promise<ApiResponse<JobApplication>> {
    return this.request<JobApplication>(`/applications/applications/${id}`)
  }

  async updateApplicationStatus(id: string, status: JobApplication["status"]): Promise<ApiResponse<any>> {
    return this.request(`/applications/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Contact message endpoints
  async getContactMessages(): Promise<ApiResponse<ContactMessage[]>> {
    return this.request<ContactMessage[]>("/contact/messages")
  }

  async getContactMessage(id: string): Promise<ApiResponse<ContactMessage>> {
    return this.request<ContactMessage>(`/contact/messages/${id}`)
  }

  async updateContactMessageStatus(
    id: string,
    status: ContactMessage["status"],
    handlerId?: string,
  ): Promise<ApiResponse<any>> {
    return this.request(`/contact/messages/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, handlerId }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
