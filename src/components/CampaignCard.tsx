import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min(100, Math.round((campaign.amount_raised / Math.max(campaign.funding_goal, 1)) * 100));
  return (
    <article className="group flex h-full flex-col border border-[var(--border)] bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
        <img
          src={campaign.campaign_image_url}
          alt={campaign.campaign_title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="blue">{campaign.category}</Badge>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--ink)]">{campaign.campaign_title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{campaign.campaign_story}</p>
        <div className="mt-auto pt-5">
          <div className="pk-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
            <b className="text-[var(--ink)]">{campaign.amount_raised.toLocaleString()} credits</b>
            <span>{progress}% funded</span>
          </div>
          <Link href={`/campaigns/${campaign._id}`} className="mt-5 block">
            <Button variant="secondary" className="w-full" size="sm">View details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
