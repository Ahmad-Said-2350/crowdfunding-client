"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/types";
import "swiper/css";
import "swiper/css/pagination";

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

export function HomeHero() {
  const [heroSwiper, setHeroSwiper] = useState<SwiperType | null>(null);

  return (
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
            <div className="relative min-h-[82vh]">
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,61,58,0.92)_0%,rgba(11,61,58,0.7)_48%,rgba(11,61,58,0.3)_100%)]" />
              <div className="container-pk relative z-10 flex min-h-[82vh] items-center py-24">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="mx-auto max-w-3xl text-center md:mx-0 md:text-left"
                >
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                    {BRAND.name} · 0{i + 1}
                  </p>
                  <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{slide.title}</h1>
                  <p className="mt-6 mx-auto max-w-xl text-base leading-7 text-white/85 md:mx-0 md:text-lg">{slide.copy}</p>
                  <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
                    <Link href={slide.href}>
                      <Button size="lg">
                        {slide.cta} <HiOutlineArrowRight size={18} />
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="border-white/35 bg-transparent text-white hover:bg-white hover:text-[var(--brand-deep)]"
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

      <button type="button" aria-label="Previous slide" className="hero-nav-btn hero-nav-prev" onClick={() => heroSwiper?.slidePrev()}>
        <HiOutlineChevronLeft size={36} strokeWidth={1.5} />
      </button>
      <button type="button" aria-label="Next slide" className="hero-nav-btn hero-nav-next" onClick={() => heroSwiper?.slideNext()}>
        <HiOutlineChevronRight size={36} strokeWidth={1.5} />
      </button>
    </section>
  );
}
