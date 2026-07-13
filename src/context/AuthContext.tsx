"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, fetchJSON } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/types";

type AuthValue = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  saveToken: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const saveToken = useCallback(async () => {
    try {
      const result = await authClient.token();
      const token = (result.data as { token?: string } | null)?.token;
      if (token) localStorage.setItem("pledgekit_token", token);
      localStorage.removeItem("fundora_token");
    } catch {
      /* Session cookie may still authenticate same-origin /api/me. */
    }
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut().catch(() => undefined);
    localStorage.removeItem("pledgekit_token");
    localStorage.removeItem("fundora_token");
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      await saveToken();
      const data = await fetchJSON<{ user: User }>("/api/me");
      setUser(data.user);
    } catch (error) {
      setUser(null);
      // 401 = logged out (normal). Only hard-clear on blocked accounts.
      if (error instanceof ApiError && error.status === 403) {
        localStorage.removeItem("pledgekit_token");
        await authClient.signOut().catch(() => undefined);
      } else if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem("pledgekit_token");
      }
    } finally {
      setLoading(false);
    }
  }, [saveToken]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
