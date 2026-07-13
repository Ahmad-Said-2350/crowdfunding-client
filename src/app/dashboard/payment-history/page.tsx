"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmModal } from "@/components/ui/Modal";
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

function PaymentHistoryContent() {
  const { user, refreshUser } = useAuth();
  const params = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [message, setMessage] = useState("");
  const [cancelTarget, setCancelTarget] = useState<{ type: "payment" | "withdrawal"; id: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
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
  };

  useEffect(() => {
    load();
  }, [user]);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId || !user) return;
    fetchJSON("/api/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
      .then(async () => {
        setMessage("Payment confirmed. Credits added.");
        await refreshUser();
        load();
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, user]);

  const applyCancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    setMessage("");
    try {
      if (cancelTarget.type === "payment") {
        await fetchJSON(`/api/payments/${cancelTarget.id}/cancel`, { method: "PATCH" });
        setMessage("Payment canceled.");
      } else {
        await fetchJSON(`/api/withdrawals/${cancelTarget.id}/cancel`, { method: "PATCH" });
        setMessage("Withdrawal canceled.");
      }
      setCancelTarget(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Cancel failed.");
    } finally {
      setBusy(false);
    }
  };

  const isCreator = user?.role === "creator";
  const tone = (status: string) =>
    status === "completed" || status === "approved"
      ? "success"
      : status === "pending"
        ? "warning"
        : "danger";

  return (
    <>
      <DashboardHeader
        eyebrow="Billing"
        title="Payment history"
        description={
          isCreator
            ? "Track withdrawal requests. Cancel pending payouts before admin approval."
            : "Track credit purchases. Cancel pending checkouts before they complete."
        }
      />
      {message && <p className="mb-4 text-sm text-[var(--brand-deep)]">{message}</p>}

      {isCreator ? (
        withdrawals.length ? (
          <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Credits</th>
                  <th>Amount ($)</th>
                  <th>System</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id}>
                    <td>{new Date(w.withdraw_date).toLocaleString()}</td>
                    <td>{w.withdrawal_credit}</td>
                    <td>{w.withdrawal_amount}</td>
                    <td>{w.payment_system}</td>
                    <td><Badge tone={tone(w.status)}>{w.status}</Badge></td>
                    <td>
                      {w.status === "pending" ? (
                        <Button size="sm" variant="ghost" onClick={() => setCancelTarget({ type: "withdrawal", id: w._id })}>
                          Cancel
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState description="No withdrawal payments yet." />
        )
      ) : payments.length ? (
        <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Package</th>
                <th>Credits</th>
                <th>Amount ($)</th>
                <th>System</th>
                <th>Status</th>
                <th>Action</th>
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
                  <td><Badge tone={tone(p.status)}>{p.status}</Badge></td>
                  <td>
                    {p.status === "pending" ? (
                      <Button size="sm" variant="ghost" onClick={() => setCancelTarget({ type: "payment", id: p._id })}>
                        Cancel
                      </Button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No payments recorded yet." />
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={applyCancel}
        title={cancelTarget?.type === "withdrawal" ? "Cancel withdrawal" : "Cancel payment"}
        description="This only works while the request is still pending."
        confirmLabel="Cancel request"
        tone="danger"
        busy={busy}
      />
    </>
  );
}

export default function PaymentHistoryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading payments…</p>}>
      <PaymentHistoryContent />
    </Suspense>
  );
}
