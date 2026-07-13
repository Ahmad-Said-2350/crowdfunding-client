"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import { BRAND, type Campaign } from "@/lib/types";

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
      <header className="bg-[var(--brand-deep)] py-16 text-white">
        <div className="container-pk">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Explore {BRAND.name}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Discover campaigns ready for support.
          </h1>
        </div>
      </header>
      <main className="section-space container-pk">
        <div className="grid gap-3 rounded-[18px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_200px_180px]">
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
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
      <Suspense fallback={<div className="container-pk py-24 text-sm text-[var(--muted)]">Loading explore…</div>}>
        <ExploreContent />
      </Suspense>
    </BasicLayout>
  );
}
