"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight, HiOutlineCheck, HiOutlinePhoto } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB, APP_URL } from "@/lib/api";
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
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    setFileName(file.name);
    try {
      const url = await uploadToImgBB(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (e) {
      setForm((f) => ({ ...f, image: "" }));
      setFileName("");
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
    if (!rules.every((r) => r.test(form.password))) {
      return setError("Password needs 8+ characters with upper, lower, and a number.");
    }
    if (!form.image.trim()) return setError("Add a Photo URL or upload an image via imgBB.");
    setBusy(true);
    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image,
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
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(11,61,58,0.9),rgba(15,118,110,0.7))]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <Link href="/" className="text-xl font-bold tracking-tight">{BRAND.name}</Link>
            <div>
              <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
                Create your Pledgekit account
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                Supporters start with 50 credits. Creators start with 20. One calm workspace for every role.
              </p>
              <ul className="mt-8 space-y-3">
                {["Transparent campaign funding", "Contribution review & refunds", "Stripe-ready credit packages"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15">
                      <HiOutlineCheck size={14} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-white/60">Minimal onboarding · Premium clarity</p>
          </div>
        </aside>

        <div className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex text-xl font-bold tracking-tight lg:hidden">
              {BRAND.name}<span className="text-[var(--brand)]">.</span>
            </Link>
            <p className="text-sm font-semibold text-[var(--brand)]">Register</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Get started free</h2>

            <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-1">
                <span className="field-label">Full name</span>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
              </label>
              <label>
                <span className="field-label">Email</span>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Photo URL</span>
                <Input
                  type="url"
                  value={form.image}
                  onChange={(e) => {
                    setFileName("");
                    setForm({ ...form, image: e.target.value });
                  }}
                  placeholder="https://i.ibb.co/..."
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Or upload via imgBB</span>
                <div className="relative flex h-11 items-center gap-3 rounded-lg border border-[var(--border)] bg-white px-3 shadow-sm transition hover:border-[var(--border-strong)] focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[var(--brand-soft)]">
                  <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-[var(--bg)] px-3 text-xs font-semibold text-[var(--ink-soft)]">
                    <HiOutlinePhoto size={15} className="text-[var(--brand)]" />
                    Choose file
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-[var(--muted)]">
                    {fileName || "No file chosen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => void upload(e.target.files?.[0])}
                  />
                </div>
                {form.image && (
                  <p className="mt-2 text-xs font-medium text-[var(--success)]">Profile image ready.</p>
                )}
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
              {error && (
                <p role="alert" className="rounded-lg bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)] sm:col-span-2">
                  {error}
                </p>
              )}
              <Button className="sm:col-span-2" size="lg" disabled={busy}>
                {busy ? "Creating account…" : <>Create account <HiOutlineArrowRight size={18} /></>}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-medium text-[var(--muted-soft)]">
              <i className="h-px flex-1 bg-[var(--border)]" />OR<i className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                void authClient.signIn.social({
                  provider: "google",
                  callbackURL: `${APP_URL}/dashboard`,
                  errorCallbackURL: `${APP_URL}/register`,
                  newUserCallbackURL: `${APP_URL}/dashboard`,
                })
              }
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
