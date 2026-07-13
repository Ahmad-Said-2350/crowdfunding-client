"use client";
import { useEffect,useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CampaignCard } from "@/components/CampaignCard";
import { Input } from "@/components/ui/Input";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

export default function ExploreCampaigns(){
 const [items,setItems]=useState<Campaign[]>([]);const [q,setQ]=useState("");
 useEffect(()=>{const t=setTimeout(()=>fetchJSON<{campaigns:Campaign[]}>(`/api/campaigns/explore?q=${encodeURIComponent(q)}`).then(r=>setItems(r.campaigns)).catch(()=>undefined),250);return()=>clearTimeout(t);},[q]);
 return <><DashboardHeader eyebrow="Support campaigns" title="Explore campaigns" description="Find approved, open campaigns and put your available credits to work."/><Input className="mb-7 max-w-xl" placeholder="Search campaigns…" value={q} onChange={e=>setQ(e.target.value)}/><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map(c=><CampaignCard key={c._id} campaign={c}/>)}</div></>;
}
