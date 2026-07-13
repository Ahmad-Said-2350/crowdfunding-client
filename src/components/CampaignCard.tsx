import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min(100, Math.round((campaign.amount_raised / Math.max(campaign.funding_goal, 1)) * 100));
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--bg-soft)]">
        <img
          src={campaign.campaign_image_url}
          alt={campaign.campaign_title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="blue">{campaign.category}</Badge>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-[var(--ink)]">{campaign.campaign_title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{campaign.campaign_story}</p>
        <div className="mt-auto pt-5">
          <div className="pk-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <b className="text-[var(--ink)]">{campaign.amount_raised.toLocaleString()} credits</b>
            <span>{progress}%</span>
          </div>
          <Link href={`/campaigns/${campaign._id}`} className="mt-4 block">
            <Button variant="secondary" className="w-full" size="sm">View details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
