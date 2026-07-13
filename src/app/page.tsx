"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineBuildingLibrary,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlinePaintBrush,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUsers,
} from "react-icons/hi2";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Button } from "@/components/ui/Button";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

const HomeHero = dynamic(() => import("@/components/home/HomeHero").then((m) => m.HomeHero), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[82vh] place-items-center bg-[var(--brand-deep)] text-sm text-teal-100">
      Loading Pledgekit…
    </div>
  ),
});

const HomeTestimonials = dynamic(
  () => import("@/components/home/HomeTestimonials").then((m) => m.HomeTestimonials),
  {
    ssr: false,
    loading: () => (
      <div className="section-space container-pk">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-[var(--bg-soft)]" />
          ))}
        </div>
      </div>
    ),
  }
);

const categories = [
  { name: "Environment", icon: HiOutlineGlobeAlt, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80" },
  { name: "Community", icon: HiOutlineUsers, image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80" },
  { name: "Education", icon: HiOutlineAcademicCap, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80" },
  { name: "Technology", icon: HiOutlineCpuChip, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" },
  { name: "Healthcare", icon: HiOutlineHeart, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" },
  { name: "Arts", icon: HiOutlinePaintBrush, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80" },
];

const faqs = [
  { q: "What is Pledgekit?", a: "A role-based crowdfunding platform where supporters contribute credits, creators launch campaigns, and admins keep approvals transparent." },
  { q: "How do credits work?", a: "Supporters purchase or receive credits, then pledge them to approved campaigns. Creators review each contribution before funds count." },
  { q: "Who can create a campaign?", a: "Anyone registered as a Creator can submit a campaign. It goes live after admin approval." },
  { q: "Where does Join as Developer go?", a: "It opens the Pledgekit client GitHub repository so contributors can explore and join the codebase." },
  { q: "Can I filter by deadline?", a: "Yes. On Explore, sort by Deadline, Most funded, Highest goal, or Newest while filtering categories like Environment and Community." },
  { q: "Is Google sign-in available?", a: "Yes. Use Continue with Google on the sign-in page when Google OAuth is configured for your environment." },
];

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ campaigns: 0, creditsRaised: 0, supporters: 0, creators: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchJSON<{ campaigns: Campaign[] }>("/api/campaigns/top").then((r) => setCampaigns(r.campaigns)).catch(() => undefined);
    fetchJSON<{ stats: typeof stats }>("/api/stats/public").then((r) => setStats(r.stats)).catch(() => undefined);
  }, []);

  return (
    <BasicLayout>
      <HomeHero />

      <section className="pk-sheet section-space">
        <div className="container-pk">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="pk-kicker"><HiOutlineSparkles size={14} /> Featured</p>
              <h2 className="pk-title mt-2">Campaigns earning momentum</h2>
            </div>
            <Link href="/explore">
              <Button variant="secondary" size="sm">
                Discover all <HiOutlineArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.length ? (
              campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)
            ) : (
              <p className="text-sm text-[var(--muted)]">Approved campaigns will appear here as they raise credits.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section-space bg-[var(--bg)]">
        <div className="container-pk text-center">
          <h2 className="pk-title">Trending categories</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Browse Environment, Community, and more — filter Explore by category or sort by deadline.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-[5/6] overflow-hidden rounded-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
                  <cat.icon size={22} strokeWidth={1.5} className="mb-2.5 opacity-95" />
                  <h3 className="text-lg font-bold tracking-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-pk grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="pk-kicker">How it works</p>
            <h2 className="pk-title mt-2">Clear steps. Premium calm.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
              From discovery to withdrawal, every action stays readable — built for Supporters, Creators, and Admins.
            </p>
            <Link href="/explore" className="mt-6 inline-block">
              <Button variant="secondary">
                Browse campaigns <HiOutlineArrowRight size={16} />
              </Button>
            </Link>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { icon: HiOutlineBuildingLibrary, t: "Discover", d: "Browse approved campaigns with goals, deadlines, and creators." },
                { icon: HiOutlineShieldCheck, t: "Contribute", d: "Pledge credits. Creators review every contribution." },
                { icon: HiOutlineChartBar, t: "Track", d: "Follow approvals, refunds, and outcomes in one place." },
                { icon: HiOutlineSparkles, t: "Withdraw", d: "Creators request withdrawals when funding milestones land." },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
                  <item.icon size={22} strokeWidth={1.5} className="text-[var(--brand)]" />
                  <h3 className="mt-3 font-bold">{item.t}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Team collaborating"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section id="impact" className="relative overflow-hidden bg-[var(--brand)] py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-25" />
        <div className="container-pk relative">
          <p className="text-sm text-teal-100">Platform impact</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Real campaigns. Real credits. Measurable progress.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Approved campaigns", stats.campaigns],
              ["Credits raised", stats.creditsRaised],
              ["Supporters", stats.supporters],
              ["Creators", stats.creators],
            ].map(([l, v]) => (
              <div key={String(l)} className="rounded-xl bg-white/10 p-6 backdrop-blur">
                <b className="text-3xl font-bold tracking-tight md:text-4xl">{Number(v).toLocaleString()}</b>
                <p className="mt-2 text-sm text-teal-50/90">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeTestimonials />

      <section className="section-space bg-white">
        <div className="container-pk">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="pk-title">Frequently asked questions</h2>
            <Link href="/register">
              <Button variant="secondary" size="sm">
                More questions <HiOutlineArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="border-b border-[var(--border)] py-5 text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[var(--ink)]">{item.q}</span>
                    <HiOutlineChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} />
                  </div>
                  {open && <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.a}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,118,110,0.92),rgba(15,118,110,0.55))]" />
        </div>
        <div className="container-pk relative py-20 text-white">
          <p className="text-sm text-teal-100">Have more questions?</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            We prioritize clarity. Get started or explore live campaigns.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register"><Button className="bg-white text-[var(--ink)] hover:bg-teal-50" size="lg">Create account</Button></Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-[var(--brand-deep)]">
                Explore now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </BasicLayout>
  );
}
