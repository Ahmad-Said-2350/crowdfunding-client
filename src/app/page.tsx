"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BasicLayout } from "@/components/layout/BasicLayout";
import { CampaignCard } from "@/components/CampaignCard";
import { useEffect, useState } from "react";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

const slides = [
  ["Capital for ideas that move communities.", "Back verified projects, follow every credit, and see tangible outcomes.", "Explore campaigns"],
  ["Build with people who believe early.", "Turn a credible plan into momentum with transparent funding and creator tools.", "Start creating"],
  ["Funding should earn trust.", "Fundora makes contributions, campaign decisions, and platform economics visible.", "See our impact"],
];
const testimonials = [
  {
    quote: "Fundora gave our neighborhood energy project the credibility it needed.",
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
    role: "Social Founder",
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
  return <BasicLayout>
    <section className="bg-[var(--ink)] text-white"><Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 6000 }} loop>
      {slides.map(([title, copy, cta], i) => <SwiperSlide key={title}><div className="container-fundora flex min-h-[620px] items-center py-20"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[.2em] text-blue-300">Fundora / 0{i + 1}</p><h1 className="font-serif text-5xl leading-[1.06] md:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-lg text-gray-300">{copy}</p>
        <Link href={i === 1 ? "/register" : i === 2 ? "#impact" : "/explore"} className="mt-9 inline-block bg-[var(--ibm-blue)] px-7 py-4 font-semibold">{cta} →</Link>
      </motion.div></div></SwiperSlide>)}
    </Swiper></section>
    <section className="section-space container-fundora"><p className="text-sm font-semibold uppercase tracking-widest text-[var(--ibm-blue)]">Top funded</p><h2 className="mt-3 font-serif text-4xl">Campaigns earning momentum</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{campaigns.length ? campaigns.map((c) => <motion.div key={c._id} whileHover={{ y: -5 }}><CampaignCard campaign={c} /></motion.div>) : <p className="text-[var(--muted)]">Campaigns will appear here as they are approved.</p>}</div>
    </section>
    <section className="section-space bg-[var(--surface)]"><div className="container-fundora"><h2 className="font-serif text-4xl">How it works</h2><div className="mt-10 grid md:grid-cols-3">{[["01","Discover","Review approved campaigns, goals, deadlines, and creator details."],["02","Contribute","Use credits to support a campaign and leave a message for its creator."],["03","Track impact","Follow approval, funding progress, refunds, and transparent outcomes."]].map(([n,t,d]) => <div key={n} className="border-t border-[var(--ink)] p-6 md:border-r"><b className="text-[var(--ibm-blue)]">{n}</b><h3 className="mt-8 text-xl font-semibold">{t}</h3><p className="mt-3 text-sm text-[var(--muted)]">{d}</p></div>)}</div></div></section>
    <section className="section-space container-fundora"><h2 className="font-serif text-4xl">Explore by category</h2><div className="mt-8 flex flex-wrap gap-3">{["Technology","Education","Healthcare","Environment","Community","Arts","Social Impact"].map((c) => <Link key={c} href={`/explore?category=${encodeURIComponent(c)}`} className="border border-[var(--border)] px-5 py-3 hover:border-[var(--ibm-blue)] hover:text-[var(--ibm-blue)]">{c} →</Link>)}</div></section>
    <section id="impact" className="bg-[var(--ibm-blue)] py-20 text-white"><div className="container-fundora"><h2 className="font-serif text-4xl">Platform impact</h2><div className="mt-10 grid grid-cols-2 gap-px bg-blue-300 lg:grid-cols-4">{[["Approved campaigns",stats.campaigns],["Credits raised",stats.creditsRaised],["Supporters",stats.supporters],["Creators",stats.creators]].map(([l,v]) => <div key={l} className="bg-[var(--ibm-blue)] p-7"><b className="text-4xl">{Number(v).toLocaleString()}</b><p className="mt-2 text-sm text-blue-100">{l}</p></div>)}</div></div></section>
    <section className="section-space container-fundora"><h2 className="font-serif text-4xl">What our community says</h2><Swiper className="mt-10" modules={[Pagination, Autoplay]} pagination autoplay={{ delay: 5000 }} spaceBetween={30}>{testimonials.map((t) => <SwiperSlide key={t.name}><blockquote className="border-l-4 border-[var(--ibm-blue)] py-5 pl-7"><p className="max-w-4xl font-serif text-2xl md:text-3xl">“{t.quote}”</p><footer className="mt-6 flex items-center gap-4"><img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full bg-[var(--surface)]" /><div><p className="font-semibold">{t.name}</p><p className="text-sm text-[var(--muted)]">{t.role}</p></div></footer></blockquote></SwiperSlide>)}</Swiper></section>
  </BasicLayout>;
}
