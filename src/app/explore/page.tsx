"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiOutlineCalendarDays,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
} from "react-icons/hi2";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import { BRAND, type Campaign } from "@/lib/types";

const CATEGORIES = ["Technology", "Education", "Healthcare", "Environment", "Community", "Arts", "Social Impact"];

function ExploreContent() {
  const params = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState("deadline");

  useEffect(() => {
    const fromUrl = params.get("category");
    if (fromUrl) setCategory(fromUrl);
  }, [params]);

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
      <header className="relative overflow-hidden bg-[var(--brand-deep)] py-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-20" />
        <div className="container-pk relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Explore {BRAND.name}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Discover campaigns ready for support.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
            Filter by category or sort by deadline — Environment, Community, and more.
          </p>
        </div>
      </header>

      <main className="pk-sheet section-space !pt-10">
        <div className="container-pk">
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] md:p-5">
            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr] md:items-end">
              <div className="relative w-full">
                <HiOutlineMagnifyingGlass
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)]"
                />
                <Input
                  className="pl-10"
                  placeholder="Search title, story, or creator…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 px-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <HiOutlineTag size={13} /> Category
                </span>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </label>

              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 px-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <HiOutlineCalendarDays size={13} /> Sort
                </span>
                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="deadline">Deadline</option>
                  <option value="raised">Most funded</option>
                  <option value="goal">Highest goal</option>
                  <option value="newest">Newest</option>
                </Select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["all", "Environment", "Community"].map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[var(--brand)] text-white"
                        : "border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-soft)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    }`}
                  >
                    <HiOutlineFunnel size={14} />
                    {c === "all" ? "All categories" : c}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSort("deadline")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  sort === "deadline"
                    ? "bg-[var(--ink)] text-white"
                    : "border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-soft)] hover:border-[var(--ink)]"
                }`}
              >
                <HiOutlineCalendarDays size={14} />
                Deadline
              </button>
            </div>
          </div>

          <p className="my-7 text-sm text-[var(--muted)]">
            {loading ? "Finding campaigns…" : `${campaigns.length} open campaign${campaigns.length === 1 ? "" : "s"}`}
          </p>

          {campaigns.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
            </div>
          ) : (
            !loading && (
              <EmptyState
                title="No matching campaigns"
                description="Try All categories, Environment, or Community — or sort by Deadline with a broader search."
              />
            )
          )}
        </div>
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
