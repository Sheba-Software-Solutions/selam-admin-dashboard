// API utility for Selam Backend
import type {
  AdminUser, Product, JobPosting, JobApplication, ContactMessage, AuditLog
} from './types';

const API_BASE = 'http://localhost:8080/api/v1';

// --- Auth ---
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json() as Promise<{ success: boolean; data: AdminUser }>;
}

export async function refreshToken(token: string) {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

export async function logout(token: string) {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
}

export async function getMe(userId: string) {
  const res = await fetch(`${API_BASE}/auth/me?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json() as Promise<{ success: boolean; data: AdminUser }>;
}

// --- Products ---
export async function listProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<{ success: boolean; data: Product[] }>;
}

export async function createProduct(product: Product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function updateProduct(id: string, product: Product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function patchProduct(id: string, product: Partial<Product>) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to patch product');
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to archive product');
  return res.json();
}

export async function changeProductStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/products/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to change product status');
  return res.json();
}

// --- Jobs ---
export async function listJobs() {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json() as Promise<{ success: boolean; data: JobPosting[] }>;
}

export async function createJob(job: JobPosting) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}

export async function getJob(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
}

export async function updateJob(id: string, job: JobPosting) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  });
  if (!res.ok) throw new Error('Failed to update job');
  return res.json();
}

export async function patchJob(id: string, job: Partial<JobPosting>) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  });
  if (!res.ok) throw new Error('Failed to patch job');
  return res.json();
}

export async function deleteJob(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to archive job');
  return res.json();
}

export async function publishJob(id: string, publish: boolean) {
  const res = await fetch(`${API_BASE}/jobs/${id}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publish })
  });
  if (!res.ok) throw new Error('Failed to change publish status');
  return res.json();
}

// --- Applications ---
export async function submitJobApplication(id: string, application: JobApplication) {
  const res = await fetch(`${API_BASE}/applications/jobs/${id}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  });
  if (!res.ok) throw new Error('Failed to submit application');
  return res.json();
}

export async function listApplications() {
  const res = await fetch(`${API_BASE}/applications/applications`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json() as Promise<{ success: boolean; data: JobApplication[] }>;
}

export async function getApplication(id: string) {
  const res = await fetch(`${API_BASE}/applications/applications/${id}`);
  if (!res.ok) throw new Error('Failed to fetch application');
  return res.json();
}

export async function patchApplication(id: string, status: string) {
  const res = await fetch(`${API_BASE}/applications/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update application status');
  return res.json();
}

// --- Contact ---
export async function submitContactMessage(message: ContactMessage) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!res.ok) throw new Error('Failed to submit message');
  return res.json();
}

export async function listContactMessages() {
  const res = await fetch(`${API_BASE}/contact/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json() as Promise<{ success: boolean; data: ContactMessage[] }>;
}

export async function getContactMessage(id: string) {
  const res = await fetch(`${API_BASE}/contact/messages/${id}`);
  if (!res.ok) throw new Error('Failed to fetch message');
  return res.json();
}

export async function patchContactMessageStatus(id: string, status: string, handlerId?: string) {
  const res = await fetch(`${API_BASE}/contact/messages/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, handlerId })
  });
  if (!res.ok) throw new Error('Failed to update message status');
  return res.json();
}

// --- Audit Logs ---
export async function listAuditLogs() {
  const res = await fetch(`${API_BASE}/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json() as Promise<{ success: boolean; data: AuditLog[] }>;
}

// --- Health ---
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('API health check failed');
  return res.json();
}
