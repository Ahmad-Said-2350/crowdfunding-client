"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowRight, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { APP_URL } from "@/lib/api";
import { BRAND } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { saveToken, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const googleFailed = params.get("error") === "google";

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
    <div className="w-full max-w-md">
      <Link href="/" className="mb-10 inline-flex text-xl font-bold tracking-tight lg:hidden">
        {BRAND.name}<span className="text-[var(--brand)]">.</span>
      </Link>
      <p className="text-sm font-semibold text-[var(--brand)]">Sign in</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">Access your workspace</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">Enter your credentials to continue.</p>
      {googleFailed && (
        <p role="alert" className="mt-4 rounded-lg bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          Google sign-in failed. In Google Cloud Console, set the redirect URI to end with{" "}
          <code className="font-semibold">/api/auth/callback/google</code> (not /goog), and add both Vercel origins.
        </p>
      )}

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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
        </label>
        {error && (
          <p role="alert" className="rounded-lg bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <Button className="w-full" size="lg" disabled={busy}>
          {busy ? "Signing in…" : <>Sign in <HiOutlineArrowRight size={18} /></>}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-[var(--muted-soft)]">
        <i className="h-px flex-1 bg-[var(--border)]" />OR<i className="h-px flex-1 bg-[var(--border)]" />
      </div>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          const origin = typeof window !== "undefined" ? window.location.origin : APP_URL;
          void authClient.signIn.social({
            provider: "google",
            callbackURL: `${origin}/auth/callback`,
            errorCallbackURL: `${origin}/login?error=google`,
            newUserCallbackURL: `${origin}/auth/callback`,
          });
        }}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        New to {BRAND.name}?{" "}
        <Link href="/register" className="font-semibold text-[var(--brand)] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(11,61,58,0.88),rgba(15,118,110,0.72))]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {BRAND.name}
            </Link>
            <div>
              <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
                Welcome back to clearer crowdfunding.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                Manage credits, campaigns, and contributions — built for Supporters, Creators, and Admins.
              </p>
            </div>
            <p className="text-xs text-white/60">Secure sessions · Role-based dashboards · Transparent credits</p>
          </div>
        </aside>

        <div className="flex items-center justify-center px-5 py-12">
          <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
