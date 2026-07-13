"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardIndex(){
  const {user}=useAuth(); const router=useRouter();
  useEffect(()=>{if(user)router.replace(`/dashboard/${user.role}-home`);},[user,router]);
  return <p>Opening your dashboard…</p>;
}
