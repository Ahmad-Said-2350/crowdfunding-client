"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const authBaseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Auth uses the Next.js origin. `/api/auth/*` is rewritten to the Express API
 * so Google OAuth cookies are first-party on Vercel.
 */
export const authClient = createAuthClient({
  baseURL: authBaseURL,
  fetchOptions: { credentials: "include" },
  plugins: [jwtClient()],
});
