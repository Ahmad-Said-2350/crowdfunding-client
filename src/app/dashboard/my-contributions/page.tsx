"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmModal } from "@/components/ui/Modal";
import { fetchJSON } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Contribution } from "@/lib/types";

export default function MyContributions() {
  const { refreshUser } = useAuth();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{
    contributions: Contribution[];
    pagination: { page: number; pages: number; total: number };
  }>();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = () =>
    fetchJSON<NonNullable<typeof data>>(`/api/supporter/contributions?page=${page}&limit=8`)
      .then(setData)
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, [page]);

  const cancel = async () => {
    if (!cancelId) return;
    setBusy(true);
    setMessage("");
    try {
      await fetchJSON(`/api/contributions/${cancelId}/cancel`, { method: "PATCH" });
      setMessage("Contribution canceled. Credits refunded.");
      setCancelId(null);
      await refreshUser();
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Cancel failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Contribution ledger"
        title="My contributions"
        description="Review every pledge. Cancel pending contributions before a creator approves them."
      />
      {message && <p className="mb-4 text-sm text-[var(--brand-deep)]">{message}</p>}
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/dashboard/explore-campaigns"><Button size="sm" variant="soft">Explore campaigns</Button></Link>
        <Link href="/dashboard/purchase-credit"><Button size="sm" variant="secondary">Buy credits</Button></Link>
      </div>
      {data?.contributions.length ? (
        <>
          <div className="overflow-auto rounded-xl border border-[var(--border)] bg-white">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Creator</th>
                  <th>Credits</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.contributions.map((c) => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.campaign_title}</td>
                    <td>{c.creator_name}</td>
                    <td>{c.contribution_amount}</td>
                    <td>{new Date(c.current_date).toLocaleDateString()}</td>
                    <td>
                      <Badge tone={c.status === "approved" ? "success" : c.status === "rejected" || c.status === "canceled" ? "danger" : "warning"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td>
                      {c.status === "pending" ? (
                        <Button size="sm" variant="ghost" onClick={() => setCancelId(c._id)}>Cancel</Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="secondary" disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState description="Your contribution history will appear here." />
      )}

      <ConfirmModal
        open={Boolean(cancelId)}
        onClose={() => setCancelId(null)}
        onConfirm={cancel}
        title="Cancel contribution"
        description="Credits will be refunded to your balance immediately."
        confirmLabel="Cancel contribution"
        tone="danger"
        busy={busy}
      />
    </>
  );
}
