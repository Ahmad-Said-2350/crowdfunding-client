"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter(); const { saveToken, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Password must contain at least 8 characters.");
    setBusy(true);
    const result = await authClient.signIn.email(form);
    if (result.error) { setError(result.error.message || "Unable to sign in."); setBusy(false); return; }
    await saveToken(); await refreshUser(); router.replace("/dashboard");
  };
  const google = async () => { await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" }); };
  return <BasicLayout><main className="container-fundora grid min-h-[75vh] items-center py-16"><section className="mx-auto w-full max-w-md">
    <p className="text-sm font-semibold uppercase tracking-widest text-[var(--ibm-blue)]">Welcome back</p><h1 className="mt-3 font-serif text-4xl">Sign in to Fundora</h1><p className="mt-3 text-sm text-[var(--muted)]">Manage contributions, campaigns, and credits in one place.</p>
    <form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="field-label">Email</span><Input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required /></label>
      <label className="block"><span className="field-label">Password</span><Input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} required /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}<Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form><div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><i className="h-px flex-1 bg-[var(--border)]" />OR<i className="h-px flex-1 bg-[var(--border)]" /></div>
    <Button variant="secondary" className="w-full" onClick={() => void google()}>Continue with Google</Button><p className="mt-6 text-sm">New to Fundora? <Link href="/register" className="font-semibold text-[var(--ibm-blue)]">Create an account</Link></p>
  </section></main></BasicLayout>;
}
