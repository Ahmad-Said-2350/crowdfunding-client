"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineArrowRight, HiOutlineCalendarDays } from "react-icons/hi2";
import type { Campaign } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [imgSrc, setImgSrc] = useState(campaign.campaign_image_url || FALLBACK_IMAGE);
  const progress = Math.min(100, Math.round((campaign.amount_raised / Math.max(campaign.funding_goal, 1)) * 100));
  const deadline = new Date(campaign.deadline).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-soft)]">
        <img
          src={imgSrc}
          alt={campaign.campaign_title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute left-3 top-3">
          <Badge tone="blue">{campaign.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.05rem] font-bold tracking-tight text-[var(--ink)]">{campaign.campaign_title}</h3>
        <p className="mt-1 text-xs font-medium text-[var(--muted)]">by {campaign.creator_name}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{campaign.campaign_story}</p>
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <HiOutlineCalendarDays size={14} className="text-[var(--brand)]" />
          Deadline {deadline}
        </div>
        <div className="mt-auto pt-4">
          <div className="pk-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <b className="text-[var(--ink)]">{campaign.amount_raised.toLocaleString()} credits</b>
            <span>Goal {campaign.funding_goal.toLocaleString()}</span>
          </div>
          <Link href={`/campaigns/${campaign._id}`} className="mt-4 block">
            <Button variant="secondary" className="w-full" size="sm">
              View details <HiOutlineArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
