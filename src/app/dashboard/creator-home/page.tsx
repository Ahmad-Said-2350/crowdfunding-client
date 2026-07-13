"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import type { Contribution } from "@/lib/types";

export default function CreatorHome() {
  const [data, setData] = useState<{
    stats: { totalCampaigns: number; activeCampaigns: number; totalRaised: number };
    pendingContributions: Contribution[];
  }>();
  const [selected, setSelected] = useState<Contribution | null>(null);
  const [decision, setDecision] = useState<{ id: string; status: "approved" | "rejected" } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchJSON<NonNullable<typeof data>>("/api/creator/home")
      .then(setData)
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const apply = async () => {
    if (!decision) return;
    setBusy(true);
    try {
      await fetchJSON(`/api/contributions/${decision.id}/status`, {
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
        eyebrow="Creator workspace"
        title="Campaign performance"
        description="Review incoming support and keep campaign momentum visible."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total campaigns" value={data?.stats.totalCampaigns ?? "—"} />
        <StatCard label="Active campaigns" value={data?.stats.activeCampaigns ?? "—"} />
        <StatCard label="Credits raised" value={data?.stats.totalRaised ?? "—"} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/dashboard/add-campaign"><Button size="sm">New campaign</Button></a>
        <a href="/dashboard/my-campaigns"><Button size="sm" variant="secondary">My campaigns</Button></a>
        <a href="/dashboard/withdrawals"><Button size="sm" variant="soft">Request withdrawal</Button></a>
      </div>
      <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight">Pending contributions</h2>
      {data?.pendingContributions.length ? (
        <div className="overflow-auto border border-[var(--border)]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supporter</th>
                <th>Campaign</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.pendingContributions.map((c) => (
                <tr key={c._id}>
                  <td>{c.supporter_name}</td>
                  <td>{c.campaign_title}</td>
                  <td>{c.contribution_amount}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="soft" onClick={() => setSelected(c)}>View</Button>
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
        <EmptyState description="New supporter contributions will arrive here for review." />
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Contribution details"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>
            <Button size="sm" variant="danger" onClick={() => selected && setDecision({ id: selected._id, status: "rejected" })}>Reject</Button>
            <Button size="sm" onClick={() => selected && setDecision({ id: selected._id, status: "approved" })}>Approve</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <p><b>Supporter:</b> {selected.supporter_name} ({selected.supporter_email})</p>
            <p><b>Campaign:</b> {selected.campaign_title}</p>
            <p><b>Amount:</b> {selected.contribution_amount} credits</p>
            <p><b>Date:</b> {new Date(selected.current_date).toLocaleString()}</p>
            <p><b>Message:</b> {selected.message || "No message provided."}</p>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={apply}
        title={decision?.status === "approved" ? "Approve contribution" : "Reject contribution"}
        description={
          decision?.status === "approved"
            ? "Add these credits to the campaign raised total?"
            : "Reject and refund credits to the supporter?"
        }
        confirmLabel={decision?.status === "approved" ? "Approve" : "Reject & refund"}
        tone={decision?.status === "approved" ? "primary" : "danger"}
        busy={busy}
      />
    </>
  );
}
