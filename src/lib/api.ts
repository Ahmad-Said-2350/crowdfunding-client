/** Upstream Express API (used by next.config rewrites). */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

/**
 * In the browser, call same-origin `/api/*` (rewritten to Express).
 * On the server, call the upstream API URL directly.
 */
export function apiBase(): string {
  if (typeof window !== "undefined") return "";
  return API_URL;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("pledgekit_token") : null;
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError((data as { message?: string }).message || "Request failed", response.status);
  }
  return data as T;
}

export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("Image upload is not configured (NEXT_PUBLIC_IMGBB_API_KEY).");
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const data = await response.json();
  if (!response.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || "Image upload failed.");
  }
  return data.data.url as string;
}
