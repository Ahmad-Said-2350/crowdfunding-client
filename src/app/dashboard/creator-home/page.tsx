"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import type { Contribution } from "@/lib/types";

export default function CreatorHome() {
  const [data, setData] = useState<{
    stats: { totalCampaigns: number; activeCampaigns: number; totalRaised: number };
    pendingContributions: Contribution[];
  }>();
  const [selected, setSelected] = useState<Contribution | null>(null);

  const load = () =>
    fetchJSON<NonNullable<typeof data>>("/api/creator/home")
      .then(setData)
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const decide = async (id: string, status: "approved" | "rejected") => {
    await fetchJSON(`/api/contributions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setSelected(null);
    load();
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Creator overview"
        title="Campaign performance"
        description="Review incoming support and monitor campaign momentum."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total campaigns" value={data?.stats.totalCampaigns ?? "—"} />
        <StatCard label="Active campaigns" value={data?.stats.activeCampaigns ?? "—"} />
        <StatCard label="Credits raised" value={data?.stats.totalRaised ?? "—"} />
      </div>
      <h2 className="mb-4 mt-10 text-xl font-semibold">Pending contributions</h2>
      {data?.pendingContributions.length ? (
        <div className="overflow-auto">
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
                  <td className="flex flex-wrap gap-2">
                    <Button className="h-9 px-3" variant="secondary" onClick={() => setSelected(c)}>View contribution</Button>
                    <Button className="h-9 px-3" onClick={() => void decide(c._id, "approved")}>Approve</Button>
                    <Button className="h-9 px-3" variant="ghost" onClick={() => void decide(c._id, "rejected")}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="New supporter contributions will arrive here for review." />
      )}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Contribution details">
        {selected && (
          <div className="space-y-3 text-sm">
            <p><b>Supporter:</b> {selected.supporter_name} ({selected.supporter_email})</p>
            <p><b>Campaign:</b> {selected.campaign_title}</p>
            <p><b>Amount:</b> {selected.contribution_amount} credits</p>
            <p><b>Date:</b> {new Date(selected.current_date).toLocaleString()}</p>
            <p><b>Message:</b> {selected.message || "No message provided."}</p>
            <div className="flex gap-2 pt-3">
              <Button onClick={() => void decide(selected._id, "approved")}>Approve</Button>
              <Button variant="secondary" onClick={() => void decide(selected._id, "rejected")}>Reject</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
