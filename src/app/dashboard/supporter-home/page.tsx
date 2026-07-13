"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
        eyebrow="Supporter workspace"
        title="Your funding activity"
        description="Track pledges, pending reviews, and approved impact across campaigns you support."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total contributions" value={data?.stats.totalContributions ?? "—"} />
        <StatCard label="Pending review" value={data?.stats.pendingContributions ?? "—"} />
        <StatCard label="Approved credits" value={data?.stats.totalAmount ?? "—"} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/dashboard/explore-campaigns"><Button size="sm">Explore campaigns</Button></a>
        <a href="/dashboard/my-contributions"><Button size="sm" variant="secondary">My contributions</Button></a>
        <a href="/dashboard/purchase-credit"><Button size="sm" variant="soft">Buy credits</Button></a>
      </div>
      <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight">Approved contributions</h2>
      {data?.approvedContributions.length ? (
        <div className="overflow-auto border border-[var(--border)]">
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
                  <td className="font-medium">{c.campaign_title}</td>
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
