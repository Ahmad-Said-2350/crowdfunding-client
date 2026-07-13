"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export default function CampaignDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, refreshUser } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchJSON<{ campaign: Campaign }>(`/api/campaigns/${id}`)
      .then((r) => setCampaign(r.campaign))
      .catch((e) => setError(e instanceof Error ? e.message : "Campaign unavailable."));
  }, [id]);

  const contribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      await fetchJSON("/api/contributions", {
        method: "POST",
        body: JSON.stringify({ campaign_id: id, contribution_amount: Number(amount), message: note }),
      });
      setMessage("Contribution submitted for creator review.");
      setAmount("");
      setNote("");
      await refreshUser();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Contribution failed.");
    } finally {
      setBusy(false);
    }
  };

  const report = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetchJSON("/api/reports", { method: "POST", body: JSON.stringify({ campaign_id: id, reason }) });
      setReportOpen(false);
      setReason("");
      setMessage("Report submitted to Pledgekit administrators.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Report failed.");
    } finally {
      setBusy(false);
    }
  };

  if (error) return <BasicLayout><div className="container-pk py-24 text-sm">{error}</div></BasicLayout>;
  if (!campaign) return <BasicLayout><div className="container-pk py-24 text-sm text-[var(--muted)]">Loading campaign…</div></BasicLayout>;

  const progress = Math.min(100, Math.round((campaign.amount_raised / Math.max(campaign.funding_goal, 1)) * 100));

  return (
    <BasicLayout>
      <main className="container-pk grid gap-8 py-12 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="overflow-hidden rounded-[20px] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <img src={campaign.campaign_image_url} alt={campaign.campaign_title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="mt-8">
            <Badge tone="blue">{campaign.category}</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{campaign.campaign_title}</h1>
            <p className="mt-4 text-sm text-[var(--muted)]">Created by <b className="text-[var(--ink)]">{campaign.creator_name}</b></p>
            <h2 className="mt-10 text-lg font-bold">Campaign story</h2>
            <p className="mt-3 whitespace-pre-line leading-8 text-[var(--muted)]">{campaign.campaign_story}</p>
            <h2 className="mt-8 text-lg font-bold">Contributor reward</h2>
            <p className="mt-3 text-[var(--muted)]">{campaign.reward_info}</p>
          </div>
        </div>

        <aside className="h-fit rounded-[20px] border border-[var(--border)] bg-white p-7 shadow-[var(--shadow-md)] lg:sticky lg:top-24">
          <p className="text-3xl font-bold tracking-tight">
            {campaign.amount_raised.toLocaleString()}
            <span className="ml-2 text-sm font-medium text-[var(--muted)]">credits raised</span>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">Goal: {campaign.funding_goal.toLocaleString()} credits</p>
          <div className="pk-progress mt-5"><span style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <span>{progress}% funded</span>
            <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
          </div>

          {user?.role === "supporter" ? (
            <form onSubmit={contribute} className="mt-8 space-y-4">
              <label>
                <span className="field-label">Contribution credits (min {campaign.minimum_contribution})</span>
                <Input type="number" min={campaign.minimum_contribution} value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </label>
              <label>
                <span className="field-label">Message (optional)</span>
                <textarea
                  className="min-h-24 w-full rounded-[12px] border border-[var(--border)] bg-white p-3 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <Button className="w-full" disabled={busy}>{busy ? "Submitting…" : "Contribute credits"}</Button>
            </form>
          ) : (
            <Link href={user ? "/dashboard" : "/login"} className="mt-8 block">
              <Button className="w-full">{user ? "Open dashboard" : "Sign in to contribute"}</Button>
            </Link>
          )}
          {user && <Button variant="ghost" className="mt-3 w-full" onClick={() => setReportOpen(true)}>Report campaign</Button>}
          {message && <p className="mt-4 rounded-[12px] bg-[var(--brand-soft)] px-3 py-2 text-sm text-[var(--brand-deep)]">{message}</p>}
        </aside>
      </main>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report campaign"
        description="Tell administrators why this campaign may be suspicious."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button size="sm" disabled={busy} onClick={() => (document.getElementById("report-form") as HTMLFormElement | null)?.requestSubmit()}>
              {busy ? "Submitting…" : "Submit report"}
            </Button>
          </>
        }
      >
        <form id="report-form" onSubmit={report}>
          <label>
            <span className="field-label">Reason</span>
            <textarea
              className="min-h-36 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg)] p-4 text-sm outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
              minLength={10}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </label>
        </form>
      </Modal>
    </BasicLayout>
  );
}
