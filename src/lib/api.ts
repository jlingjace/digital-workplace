import { Announcement, Tool, ListResponse, SingleResponse, Department } from "./types";
import { MOCK_ANNOUNCEMENTS, MOCK_TOOLS } from "./mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// --- Announcements ---

export async function getAnnouncements(params?: {
  department?: Department;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ListResponse<Announcement>> {
  if (USE_MOCK) {
    let items = [...MOCK_ANNOUNCEMENTS].filter(
      (a) => a.status === "PUBLISHED"
    );
    if (params?.department) {
      items = items.filter((a) => a.department === params.department);
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter((a) => a.title.toLowerCase().includes(q));
    }
    // Pinned first
    items.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);
    return {
      data: paged,
      pagination: { page, limit, total: items.length, totalPages: Math.ceil(items.length / limit) },
    };
  }

  const qs = new URLSearchParams();
  if (params?.department) qs.set("department", params.department);
  if (params?.q) qs.set("q", params.q);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  return apiFetch(`/api/announcements?${qs}`);
}

export async function getAnnouncement(id: string): Promise<SingleResponse<Announcement>> {
  if (USE_MOCK) {
    const item = MOCK_ANNOUNCEMENTS.find((a) => a.id === id);
    if (!item) throw new Error("Not found");
    return { data: item };
  }
  return apiFetch(`/api/announcements/${id}`);
}

export async function getAllAnnouncementsAdmin(): Promise<ListResponse<Announcement>> {
  if (USE_MOCK) {
    return {
      data: MOCK_ANNOUNCEMENTS,
      pagination: {
        page: 1,
        limit: 50,
        total: MOCK_ANNOUNCEMENTS.length,
        totalPages: 1,
      },
    };
  }
  return apiFetch("/api/admin/announcements");
}

// --- Tools ---

export async function getTools(params?: {
  q?: string;
  department?: Department;
}): Promise<ListResponse<Tool>> {
  if (USE_MOCK) {
    let items = [...MOCK_TOOLS];
    if (params?.department) {
      items = items.filter((t) => t.department === params.department);
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.ownerName.toLowerCase().includes(q)
      );
    }
    return {
      data: items,
      pagination: { page: 1, limit: 100, total: items.length, totalPages: 1 },
    };
  }
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.department) qs.set("department", params.department);
  return apiFetch(`/api/tools?${qs}`);
}

export async function getAllToolsAdmin(): Promise<ListResponse<Tool>> {
  if (USE_MOCK) {
    return {
      data: MOCK_TOOLS,
      pagination: { page: 1, limit: 100, total: MOCK_TOOLS.length, totalPages: 1 },
    };
  }
  return apiFetch("/api/admin/tools");
}
