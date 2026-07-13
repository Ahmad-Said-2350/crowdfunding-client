"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmModal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";

type Withdrawal = {
  _id: string;
  creator_name: string;
  creator_email: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string;
  withdraw_date: string;
};

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<{ id: string; type: "approve" | "reject" } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchJSON<{ withdrawals: Withdrawal[] }>("/api/admin/withdrawals")
      .then((r) => setWithdrawals(r.withdrawals))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const apply = async () => {
    if (!action) return;
    setBusy(true);
    setMessage("");
    try {
      if (action.type === "approve") {
        await fetchJSON(`/api/admin/withdrawals/${action.id}/approve`, { method: "PATCH" });
        setMessage("Marked as payment success.");
      } else {
        await fetchJSON(`/api/admin/withdrawals/${action.id}/reject`, { method: "PATCH" });
        setMessage("Withdrawal rejected.");
      }
      setAction(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Finance operations"
        title="Withdrawal requests"
        description="Approve or reject creator payouts. Approval reduces the creator's raised credits."
      />
      {message && <p className="mb-4 text-sm text-[var(--brand-deep)]">{message}</p>}
      {withdrawals.length ? (
        <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Amount ($)</th>
                <th>System</th>
                <th>Account</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id}>
                  <td className="font-medium">{w.creator_name}</td>
                  <td>{w.creator_email}</td>
                  <td>{w.withdrawal_credit}</td>
                  <td>{w.withdrawal_amount}</td>
                  <td>{w.payment_system}</td>
                  <td>{w.account_number}</td>
                  <td>{new Date(w.withdraw_date).toLocaleString()}</td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" onClick={() => setAction({ id: w._id, type: "approve" })}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => setAction({ id: w._id, type: "reject" })}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No pending withdrawal requests." />
      )}

      <ConfirmModal
        open={Boolean(action)}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title={action?.type === "approve" ? "Approve withdrawal" : "Reject withdrawal"}
        description={
          action?.type === "approve"
            ? "Confirm payout and deduct raised credits from the creator?"
            : "Reject this withdrawal request and notify the creator?"
        }
        confirmLabel={action?.type === "approve" ? "Approve" : "Reject"}
        tone={action?.type === "approve" ? "primary" : "danger"}
        busy={busy}
      />
    </>
  );
}
