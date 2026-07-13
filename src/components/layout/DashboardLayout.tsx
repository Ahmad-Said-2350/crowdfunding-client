"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Coins, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJSON } from "@/lib/api";
import { BRAND, ROLE_LABEL, type Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV: Record<Role, [string, string][]> = {
  supporter: [
    ["Overview", "supporter-home"],
    ["Explore", "explore-campaigns"],
    ["My contributions", "my-contributions"],
    ["Buy credits", "purchase-credit"],
    ["Payments", "payment-history"],
    ["Profile", "profile"],
  ],
  creator: [
    ["Overview", "creator-home"],
    ["New campaign", "add-campaign"],
    ["My campaigns", "my-campaigns"],
    ["Withdrawals", "withdrawals"],
    ["Payments", "payment-history"],
    ["Profile", "profile"],
  ],
  admin: [
    ["Operations", "admin-home"],
    ["Users", "manage-users"],
    ["Campaigns", "manage-campaigns"],
    ["Withdrawals", "withdrawal-requests"],
    ["Payments", "manage-payments"],
    ["Reports", "reports"],
    ["Profile", "profile"],
  ],
};

type Notification = { _id: string; message: string; actionRoute: string; time: string; read: boolean };

const accent: Record<Role, string> = {
  supporter: "var(--brand)",
  creator: "var(--brand)",
  admin: "var(--brand)",
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchJSON<{ notifications: Notification[] }>("/api/notifications")
      .then((r) => setNotifications(r.notifications))
      .catch(() => undefined);
  }, [user]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!bellRef.current?.contains(event.target as Node)) setPopup(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) return null;
  const nav = NAV[user.role];
  const roleColor = accent[user.role];

  const markRead = async () => {
    setPopup((v) => !v);
    if (notifications.some((n) => !n.read)) {
      await fetchJSON("/api/notifications/read-all", { method: "PATCH" }).catch(() => undefined);
      setNotifications((items) => items.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-black/10 bg-[var(--ink)] px-4 text-white">
        <button className="mr-3 grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10 lg:hidden" onClick={() => setMenu(!menu)}>
          {menu ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link href="/" className="text-lg font-bold tracking-tight">
          {BRAND.name}<span className="text-teal-300">.</span>
        </Link>
        <div className="ml-3 hidden rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-slate-300 sm:block">
          {ROLE_LABEL[user.role]}
        </div>
        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm sm:flex">
            <Coins size={15} />
            <b>{user.credits}</b>
          </span>
          <div ref={bellRef} className="relative">
            <button onClick={() => void markRead()} className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10">
              <Bell size={18} />
              {notifications.some((n) => !n.read) && <i className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-300" />}
            </button>
            {popup && (
              <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-[16px] border border-[var(--border)] bg-white text-[var(--ink)] shadow-[var(--shadow-lg)]">
                <p className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold">Notifications</p>
                <div className="max-h-80 overflow-auto">
                  {notifications.length ? notifications.map((n) => (
                    <Link key={n._id} href={n.actionRoute} className="block border-b border-[var(--border)] px-4 py-3 text-sm hover:bg-[var(--bg)]">
                      {n.message}
                      <time className="mt-1 block text-xs text-[var(--muted)]">{new Date(n.time).toLocaleString()}</time>
                    </Link>
                  )) : <p className="p-5 text-sm text-[var(--muted)]">No notifications yet.</p>}
                </div>
              </div>
            )}
          </div>
          <Link href="/dashboard/profile" className="hidden text-right transition hover:opacity-90 md:block">
            <p className="text-[0.68rem] uppercase tracking-wide text-slate-400">{ROLE_LABEL[user.role]}</p>
            <p className="text-sm font-semibold">{user.name}</p>
          </Link>
          <Link href="/dashboard/profile" className="shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: roleColor }}>{user.name[0]}</span>
            )}
          </Link>
        </div>
      </header>

      <aside className={cn(
        "fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-[var(--border)] bg-white p-3 transition-transform lg:translate-x-0",
        menu ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="space-y-1">
          {nav.map(([label, route]) => {
            const active = pathname.endsWith(route);
            return (
              <Link
                key={route}
                href={`/dashboard/${route}`}
                prefetch
                onClick={() => setMenu(false)}
                className={cn(
                  "block rounded-[12px] px-4 py-3 text-sm font-semibold transition",
                  active ? "text-white shadow-sm" : "text-[var(--ink-soft)] hover:bg-[var(--bg)]"
                )}
                style={active ? { background: roleColor } : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => void logout()}
          className="absolute bottom-5 left-3 right-3 flex h-11 items-center justify-center gap-2 rounded-[12px] text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--bg)] hover:text-[var(--ink)]"
        >
          <LogOut size={16} /> Log out
        </button>
      </aside>

      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
        <footer className="border-t border-[var(--border)] px-5 py-4 text-center text-xs text-[var(--muted)] md:px-8">
          © {new Date().getFullYear()} {BRAND.name} · {ROLE_LABEL[user.role]} workspace
        </footer>
      </main>
    </div>
  );
}
