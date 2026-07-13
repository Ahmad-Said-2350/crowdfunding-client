"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJSON } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/types";

type AuthValue = {
  user: User | null; loading: boolean; refreshUser: () => Promise<void>;
  saveToken: () => Promise<void>; logout: () => Promise<void>;
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
      if (token) localStorage.setItem("fundora_token", token);
    } catch { /* Cookie sessions still work when JWT retrieval is unavailable. */ }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await fetchJSON<{ user: User }>("/api/me");
      setUser(data.user);
      await saveToken();
    } catch {
      setUser(null);
      localStorage.removeItem("fundora_token");
    } finally {
      setLoading(false);
    }
  }, [saveToken]);

  useEffect(() => { void refreshUser(); }, [refreshUser]);

  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem("fundora_token");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return <AuthContext.Provider value={{ user, loading, refreshUser, saveToken, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
