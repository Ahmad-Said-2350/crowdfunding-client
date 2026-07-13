"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function Layout({children}:{children:React.ReactNode}) {
  const {user,loading}=useAuth(); const router=useRouter(); const pathname=usePathname();
  useEffect(()=>{if(!loading&&!user)router.replace(`/login?next=${encodeURIComponent(pathname)}`);},[loading,user,router,pathname]);
  if(loading)return <div className="grid min-h-screen place-items-center">Restoring your Fundora session…</div>;
  if(!user)return <div className="grid min-h-screen place-items-center">Redirecting to sign in…</div>;
  return <DashboardLayout>{children}</DashboardLayout>;
}
