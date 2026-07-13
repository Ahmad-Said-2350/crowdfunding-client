"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { saveToken, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    const result = await authClient.signIn.email(form);
    if (result.error) {
      setError(result.error.message || "Unable to sign in.");
      setBusy(false);
      return;
    }
    await saveToken();
    await refreshUser();
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#f3f6f6_0%,#e7f3f1_45%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="mb-10 lg:mb-0 lg:flex-1">
          <Link href="/" className="inline-flex items-center text-xl font-bold tracking-tight text-[var(--ink)]">
            {BRAND.name}<span className="text-[var(--brand)]">.</span>
          </Link>
          <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-[var(--ink)] md:text-5xl">
            Welcome back to clearer crowdfunding.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[var(--muted)]">
            Sign in to manage credits, campaigns, and contributions — built for Supporters, Creators, and Admins.
          </p>
          <div className="mt-8 hidden gap-3 lg:flex">
            {["Secure sessions", "Role-based dashboards", "Transparent credits"].map((item) => (
              <span key={item} className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--brand-deep)] shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-md">
          <div className="rounded-[24px] border border-white/70 bg-white/95 p-7 shadow-[var(--shadow-lg)] backdrop-blur md:p-9">
            <p className="text-sm font-semibold text-[var(--brand)]">Sign in</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Access your workspace</h2>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="field-label">Email</span>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="field-label">Password</span>
                <div className="relative">
                  <Input
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-12"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              {error && (
                <p role="alert" className="rounded-[12px] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
                  {error}
                </p>
              )}
              <Button className="w-full" size="lg" disabled={busy}>
                {busy ? "Signing in…" : <>Sign in <ArrowRight size={18} /></>}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-medium text-[var(--muted-soft)]">
              <i className="h-px flex-1 bg-[var(--border)]" />OR<i className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => void authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
            >
              Continue with Google
            </Button>
            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              New to {BRAND.name}?{" "}
              <Link href="/register" className="font-semibold text-[var(--brand)] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
