"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useEffect, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiArrowRight } from "react-icons/hi2";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { Button } from "@/components/ui/Button";
import { fetchJSON } from "@/lib/api";
import { BRAND, type Campaign } from "@/lib/types";

const slides = [
  {
    title: "Fund ideas that deserve momentum.",
    copy: "Discover verified campaigns, contribute with credits, and track every outcome with clarity.",
    href: "/explore",
    cta: "Explore campaigns",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Launch with trust built in.",
    copy: "Create campaigns, review support carefully, and withdraw when your community backs you.",
    href: "/register",
    cta: "Start creating",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "A calmer way to crowdfund.",
    copy: "Pledgekit keeps approvals, refunds, and platform economics visible for every role.",
    href: "#impact",
    cta: "See impact",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
  },
];

const testimonials = [
  {
    quote: "Pledgekit made our community energy project feel credible from day one.",
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
    quote: "Focused, transparent, and refreshingly professional.",
    name: "Nadia Karim",
    role: "Operator",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Nadia%20Karim",
  },
];

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ campaigns: 0, creditsRaised: 0, supporters: 0, creators: 0 });
  const [heroSwiper, setHeroSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    fetchJSON<{ campaigns: Campaign[] }>("/api/campaigns/top").then((r) => setCampaigns(r.campaigns)).catch(() => undefined);
    fetchJSON<{ stats: typeof stats }>("/api/stats/public").then((r) => setStats(r.stats)).catch(() => undefined);
  }, []);

  return (
    <BasicLayout>
      <section className="hero-slider relative overflow-hidden bg-[var(--brand-deep)] text-white">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={setHeroSwiper}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          loop
          speed={700}
          className="hero-swiper relative"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.title}>
              <div className="relative min-h-[78vh]">
                <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,40,38,0.92)_0%,rgba(15,40,38,0.72)_48%,rgba(15,40,38,0.35)_100%)]" />
                <div className="container-pk relative z-10 flex min-h-[78vh] items-center py-24">
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="max-w-2xl"
                  >
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                      {BRAND.name} · 0{i + 1}
                    </p>
                    <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{slide.title}</h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/85 md:text-lg">{slide.copy}</p>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <Link href={slide.href}>
                        <Button size="lg">
                          {slide.cta} <HiArrowRight size={18} />
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-[var(--brand-deep)]"
                        >
                          Create account
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Previous slide"
          className="hero-nav-btn hero-nav-prev"
          onClick={() => heroSwiper?.slidePrev()}
        >
          <HiOutlineChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="hero-nav-btn hero-nav-next"
          onClick={() => heroSwiper?.slideNext()}
        >
          <HiOutlineChevronRight size={22} />
        </button>
      </section>

      <section className="section-space container-pk">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="pk-kicker">Top funded</p>
            <h2 className="pk-title mt-2">Campaigns earning momentum</h2>
          </div>
          <Link href="/explore"><Button variant="soft" size="sm">Browse all</Button></Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length ? (
            campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)
          ) : (
            <p className="text-sm text-[var(--muted)]">Approved campaigns will appear here as they raise credits.</p>
          )}
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-pk">
          <p className="pk-kicker">Simple flow</p>
          <h2 className="pk-title mt-2">How Pledgekit works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Discover", "Browse approved campaigns with clear goals, deadlines, and creators."],
              ["02", "Contribute", "Use credits to back a campaign. Creators review every pledge."],
              ["03", "Track impact", "Follow approvals, refunds, withdrawals, and outcomes in one place."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-[18px] border border-[var(--border)] bg-[var(--bg)] p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                <span className="text-sm font-bold text-[var(--brand)]">{n}</span>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-pk">
        <p className="pk-kicker">Categories</p>
        <h2 className="pk-title mt-2">Explore by interest</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Technology", "Education", "Healthcare", "Environment", "Community", "Arts", "Social Impact"].map((c) => (
            <Link
              key={c}
              href={`/explore?category=${encodeURIComponent(c)}`}
              className="inline-flex h-11 items-center rounded-full border border-[var(--border)] bg-white px-5 text-sm font-semibold text-[var(--ink-soft)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-deep)]"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section id="impact" className="bg-[var(--brand)] py-20 text-white">
        <div className="container-pk">
          <h2 className="text-3xl font-bold tracking-tight">Platform impact</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Approved campaigns", stats.campaigns],
              ["Credits raised", stats.creditsRaised],
              ["Supporters", stats.supporters],
              ["Creators", stats.creators],
            ].map(([l, v]) => (
              <div key={String(l)} className="rounded-[16px] bg-white/10 p-6 backdrop-blur">
                <b className="text-3xl font-bold tracking-tight md:text-4xl">{Number(v).toLocaleString()}</b>
                <p className="mt-2 text-sm text-teal-50/90">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-pk">
        <p className="pk-kicker">Community</p>
        <h2 className="pk-title mt-2">What people say</h2>
        <Swiper className="mt-10" modules={[Pagination, Autoplay]} pagination autoplay={{ delay: 5000 }} spaceBetween={24}>
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <blockquote className="rounded-[20px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
                <p className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-[var(--ink)] md:text-3xl">
                  “{t.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full bg-[var(--bg)]" />
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
