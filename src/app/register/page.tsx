"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BRAND, type Role } from "@/lib/types";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
];

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

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadToImgBB(file);
      setForm((f) => ({ ...f, image: url }));
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
    if (!rules.every((r) => r.test(form.password))) return setError("Please meet all password rules.");
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
    <div className="min-h-screen bg-[linear-gradient(165deg,#f7faf9_0%,#eaf6f4_40%,#f8fafc_100%)]">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <Link href="/" className="inline-flex text-xl font-bold tracking-tight">
            {BRAND.name}<span className="text-[var(--brand)]">.</span>
          </Link>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-[var(--ink)] md:text-5xl">
            Create your Pledgekit account
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[var(--muted)]">
            Supporters start with 50 credits. Creators start with 20. One clean workspace for every role.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Transparent campaign funding",
              "Contribution review & refunds",
              "Stripe-ready credit packages",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-[var(--ink-soft)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white p-7 shadow-[var(--shadow-lg)] md:p-9">
          <p className="text-sm font-semibold text-[var(--brand)]">Register</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Get started free</h2>
          <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-1">
              <span className="field-label">Full name</span>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
            </label>
            <label>
              <span className="field-label">Email</span>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Photo URL (optional)</span>
              <Input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://" />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Or upload image</span>
              <Input type="file" accept="image/*" onChange={(e) => void upload(e.target.files?.[0])} />
            </label>
            <label>
              <span className="field-label">Password</span>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Create a strong password" />
            </label>
            <label>
              <span className="field-label">Join as</span>
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Exclude<Role, "admin"> })}>
                <option value="supporter">Supporter</option>
                <option value="creator">Creator</option>
              </Select>
            </label>
            <div className="grid gap-2 sm:col-span-2">
              {rules.map((rule) => {
                const ok = rule.test(form.password);
                return (
                  <p key={rule.label} className={`flex items-center gap-2 text-xs font-medium ${ok ? "text-[var(--success)]" : "text-[var(--muted-soft)]"}`}>
                    <Check size={14} /> {rule.label}
                  </p>
                );
              })}
            </div>
            {error && (
              <p role="alert" className="rounded-[12px] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] sm:col-span-2">
                {error}
              </p>
            )}
            <Button className="sm:col-span-2" size="lg" disabled={busy}>
              {busy ? "Creating account…" : <>Create account <ArrowRight size={18} /></>}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
