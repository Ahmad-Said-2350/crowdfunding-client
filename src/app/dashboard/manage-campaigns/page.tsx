"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

type Status = Campaign["status"] | string;

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "",
    funding_goal: 0,
    minimum_contribution: 0,
    reward_info: "",
    deadline: "",
    status: "pending",
  });
  const [confirm, setConfirm] = useState<{ id: string; action: "delete" | Status } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchJSON<{ campaigns: Campaign[] }>("/api/admin/campaigns")
      .then((r) => setCampaigns(r.campaigns))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    return campaigns.filter((c) => {
      const okStatus = filter === "all" || c.status === filter;
      const hay = `${c.campaign_title} ${c.creator_name} ${c.category}`.toLowerCase();
      const okQ = !q.trim() || hay.includes(q.trim().toLowerCase());
      return okStatus && okQ;
    });
  }, [campaigns, filter, q]);

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm({
      campaign_title: c.campaign_title,
      campaign_story: c.campaign_story,
      category: c.category,
      funding_goal: c.funding_goal,
      minimum_contribution: c.minimum_contribution,
      reward_info: c.reward_info,
      deadline: c.deadline ? new Date(c.deadline).toISOString().slice(0, 10) : "",
      status: c.status,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    setMessage("");
    try {
      await fetchJSON(`/api/admin/campaigns/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          funding_goal: Number(form.funding_goal),
          minimum_contribution: Number(form.minimum_contribution),
          deadline: new Date(form.deadline).toISOString(),
        }),
      });
      setMessage("Campaign updated.");
      setEditing(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const applyConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    setMessage("");
    try {
      if (confirm.action === "delete") {
        await fetchJSON(`/api/admin/campaigns/${confirm.id}`, { method: "DELETE" });
        setMessage("Campaign deleted.");
      } else {
        await fetchJSON(`/api/admin/campaigns/${confirm.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: confirm.action }),
        });
        setMessage(`Campaign marked ${confirm.action}.`);
      }
      setConfirm(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  const tone = (status: string) =>
    status === "approved" ? "success" : status === "pending" ? "warning" : "danger";

  return (
    <>
      <DashboardHeader
        eyebrow="Campaign catalog"
        title="Manage campaigns"
        description="Approve pending listings, edit details, suspend violations, or remove campaigns."
      />

      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
        <label className="min-w-[200px] flex-1">
          <span className="field-label">Search</span>
          <Input placeholder="Title, creator, category…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="w-full sm:w-48">
          <span className="field-label">Status</span>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </Select>
        </label>
      </div>

      {message && <p className="mb-4 text-sm text-[var(--brand-deep)]">{message}</p>}

      {visible.length ? (
        <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Category</th>
                <th>Raised / Goal</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c._id}>
                  <td className="font-medium">{c.campaign_title}</td>
                  <td>{c.creator_name}</td>
                  <td>{c.category}</td>
                  <td>{c.amount_raised} / {c.funding_goal}</td>
                  <td><Badge tone={tone(c.status)}>{c.status}</Badge></td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="soft" onClick={() => openEdit(c)}>Edit</Button>
                      {c.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => setConfirm({ id: c._id, action: "approved" })}>Approve</Button>
                          <Button size="sm" variant="danger" onClick={() => setConfirm({ id: c._id, action: "rejected" })}>Reject</Button>
                        </>
                      )}
                      {c.status === "approved" && (
                        <Button size="sm" variant="secondary" onClick={() => setConfirm({ id: c._id, action: "suspended" })}>Suspend</Button>
                      )}
                      {(c.status === "rejected" || c.status === "suspended") && (
                        <Button size="sm" onClick={() => setConfirm({ id: c._id, action: "approved" })}>Approve</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setConfirm({ id: c._id, action: "delete" })}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No campaigns match this filter." />
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit campaign"
        description={editing?.campaign_title}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" disabled={busy} onClick={() => void saveEdit()}>{busy ? "Saving…" : "Save changes"}</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="field-label">Title</span>
            <Input value={form.campaign_title} onChange={(e) => setForm({ ...form, campaign_title: e.target.value })} />
          </label>
          <label>
            <span className="field-label">Category</span>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            <span className="field-label">Status</span>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </Select>
          </label>
          <label>
            <span className="field-label">Funding goal</span>
            <Input type="number" value={form.funding_goal} onChange={(e) => setForm({ ...form, funding_goal: Number(e.target.value) })} />
          </label>
          <label>
            <span className="field-label">Minimum contribution</span>
            <Input type="number" value={form.minimum_contribution} onChange={(e) => setForm({ ...form, minimum_contribution: Number(e.target.value) })} />
          </label>
          <label>
            <span className="field-label">Deadline</span>
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <span className="field-label">Reward info</span>
            <Input value={form.reward_info} onChange={(e) => setForm({ ...form, reward_info: e.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <span className="field-label">Story</span>
            <textarea
              className="min-h-32 w-full rounded-lg border border-[var(--border)] bg-white p-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
              value={form.campaign_story}
              onChange={(e) => setForm({ ...form, campaign_story: e.target.value })}
            />
          </label>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={applyConfirm}
        title={confirm?.action === "delete" ? "Delete campaign" : `Mark campaign ${confirm?.action}`}
        description={
          confirm?.action === "delete"
            ? "This permanently removes the campaign and related pending contributions."
            : `Update this campaign status to "${confirm?.action}"?`
        }
        confirmLabel={confirm?.action === "delete" ? "Delete" : "Confirm"}
        tone={confirm?.action === "delete" || confirm?.action === "rejected" ? "danger" : "primary"}
        busy={busy}
      />
    </>
  );
}
