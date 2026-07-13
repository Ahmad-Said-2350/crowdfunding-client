"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlinePhoto,
  HiOutlineUser,
} from "react-icons/hi2";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { fetchJSON, uploadToImgBB } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL, type User } from "@/lib/types";

type ProfileForm = {
  name: string;
  image: string;
  bio: string;
  phone: string;
  location: string;
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    image: "",
    bio: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      image: user.image || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
    });
  }, [user]);

  if (!user) return null;

  const syncForm = (next: User) => {
    setForm({
      name: next.name || "",
      image: next.image || "",
      bio: next.bio || "",
      phone: next.phone || "",
      location: next.location || "",
    });
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    setFileName(file.name);
    try {
      const url = await uploadToImgBB(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await fetchJSON<{ user: User }>("/api/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          image: form.image,
          bio: form.bio.trim(),
          phone: form.phone.trim(),
          location: form.location.trim(),
        }),
      });
      syncForm(data.user);
      await refreshUser();
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    setEditing(false);
    setError("");
    setFileName("");
    setForm({
      name: user.name || "",
      image: user.image || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
    });
  };

  return (
    <>
      <DashboardHeader
        eyebrow={`${ROLE_LABEL[user.role]} workspace`}
        title="Your profile"
        description="View and update your public details, contact information, and profile photo."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="relative mx-auto h-28 w-28">
            {form.image || user.image ? (
              <img
                src={form.image || user.image || ""}
                alt={user.name}
                className="h-28 w-28 rounded-xl object-cover"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-xl bg-[var(--brand-soft)] text-3xl font-bold text-[var(--brand)]">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            {editing && (
              <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] text-white shadow-md">
                <HiOutlineCamera size={16} />
              </span>
            )}
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-lg font-bold tracking-tight">{user.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
            <div className="mt-3 flex justify-center">
              <Badge tone="blue">{ROLE_LABEL[user.role]}</Badge>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">Credits</dt>
              <dd className="font-semibold">{user.credits.toLocaleString()}</dd>
            </div>
            {user.role === "creator" && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--muted)]">Raised</dt>
                <dd className="font-semibold">{user.raisedCredits.toLocaleString()}</dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">Member since</dt>
              <dd className="font-semibold">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                  : "—"}
              </dd>
            </div>
          </dl>
        </aside>

        <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Account details</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {editing ? "Edit your information and save when ready." : "Your current profile information."}
              </p>
            </div>
            {!editing ? (
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                <HiOutlinePencilSquare size={16} /> Edit profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={cancel} disabled={busy || uploading}>
                  Cancel
                </Button>
                <Button size="sm" form="profile-form" disabled={busy || uploading}>
                  {busy ? "Saving…" : <><HiOutlineCheck size={16} /> Save changes</>}
                </Button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <InfoRow icon={HiOutlineUser} label="Full name" value={user.name} />
              <InfoRow icon={HiOutlineEnvelope} label="Email" value={user.email} />
              <InfoRow icon={HiOutlinePhone} label="Phone" value={user.phone || "Not set"} />
              <InfoRow icon={HiOutlineMapPin} label="Location" value={user.location || "Not set"} />
              <div className="sm:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Bio</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  {user.bio?.trim() || "No bio added yet. Click Edit profile to introduce yourself."}
                </p>
              </div>
            </div>
          ) : (
            <form id="profile-form" onSubmit={save} className="mt-8 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Full name</span>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  minLength={2}
                />
              </label>
              <label>
                <span className="field-label">Email</span>
                <Input value={user.email} disabled />
              </label>
              <label>
                <span className="field-label">Phone</span>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </label>
              <label>
                <span className="field-label">Location</span>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Bio</span>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-[var(--border)] bg-white p-3 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
                  maxLength={500}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="A short introduction about you…"
                />
                <p className="mt-1 text-right text-xs text-[var(--muted-soft)]">{form.bio.length}/500</p>
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Profile image</span>
                <div className="relative flex h-11 items-center gap-3 rounded-lg border border-[var(--border)] bg-white px-3 shadow-sm transition hover:border-[var(--border-strong)] focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[var(--brand-soft)]">
                  <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-[var(--bg)] px-3 text-xs font-semibold text-[var(--ink-soft)]">
                    <HiOutlinePhoto size={15} className="text-[var(--brand)]" />
                    {uploading ? "Uploading…" : "Choose file"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-[var(--muted)]">
                    {fileName || (form.image ? "Current image kept" : "No file chosen")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={uploading || busy}
                    onChange={(e) => void uploadImage(e.target.files?.[0])}
                  />
                </div>
              </label>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          {message && (
            <p className="mt-5 rounded-lg bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)]">
              {message}
            </p>
          )}
        </section>
      </div>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
      <Icon size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-[var(--ink)]">{value}</p>
      </div>
    </div>
  );
}
