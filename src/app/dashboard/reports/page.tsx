"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";

type Report = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  reporter_name: string;
  reason: string;
  date: string;
  status: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string>("");

  const load = useCallback(async () => {
    try {
      const r = await fetchJSON<{ reports: Report[] }>("/api/admin/reports");
      setReports(
        (r.reports || []).map((item) => ({
          ...item,
          _id: String(item._id),
        }))
      );
    } catch {
      setError("Unable to load reports.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, action: "suspend" | "delete" | "resolve") => {
    setMessage("");
    setError("");
    setBusyId(`${id}:${action}`);
    try {
      const result = await fetchJSON<{ message?: string }>(`/api/admin/reports/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setMessage(result.message || `Report ${action} completed.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Trust & safety"
        title="Reports"
        description="Review campaigns flagged as suspicious or fraudulent and take corrective action."
      />
      {message && (
        <p className="mb-4 rounded-lg bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)]">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      {reports.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Campaign</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const open = r.status === "open";
                const working = busyId.startsWith(`${r._id}:`);
                return (
                  <tr key={r._id}>
                    <td>{r.reporter_name}</td>
                    <td>{r.campaign_title}</td>
                    <td className="max-w-xs">{r.reason}</td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                    <td>
                      <Badge
                        tone={
                          r.status === "open" ? "warning" : r.status === "suspended" ? "danger" : "success"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td>
                      {open ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            className="h-9 px-3"
                            variant="secondary"
                            disabled={working}
                            onClick={() => void act(r._id, "suspend")}
                          >
                            {busyId === `${r._id}:suspend` ? "…" : "Suspend"}
                          </Button>
                          <Button
                            className="h-9 px-3"
                            variant="ghost"
                            disabled={working}
                            onClick={() => void act(r._id, "delete")}
                          >
                            {busyId === `${r._id}:delete` ? "…" : "Delete"}
                          </Button>
                          <Button
                            className="h-9 px-3"
                            disabled={working}
                            onClick={() => void act(r._id, "resolve")}
                          >
                            {busyId === `${r._id}:resolve` ? "…" : "Resolve"}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No campaign reports at this time." />
      )}
    </>
  );
}
