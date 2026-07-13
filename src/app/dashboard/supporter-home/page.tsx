"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import type { Contribution } from "@/lib/types";

export default function SupporterHome() {
  const [data, setData] = useState<{
    stats: { totalContributions: number; pendingContributions: number; totalAmount: number };
    approvedContributions: Contribution[];
  }>();

  useEffect(() => {
    fetchJSON<NonNullable<typeof data>>("/api/supporter/home")
      .then(setData)
      .catch(() => undefined);
  }, []);

  return (
    <>
      <DashboardHeader
        eyebrow="Supporter overview"
        title="Your funding activity"
        description="Monitor contributions and the campaigns you have helped move forward."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total contributions" value={data?.stats.totalContributions ?? "—"} />
        <StatCard label="Pending review" value={data?.stats.pendingContributions ?? "—"} />
        <StatCard label="Approved credits" value={data?.stats.totalAmount ?? "—"} />
      </div>
      <h2 className="mb-4 mt-10 text-xl font-semibold">Approved contributions</h2>
      {data?.approvedContributions.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Credits</th>
                <th>Creator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.approvedContributions.map((c) => (
                <tr key={c._id}>
                  <td>{c.campaign_title}</td>
                  <td>{c.contribution_amount}</td>
                  <td>{c.creator_name}</td>
                  <td><Badge tone="success">{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="Approved contributions will appear here after creators review them." />
      )}
    </>
  );
}
