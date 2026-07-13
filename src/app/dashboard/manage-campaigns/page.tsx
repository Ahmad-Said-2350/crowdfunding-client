"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [message, setMessage] = useState("");

  const load = () =>
    fetchJSON<{ campaigns: Campaign[] }>("/api/admin/campaigns")
      .then((r) => setCampaigns(r.campaigns))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign from the platform?")) return;
    try {
      await fetchJSON(`/api/admin/campaigns/${id}`, { method: "DELETE" });
      setMessage("Campaign deleted.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Campaign catalog"
        title="Manage campaigns"
        description="Review every campaign on the platform and remove listings that violate policy."
      />
      {message && <p className="mb-4 text-sm">{message}</p>}
      {campaigns.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Category</th>
                <th>Raised / Goal</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id}>
                  <td>{c.campaign_title}</td>
                  <td>{c.creator_name}</td>
                  <td>{c.category}</td>
                  <td>{c.amount_raised} / {c.funding_goal}</td>
                  <td><Badge tone={c.status === "approved" ? "success" : c.status === "pending" ? "warning" : "danger"}>{c.status}</Badge></td>
                  <td>
                    <Button className="h-9 px-3" variant="ghost" onClick={() => void remove(c._id)}>Delete campaign</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No campaigns in the catalog." />
      )}
    </>
  );
}
