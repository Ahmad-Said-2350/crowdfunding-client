"use client";

import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    quote: "Pledgekit made our community energy project feel credible from day one — clear reviews and calm tracking.",
    name: "Maya Rahman",
    role: "Creator · Environment",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Maya%20Rahman",
  },
  {
    quote: "Clear review states and credit history make every contribution feel accountable and easy to follow.",
    name: "Daniel Wong",
    role: "Supporter",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Daniel%20Wong",
  },
  {
    quote: "Focused, transparent, and refreshingly professional — the kind of platform operators can trust.",
    name: "Nadia Karim",
    role: "Operator",
    photo: "https://api.dicebear.com/9.x/initials/svg?seed=Nadia%20Karim",
  },
];

export function HomeTestimonials() {
  return (
    <section className="section-space container-pk">
      <h2 className="pk-title text-center">What people say</h2>
      <Swiper
        className="mt-10 !pb-10"
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        spaceBetween={20}
        breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.name} className="!h-auto">
            <blockquote className="flex h-full min-h-[220px] flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full bg-[var(--bg)]" loading="lazy" decoding="async" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-[var(--muted)]">{t.role}</p>
                </div>
              </div>
              <p className="mt-5 flex-1 text-sm leading-7 text-[var(--ink-soft)]">“{t.quote}”</p>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
