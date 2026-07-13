"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
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

  const load = () =>
    fetchJSON<{ withdrawals: Withdrawal[] }>("/api/admin/withdrawals")
      .then((r) => setWithdrawals(r.withdrawals))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await fetchJSON(`/api/admin/withdrawals/${id}/approve`, { method: "PATCH" });
      setMessage("Marked as payment success.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Approval failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Finance operations"
        title="Withdrawal requests"
        description="Approve pending creator withdrawals. Approval reduces the creator's raised credits."
      />
      {message && <p className="mb-4 text-sm">{message}</p>}
      {withdrawals.length ? (
        <div className="overflow-auto">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id}>
                  <td>{w.creator_name}</td>
                  <td>{w.creator_email}</td>
                  <td>{w.withdrawal_credit}</td>
                  <td>{w.withdrawal_amount}</td>
                  <td>{w.payment_system}</td>
                  <td>{w.account_number}</td>
                  <td>{new Date(w.withdraw_date).toLocaleString()}</td>
                  <td>
                    <Button className="h-9 px-3" onClick={() => void approve(w._id)}>Payment success</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No pending withdrawal requests." />
      )}
    </>
  );
}
