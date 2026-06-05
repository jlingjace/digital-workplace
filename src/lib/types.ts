export type Department = "ALL" | "PEOPLE" | "FINANCE" | "GTM" | "ENGINEERING" | "IT";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  department: Department;
  authorName: string;
  authorContact?: string;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  attachmentUrl?: string;
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  url?: string;
  department: Department;
  description?: string;
  ownerName: string;
  ownerSlack?: string;
  ownerEmail: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}
