// TypeScript types for Selam Backend API

export interface AdminUser {
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  priceModel: string;
  status: string;
  heroImageUrl: string;
  gallery: string[];
  rating: number;
  usersCount: number;
  isArchived: boolean;
}

export interface JobPosting {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  compensationRange: string;
  isPublished: boolean;
  isArchived: boolean;
  publishAt: string;
  closeAt: string;
}

export interface JobApplication {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  coverLetter: string;
  resumeUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  status: string;
  reviewedAt: string;
  reviewerId: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  handledById: string;
  handledAt: string;
}

export interface AuditLog {
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: string;
}
