"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

function ExploreContent() {
  const params = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState("deadline");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const query = new URLSearchParams({ q, category, sort });
      fetchJSON<{ campaigns: Campaign[] }>(`/api/campaigns/explore?${query}`)
        .then((r) => setCampaigns(r.campaigns))
        .catch(() => setCampaigns([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [q, category, sort]);

  return (
    <>
      <header className="bg-[var(--ink)] py-20 text-white">
        <div className="container-fundora">
          <p className="text-blue-300">Explore Fundora</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl">Discover open campaigns built for real outcomes.</h1>
        </div>
      </header>
      <main className="section-space container-fundora">
        <div className="grid gap-4 border-b border-[var(--border)] pb-6 md:grid-cols-[1fr_220px_180px]">
          <Input placeholder="Search title, story, or creator…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {["Technology", "Education", "Healthcare", "Environment", "Community", "Arts", "Social Impact"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="deadline">Deadline</option>
            <option value="raised">Most funded</option>
            <option value="goal">Highest goal</option>
            <option value="newest">Newest</option>
          </Select>
        </div>
        <p className="my-7 text-sm text-[var(--muted)]">
          {loading ? "Finding campaigns…" : `${campaigns.length} open campaign${campaigns.length === 1 ? "" : "s"}`}
        </p>
        {campaigns.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        ) : (
          !loading && <EmptyState title="No matching campaigns" description="Try a different category or broaden your search." />
        )}
      </main>
    </>
  );
}

export default function ExplorePage() {
  return (
    <BasicLayout>
      <Suspense fallback={<div className="container-fundora py-24">Loading explore…</div>}>
        <ExploreContent />
      </Suspense>
    </BasicLayout>
  );
}
