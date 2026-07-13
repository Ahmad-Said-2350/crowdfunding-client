export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function fetchJSON<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pledgekit_token") || localStorage.getItem("fundora_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const data = await response.json().catch(() => ({ message: "Unexpected server response." }));
  if (!response.ok) throw new ApiError(data.message || "Request failed.", response.status);
  return data as T;
}

export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("Image upload is not configured. Enter an image URL instead.");
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const result = await response.json();
  if (!response.ok || !result.data?.url) throw new Error(result.error?.message || "Image upload failed.");
  return result.data.url;
}
