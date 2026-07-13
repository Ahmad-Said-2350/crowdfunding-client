"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BRAND, type Role } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { saveToken, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: "supporter" as Exclude<Role, "admin">,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const strength = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password),
    /[a-z]/.test(form.password),
    /\d/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
  ].filter(Boolean).length;

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      setForm({ ...form, image: await uploadToImgBB(file) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Name must contain at least 2 characters.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (strength < 4) return setError("Use 8+ characters with uppercase, lowercase, number, and preferably a symbol.");
    if (form.image && !/^https?:\/\//.test(form.image)) return setError("Photo URL must start with http:// or https://.");
    setBusy(true);
    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image || undefined,
      ...({ role: form.role } as Record<string, string>),
    } as Parameters<typeof authClient.signUp.email>[0]);
    if (result.error) {
      setError(result.error.message || "Unable to register.");
      setBusy(false);
      return;
    }
    await saveToken();
    await refreshUser();
    router.replace("/dashboard");
  };

  return (
    <BasicLayout>
      <main className="container-pk py-16">
        <section className="mx-auto max-w-xl border border-[var(--border)] bg-white p-8">
          <p className="pk-kicker">Join {BRAND.name}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Supporters receive 50 credits. Creators receive 20 credits — once, at registration.
          </p>
          <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">Full name</span>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              <span className="field-label">Email</span>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Photo URL (optional)</span>
              <Input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Or upload to imgBB</span>
              <Input type="file" accept="image/*" onChange={(e) => void upload(e.target.files?.[0])} />
            </label>
            <label>
              <span className="field-label">Password</span>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <span className="mt-2 block text-xs text-[var(--muted)]">
                Strength: {["very weak", "weak", "fair", "good", "strong", "excellent"][strength]}
              </span>
            </label>
            <label>
              <span className="field-label">I want to join as</span>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Exclude<Role, "admin"> })}
              >
                <option value="supporter">Supporter</option>
                <option value="creator">Creator</option>
              </Select>
            </label>
            {error && <p role="alert" className="text-sm text-[var(--danger)] sm:col-span-2">{error}</p>}
            <Button className="sm:col-span-2" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
          </form>
          <p className="mt-6 text-sm">
            Already registered? <Link href="/login" className="font-semibold text-[var(--pk-blue)]">Sign in</Link>
          </p>
        </section>
      </main>
    </BasicLayout>
  );
}
