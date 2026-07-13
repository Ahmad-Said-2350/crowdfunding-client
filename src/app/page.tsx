"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Button } from "@/components/ui/Button";
import { fetchJSON } from "@/lib/api";
import { BRAND, type Campaign } from "@/lib/types";

const slides = [
  {
    title: "Capital for ideas that move communities.",
    copy: "Back verified campaigns, follow every credit, and see outcomes with full transparency.",
    href: "/explore",
    cta: "Explore campaigns",
  },
  {
    title: "Build with people who believe early.",
    copy: "Launch with clear goals, review contributions carefully, and withdraw when milestones are met.",
    href: "/register",
    cta: "Start creating",
  },
  {
    title: "Funding should earn trust.",
    copy: "Pledgekit keeps approvals, refunds, and platform economics visible for every role.",
    href: "#impact",
    cta: "See impact",
  },
];

const testimonials = [
  {
    quote: "Pledgekit gave our neighborhood energy project the credibility it needed.",
    name: "Maya Rahman",
    role: "Creator",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Maya%20Rahman",
  },
  {
    quote: "Clear review states and credit history make every contribution feel accountable.",
    name: "Daniel Wong",
    role: "Supporter",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Daniel%20Wong",
  },
  {
    quote: "The workflow is focused, transparent, and refreshingly professional.",
    name: "Nadia Karim",
    role: "Operator",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Nadia%20Karim",
  },
];

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ campaigns: 0, creditsRaised: 0, supporters: 0, creators: 0 });

  useEffect(() => {
    fetchJSON<{ campaigns: Campaign[] }>("/api/campaigns/top").then((r) => setCampaigns(r.campaigns)).catch(() => undefined);
    fetchJSON<{ stats: typeof stats }>("/api/stats/public").then((r) => setStats(r.stats)).catch(() => undefined);
  }, []);

  return (
    <BasicLayout>
      <section className="bg-[var(--ink)] text-white">
        <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 6500 }} loop>
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.title}>
              <div className="container-pk flex min-h-[70vh] items-center py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                    {BRAND.name} / 0{i + 1}
                  </p>
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">{slide.title}</h1>
                  <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 md:text-lg">{slide.copy}</p>
                  <Link href={slide.href} className="mt-9 inline-block">
                    <Button>{slide.cta}</Button>
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="section-space container-pk">
        <p className="pk-kicker">Top funded</p>
        <h2 className="pk-title mt-3">Campaigns earning momentum</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length ? (
            campaigns.map((c) => (
              <motion.div key={c._id} whileHover={{ y: -4 }}>
                <CampaignCard campaign={c} />
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">Approved campaigns will appear here as they raise credits.</p>
          )}
        </div>
      </section>

      <section className="section-space bg-[var(--surface)]">
        <div className="container-pk">
          <h2 className="pk-title">How it works</h2>
          <div className="mt-10 grid md:grid-cols-3">
            {[
              ["01", "Discover", "Review approved campaigns, goals, deadlines, and creator details."],
              ["02", "Contribute", "Use credits to support a campaign; creators review each pledge."],
              ["03", "Track impact", "Follow approvals, refunds, withdrawals, and platform outcomes."],
            ].map(([n, t, d]) => (
              <div key={n} className="border-t border-[var(--ink)] p-6 md:border-r md:last:border-r-0">
                <b className="text-[var(--pk-blue)]">{n}</b>
                <h3 className="mt-8 text-lg font-semibold">{t}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-pk">
        <h2 className="pk-title">Explore by category</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Technology", "Education", "Healthcare", "Environment", "Community", "Arts", "Social Impact"].map((c) => (
            <Link
              key={c}
              href={`/explore?category=${encodeURIComponent(c)}`}
              className="inline-flex h-11 items-center border border-[var(--border)] px-5 text-sm font-medium hover:border-[var(--pk-blue)] hover:text-[var(--pk-blue)]"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section id="impact" className="bg-[var(--pk-blue)] py-20 text-white">
        <div className="container-pk">
          <h2 className="text-3xl font-semibold tracking-tight">Platform impact</h2>
          <div className="mt-10 grid grid-cols-2 gap-px bg-blue-300/40 lg:grid-cols-4">
            {[
              ["Approved campaigns", stats.campaigns],
              ["Credits raised", stats.creditsRaised],
              ["Supporters", stats.supporters],
              ["Creators", stats.creators],
            ].map(([l, v]) => (
              <div key={String(l)} className="bg-[var(--pk-blue)] p-7">
                <b className="text-4xl font-semibold tracking-tight">{Number(v).toLocaleString()}</b>
                <p className="mt-2 text-sm text-blue-100">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-pk">
        <h2 className="pk-title">What our community says</h2>
        <Swiper className="mt-10" modules={[Pagination, Autoplay]} pagination autoplay={{ delay: 5000 }} spaceBetween={30}>
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <blockquote className="border-l-4 border-[var(--pk-blue)] py-4 pl-6">
                <p className="max-w-3xl text-2xl font-medium leading-snug tracking-tight md:text-3xl">“{t.quote}”</p>
                <footer className="mt-6 flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="h-12 w-12 bg-[var(--surface)]" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-[var(--muted)]">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </BasicLayout>
  );
}
