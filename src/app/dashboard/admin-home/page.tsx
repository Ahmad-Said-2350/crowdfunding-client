"use client";
import { useEffect,useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import type { Campaign } from "@/lib/types";

export default function AdminHome(){
 const [data,setData]=useState<{stats:{totalSupporters:number;totalCreators:number;totalAvailableCredits:number;totalPaymentsProcessed:number};pendingCampaigns:Campaign[]}>();
 const load=()=>{void fetchJSON<typeof data>("/api/admin/home").then(setData).catch(()=>undefined);};useEffect(()=>{load();},[]);
 const decide=async(id:string,status:"approved"|"rejected")=>{await fetchJSON(`/api/admin/campaigns/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});load();};
 return <><DashboardHeader eyebrow="Administration" title="Platform operations" description="Review growth, credit circulation, and campaigns awaiting moderation."/><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Supporters" value={data?.stats.totalSupporters??"—"}/><StatCard label="Creators" value={data?.stats.totalCreators??"—"}/><StatCard label="Available credits" value={data?.stats.totalAvailableCredits??"—"}/><StatCard label="Payments processed" value={data?.stats.totalPaymentsProcessed??"—"}/></div><h2 className="mb-4 mt-10 text-xl font-semibold">Pending campaigns</h2>{data?.pendingCampaigns.length?<div className="overflow-auto"><table className="data-table"><thead><tr><th>Campaign</th><th>Creator</th><th>Goal</th><th>Action</th></tr></thead><tbody>{data.pendingCampaigns.map(c=><tr key={c._id}><td>{c.campaign_title}</td><td>{c.creator_name}</td><td>{c.funding_goal}</td><td className="flex gap-2"><Button className="h-9 px-3" onClick={()=>void decide(c._id,"approved")}>Approve</Button><Button className="h-9 px-3" variant="secondary" onClick={()=>void decide(c._id,"rejected")}>Reject</Button></td></tr>)}</tbody></table></div>:<EmptyState description="No campaigns are waiting for review."/>}</>;
}
