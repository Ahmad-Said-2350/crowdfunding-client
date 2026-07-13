import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { Badge } from "./ui/Badge";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100));
  return <article className="group border border-[var(--border)] bg-white">
    <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]"><img src={campaign.campaign_image_url} alt={campaign.campaign_title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
    <div className="p-5"><Badge tone="blue">{campaign.category}</Badge><h3 className="mt-4 font-serif text-xl font-semibold">{campaign.campaign_title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{campaign.campaign_story}</p>
      <div className="mt-5 h-1.5 bg-gray-200"><div className="h-full bg-[var(--ibm-blue)]" style={{ width: `${progress}%` }} /></div>
      <div className="mt-2 flex justify-between text-xs"><b>{campaign.amount_raised.toLocaleString()} credits</b><span>{progress}% funded</span></div>
      <Link href={`/campaigns/${campaign._id}`} className="mt-5 inline-block font-semibold text-[var(--ibm-blue)]">View campaign →</Link>
    </div>
  </article>;
}
