"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState({ campaign_title: "", campaign_story: "", reward_info: "" });
  const [message, setMessage] = useState("");

  const load = () =>
    fetchJSON<{ campaigns: Campaign[] }>("/api/creator/campaigns")
      .then((r) => setCampaigns(r.campaigns))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const openEdit = (campaign: Campaign) => {
    setEditing(campaign);
    setForm({
      campaign_title: campaign.campaign_title,
      campaign_story: campaign.campaign_story,
      reward_info: campaign.reward_info,
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await fetchJSON(`/api/campaigns/${editing._id}`, { method: "PATCH", body: JSON.stringify(form) });
      setEditing(null);
      setMessage("Campaign updated.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await fetchJSON(`/api/campaigns/${id}`, { method: "DELETE" });
      setMessage("Campaign deleted and refunds issued where needed.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Creator campaigns"
        title="My campaigns"
        description="Campaigns sorted by deadline. Update story details or remove a listing when needed."
      />
      {message && <p className="mb-4 text-sm">{message}</p>}
      {campaigns.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Raised</th>
                <th>Goal</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id}>
                  <td>{c.campaign_title}</td>
                  <td><Badge tone={c.status === "approved" ? "success" : c.status === "pending" ? "warning" : "danger"}>{c.status}</Badge></td>
                  <td>{c.amount_raised}</td>
                  <td>{c.funding_goal}</td>
                  <td>{new Date(c.deadline).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <Button className="h-9 px-3" variant="secondary" onClick={() => openEdit(c)}>Update</Button>
                    <Button className="h-9 px-3" variant="ghost" onClick={() => void remove(c._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="You have not launched a campaign yet." />
      )}
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Update campaign">
        <form onSubmit={save} className="space-y-4">
          <label>
            <span className="field-label">Title</span>
            <Input value={form.campaign_title} onChange={(e) => setForm({ ...form, campaign_title: e.target.value })} required minLength={5} />
          </label>
          <label>
            <span className="field-label">Story</span>
            <textarea
              className="min-h-32 w-full border-b-2 bg-[var(--surface)] p-3 outline-none focus:border-[var(--ibm-blue)]"
              value={form.campaign_story}
              onChange={(e) => setForm({ ...form, campaign_story: e.target.value })}
              required
              minLength={20}
            />
          </label>
          <label>
            <span className="field-label">Reward info</span>
            <Input value={form.reward_info} onChange={(e) => setForm({ ...form, reward_info: e.target.value })} required minLength={5} />
          </label>
          <Button>Save changes</Button>
        </form>
      </Modal>
    </>
  );
}
