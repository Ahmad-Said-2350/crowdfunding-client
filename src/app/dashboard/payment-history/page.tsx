"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { fetchJSON } from "@/lib/api";

type Payment = {
  _id: string;
  package_label?: string;
  credits?: number;
  amount: number;
  payment_system: string;
  status: string;
  createdAt?: string;
};

type Withdrawal = {
  _id: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  status: string;
  withdraw_date: string;
};

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "supporter" || user.role === "admin") {
      fetchJSON<{ payments: Payment[] }>("/api/supporter/payment-history")
        .then((r) => setPayments(r.payments))
        .catch(() => undefined);
    }
    if (user.role === "creator" || user.role === "admin") {
      fetchJSON<{ withdrawals: Withdrawal[] }>("/api/creator/payment-history")
        .then((r) => setWithdrawals(r.withdrawals))
        .catch(() => undefined);
    }
  }, [user]);

  const isCreator = user?.role === "creator";

  return (
    <>
      <DashboardHeader
        eyebrow="Billing"
        title="Payment history"
        description={isCreator ? "Track withdrawal requests and their processing status." : "Track credit purchases and payment outcomes."}
      />
      {isCreator ? (
        withdrawals.length ? (
          <div className="overflow-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Credits</th>
                  <th>Amount ($)</th>
                  <th>System</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id}>
                    <td>{new Date(w.withdraw_date).toLocaleString()}</td>
                    <td>{w.withdrawal_credit}</td>
                    <td>{w.withdrawal_amount}</td>
                    <td>{w.payment_system}</td>
                    <td><Badge tone={w.status === "approved" ? "success" : "warning"}>{w.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState description="No withdrawal payments yet." />
        )
      ) : payments.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Package</th>
                <th>Credits</th>
                <th>Amount ($)</th>
                <th>System</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</td>
                  <td>{p.package_label || "—"}</td>
                  <td>{p.credits ?? "—"}</td>
                  <td>{p.amount}</td>
                  <td>{p.payment_system}</td>
                  <td><Badge tone={p.status === "completed" ? "success" : "warning"}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No payments recorded yet." />
      )}
    </>
  );
}
