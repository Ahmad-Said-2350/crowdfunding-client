"use client";

import { useEffect, useState } from "react";
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

  const load = () =>
    fetchJSON<{ reports: Report[] }>("/api/admin/reports")
      .then((r) => setReports(r.reports))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "suspend" | "delete" | "resolve") => {
    try {
      await fetchJSON(`/api/admin/reports/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setMessage(`Report ${action}d.`);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="Trust & safety"
        title="Reports"
        description="Review campaigns flagged as suspicious or fraudulent and take corrective action."
      />
      {message && <p className="mb-4 text-sm">{message}</p>}
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
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>{r.reporter_name}</td>
                  <td>{r.campaign_title}</td>
                  <td className="max-w-xs">{r.reason}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td><Badge tone={r.status === "open" ? "warning" : "success"}>{r.status}</Badge></td>
                  <td className="flex flex-wrap gap-2">
                    <Button className="h-9 px-3" variant="secondary" onClick={() => void act(r._id, "suspend")}>Suspend</Button>
                    <Button className="h-9 px-3" variant="ghost" onClick={() => void act(r._id, "delete")}>Delete</Button>
                    <Button className="h-9 px-3" onClick={() => void act(r._id, "resolve")}>Resolve</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No campaign reports at this time." />
      )}
    </>
  );
}
