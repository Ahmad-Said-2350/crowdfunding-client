"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmModal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { fetchJSON } from "@/lib/api";

type Payment = {
  _id: string;
  user_email: string;
  user_name: string;
  package_label?: string;
  credits: number;
  amount: number;
  payment_system: string;
  status: string;
  createdAt?: string;
};

export default function ManagePaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<{ id: string; status: "completed" | "canceled" | "failed" } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchJSON<{ payments: Payment[] }>("/api/admin/payments")
      .then((r) => setPayments(r.payments))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    return payments.filter((p) => {
      const okStatus = filter === "all" || p.status === filter;
      const hay = `${p.user_name} ${p.user_email} ${p.package_label || ""}`.toLowerCase();
      return okStatus && (!q.trim() || hay.includes(q.trim().toLowerCase()));
    });
  }, [payments, filter, q]);

  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.status === "completed");
    return {
      total: payments.length,
      completed: completed.length,
      pending: payments.filter((p) => p.status === "pending").length,
      volume: completed.reduce((sum, p) => sum + (p.amount || 0), 0),
    };
  }, [payments]);

  const apply = async () => {
    if (!action) return;
    setBusy(true);
    setMessage("");
    try {
      await fetchJSON(`/api/admin/payments/${action.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: action.status }),
      });
      setMessage(`Payment marked ${action.status}.`);
      setAction(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const tone = (status: string) =>
    status === "completed" ? "success" : status === "pending" ? "warning" : "danger";

  return (
    <>
      <DashboardHeader
        eyebrow="Finance control"
        title="Manage payments"
        description="Oversee credit purchases platform-wide. Confirm, cancel, or reverse payments when needed."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="All payments" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Completed volume ($)" value={stats.volume.toLocaleString()} />
      </div>

      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
        <label className="min-w-[200px] flex-1">
          <span className="field-label">Search</span>
          <Input placeholder="User, email, package…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="w-full sm:w-48">
          <span className="field-label">Status</span>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="failed">Failed</option>
          </Select>
        </label>
      </div>

      {message && <p className="mb-4 text-sm text-[var(--brand-deep)]">{message}</p>}

      {visible.length ? (
        <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Package</th>
                <th>Credits</th>
                <th>Amount</th>
                <th>System</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p._id}>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</td>
                  <td>
                    <div className="font-medium">{p.user_name}</div>
                    <div className="text-xs text-[var(--muted)]">{p.user_email}</div>
                  </td>
                  <td>{p.package_label || "—"}</td>
                  <td>{p.credits}</td>
                  <td>${p.amount}</td>
                  <td>{p.payment_system}</td>
                  <td><Badge tone={tone(p.status)}>{p.status}</Badge></td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {p.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => setAction({ id: p._id, status: "completed" })}>Confirm</Button>
                          <Button size="sm" variant="danger" onClick={() => setAction({ id: p._id, status: "canceled" })}>Cancel</Button>
                        </>
                      )}
                      {p.status === "completed" && (
                        <Button size="sm" variant="secondary" onClick={() => setAction({ id: p._id, status: "canceled" })}>Reverse</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No payments match this filter." />
      )}

      <ConfirmModal
        open={Boolean(action)}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title={`Mark payment ${action?.status}`}
        description={
          action?.status === "completed"
            ? "Confirm this payment and add credits to the user?"
            : action?.status === "canceled"
              ? "Cancel or reverse this payment? Completed payments will claw back credits."
              : "Mark this payment as failed?"
        }
        confirmLabel="Confirm"
        tone={action?.status === "completed" ? "primary" : "danger"}
        busy={busy}
      />
    </>
  );
}
