"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/types";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { saveToken, refreshUser } = useAuth();
  const [message, setMessage] = useState("Completing Google sign-in…");

  useEffect(() => {
    let cancelled = false;

    const finish = async () => {
      try {
        for (let attempt = 0; attempt < 8; attempt++) {
          const session = await authClient.getSession();
          if (session.data?.user) {
            await saveToken();
            await refreshUser();
            if (!cancelled) router.replace("/dashboard");
            return;
          }
          // First attempts often race the Set-Cookie from the OAuth redirect
          await saveToken().catch(() => undefined);
          await new Promise((r) => setTimeout(r, 250));
        }

        if (!cancelled) {
          setMessage("Google sign-in did not complete. Redirecting…");
          router.replace("/login?error=google");
        }
      } catch {
        if (!cancelled) router.replace("/login?error=google");
      }
    };

    void finish();
    return () => {
      cancelled = true;
    };
  }, [router, saveToken, refreshUser]);

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-5">
      <div className="text-center">
        <p className="text-lg font-bold tracking-tight text-[var(--ink)]">{BRAND.name}</p>
        <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
      </div>
    </div>
  );
}
