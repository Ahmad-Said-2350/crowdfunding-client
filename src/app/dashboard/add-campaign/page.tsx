"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { fetchJSON, uploadToImgBB } from "@/lib/api";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment", "Social Impact"];

export default function AddCampaignPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });

  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      set("campaign_image_url", await uploadToImgBB(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await fetchJSON("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          funding_goal: Number(form.funding_goal),
          minimum_contribution: Number(form.minimum_contribution),
        }),
      });
      router.push("/dashboard/my-campaigns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create campaign.");
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Creator tools"
        title="Add new campaign"
        description="Submit a campaign for admin review. It becomes visible to supporters only after approval."
      />
      <form onSubmit={submit} className="grid max-w-3xl gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="field-label">Campaign title</span>
          <Input value={form.campaign_title} onChange={(e) => set("campaign_title", e.target.value)} required minLength={5} placeholder="Help us build a solar-powered water pump" />
        </label>
        <label className="sm:col-span-2">
          <span className="field-label">Campaign story</span>
          <textarea
            className="min-h-40 w-full border-b-2 border-[var(--border)] bg-white p-3 outline-none focus:border-[var(--ibm-blue)]"
            value={form.campaign_story}
            onChange={(e) => set("campaign_story", e.target.value)}
            required
            minLength={20}
          />
        </label>
        <label>
          <span className="field-label">Category</span>
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </label>
        <label>
          <span className="field-label">Deadline</span>
          <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} required />
        </label>
        <label>
          <span className="field-label">Funding goal (credits)</span>
          <Input type="number" min={1} value={form.funding_goal} onChange={(e) => set("funding_goal", e.target.value)} required />
        </label>
        <label>
          <span className="field-label">Minimum contribution</span>
          <Input type="number" min={1} value={form.minimum_contribution} onChange={(e) => set("minimum_contribution", e.target.value)} required />
        </label>
        <label className="sm:col-span-2">
          <span className="field-label">Reward info</span>
          <Input value={form.reward_info} onChange={(e) => set("reward_info", e.target.value)} required minLength={5} />
        </label>
        <label className="sm:col-span-2">
          <span className="field-label">Campaign image URL</span>
          <Input type="url" value={form.campaign_image_url} onChange={(e) => set("campaign_image_url", e.target.value)} required placeholder="https://" />
        </label>
        <label className="sm:col-span-2">
          <span className="field-label">Or upload cover image (imgBB)</span>
          <Input type="file" accept="image/*" onChange={(e) => void upload(e.target.files?.[0])} />
        </label>
        {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
        <Button className="sm:col-span-2" disabled={busy}>{busy ? "Submitting…" : "Add campaign"}</Button>
      </form>
    </>
  );
}
