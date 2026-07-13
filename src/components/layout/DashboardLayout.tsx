"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Coins, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJSON } from "@/lib/api";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV: Record<Role, [string, string][]> = {
  supporter: [["Home", "supporter-home"], ["Explore Campaigns", "explore-campaigns"], ["My Contributions", "my-contributions"], ["Purchase Credit", "purchase-credit"], ["Payment History", "payment-history"]],
  creator: [["Home", "creator-home"], ["Add New Campaign", "add-campaign"], ["My Campaigns", "my-campaigns"], ["Withdrawals", "withdrawals"], ["Payment History", "payment-history"]],
  admin: [["Home", "admin-home"], ["Manage Users", "manage-users"], ["Manage Campaigns", "manage-campaigns"], ["Withdrawal Requests", "withdrawal-requests"], ["Reports", "reports"]],
};
type Notification = { _id: string; message: string; actionRoute: string; time: string; read: boolean };

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!user) return;
    fetchJSON<{ notifications: Notification[] }>("/api/notifications").then((r) => setNotifications(r.notifications)).catch(() => undefined);
  }, [user]);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!bellRef.current?.contains(event.target as Node)) setPopup(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);
  if (!user) return null;
  const nav = NAV[user.role];
  const markRead = async () => {
    setPopup((v) => !v);
    if (notifications.some((n) => !n.read)) {
      await fetchJSON("/api/notifications/read-all", { method: "PATCH" }).catch(() => undefined);
      setNotifications((items) => items.map((n) => ({ ...n, read: true })));
    }
  };
  return <div className="min-h-screen bg-[var(--surface)]">
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-gray-700 bg-[var(--ink)] px-4 text-white">
      <button className="mr-3 lg:hidden" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <Link href="/" className="font-serif text-2xl font-bold">Fundora<span className="text-blue-400">.</span></Link>
      <div className="ml-auto flex items-center gap-5">
        <span className="hidden items-center gap-2 sm:flex"><Coins size={17} /> Available Credits <b>{user.credits}</b></span>
        <div ref={bellRef} className="relative">
          <button onClick={() => void markRead()} className="relative p-2"><Bell size={20} />{notifications.some((n) => !n.read) && <i className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-400" />}</button>
          {popup && <div className="absolute right-0 top-12 w-80 bg-white text-[var(--ink)] shadow-xl">
            <p className="border-b p-4 font-semibold">Notifications</p>
            <div className="max-h-80 overflow-auto">{notifications.length ? notifications.map((n) => <Link key={n._id} href={n.actionRoute} className="block border-b p-4 text-sm hover:bg-[var(--surface)]">{n.message}<time className="mt-1 block text-xs text-[var(--muted)]">{new Date(n.time).toLocaleString()}</time></Link>) : <p className="p-5 text-sm text-[var(--muted)]">No notifications yet.</p>}</div>
          </div>}
        </div>
        <div className="hidden text-right md:block"><p className="text-xs capitalize text-gray-400">{user.role}</p><p className="text-sm font-semibold">{user.name}</p></div>
        {user.image ? <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ibm-blue)] font-bold">{user.name[0]}</span>}
      </div>
    </header>
    <aside className={cn("fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-[var(--border)] bg-white transition-transform lg:translate-x-0", menu ? "translate-x-0" : "-translate-x-full")}>
      <nav className="space-y-1 p-4">{nav.map(([label, route]) => <Link key={route} href={`/dashboard/${route}`} onClick={() => setMenu(false)} className={cn("block px-4 py-3 text-sm font-medium", pathname.endsWith(route) ? "bg-[var(--ibm-blue)] text-white" : "hover:bg-[var(--surface)]")}>{label}</Link>)}</nav>
      <button onClick={() => void logout()} className="absolute bottom-5 left-4 flex items-center gap-2 px-4 py-3 text-sm"><LogOut size={17} /> Log out</button>
    </aside>
    <main className="min-h-screen pt-16 lg:pl-64"><div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div><footer className="border-t bg-white p-4 text-center text-xs text-[var(--muted)]">Fundora dashboard · Transparent funding, measurable outcomes.</footer></main>
  </div>;
}
