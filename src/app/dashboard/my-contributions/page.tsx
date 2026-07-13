"use client";
import { useEffect,useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchJSON } from "@/lib/api";
import type { Contribution } from "@/lib/types";

export default function MyContributions(){
 const [page,setPage]=useState(1);const [data,setData]=useState<{contributions:Contribution[];pagination:{page:number;pages:number;total:number}}>();
 useEffect(()=>{fetchJSON<typeof data>(`/api/supporter/contributions?page=${page}&limit=8`).then(setData).catch(()=>undefined);},[page]);
 return <><DashboardHeader eyebrow="Contribution ledger" title="My contributions" description="A complete, paginated record of the campaigns you have supported."/>
 {data?.contributions.length?<><div className="overflow-auto"><table className="data-table"><thead><tr><th>Campaign</th><th>Creator</th><th>Credits</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.contributions.map(c=><tr key={c._id}><td>{c.campaign_title}</td><td>{c.creator_name}</td><td>{c.contribution_amount}</td><td>{new Date(c.current_date).toLocaleDateString()}</td><td><Badge tone={c.status==="approved"?"success":c.status==="rejected"?"danger":"warning"}>{c.status}</Badge></td></tr>)}</tbody></table></div><div className="mt-5 flex items-center justify-between"><span className="text-sm text-[var(--muted)]">Page {data.pagination.page} of {data.pagination.pages}</span><div className="flex gap-2"><Button variant="secondary" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button variant="secondary" disabled={page>=data.pagination.pages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div></>:<EmptyState description="Your contribution history will appear here."/>}</>;
}
