"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

export default function AdminHome() {
  const [data, setData] = useState<{
    stats: {
      totalSupporters: number;
      totalCreators: number;
      totalAvailableCredits: number;
      totalPaymentsProcessed: number;
    };
    pendingCampaigns: Campaign[];
  }>();
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [decision, setDecision] = useState<{ id: string; status: "approved" | "rejected" } | null>(null);
  const [busy, setBusy] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);

  const load = () => {
    fetchJSON<NonNullable<typeof data>>("/api/admin/home").then(setData).catch(() => undefined);
    fetchJSON<{ users: { blocked?: boolean }[] }>("/api/admin/users")
      .then((r) => setBlockedCount(r.users.filter((u) => u.blocked).length))
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, []);

  const applyDecision = async () => {
    if (!decision) return;
    setBusy(true);
    try {
      await fetchJSON(`/api/admin/campaigns/${decision.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: decision.status }),
      });
      setDecision(null);
      setSelected(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Administration"
        title="Platform operations"
        description="Monitor growth, moderate new campaigns, and keep Pledgekit trustworthy."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard accent="admin" label="Supporters" value={data?.stats.totalSupporters ?? "—"} />
        <StatCard accent="admin" label="Creators" value={data?.stats.totalCreators ?? "—"} />
        <StatCard accent="admin" label="Available credits" value={data?.stats.totalAvailableCredits ?? "—"} />
        <StatCard accent="admin" label="Payments processed" value={data?.stats.totalPaymentsProcessed ?? "—"} />
        <StatCard accent="admin" label="Blocked accounts" value={blockedCount} detail="Managed in Users" />
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight">Campaign approvals</h2>
      {data?.pendingCampaigns.length ? (
        <div className="overflow-auto border border-[var(--border)]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Creator</th>
                <th>Goal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.pendingCampaigns.map((c) => (
                <tr key={c._id}>
                  <td className="font-medium">{c.campaign_title}</td>
                  <td>{c.creator_name}</td>
                  <td>{c.funding_goal}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="tertiary" onClick={() => setSelected(c)}>Review</Button>
                      <Button size="sm" onClick={() => setDecision({ id: c._id, status: "approved" })}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => setDecision({ id: c._id, status: "rejected" })}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No campaigns are waiting for review." />
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Campaign review"
        description={selected?.campaign_title}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>
            <Button size="sm" variant="danger" onClick={() => selected && setDecision({ id: selected._id, status: "rejected" })}>Reject</Button>
            <Button size="sm" onClick={() => selected && setDecision({ id: selected._id, status: "approved" })}>Approve</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm leading-6 text-[var(--muted)]">
            <p><b className="text-[var(--ink)]">Creator:</b> {selected.creator_name} ({selected.creator_email})</p>
            <p><b className="text-[var(--ink)]">Category:</b> {selected.category}</p>
            <p><b className="text-[var(--ink)]">Goal:</b> {selected.funding_goal} credits</p>
            <p><b className="text-[var(--ink)]">Deadline:</b> {new Date(selected.deadline).toLocaleDateString()}</p>
            <p className="whitespace-pre-line">{selected.campaign_story}</p>
            <p><b className="text-[var(--ink)]">Reward:</b> {selected.reward_info}</p>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={applyDecision}
        title={decision?.status === "approved" ? "Approve campaign" : "Reject campaign"}
        description={
          decision?.status === "approved"
            ? "Make this campaign visible to supporters?"
            : "Reject this campaign and notify the creator?"
        }
        confirmLabel={decision?.status === "approved" ? "Approve" : "Reject"}
        tone={decision?.status === "approved" ? "primary" : "danger"}
        busy={busy}
      />
    </>
  );
}
