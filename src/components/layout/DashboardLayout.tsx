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
  ],
  creator: [
    ["Overview", "creator-home"],
    ["New campaign", "add-campaign"],
    ["My campaigns", "my-campaigns"],
    ["Withdrawals", "withdrawals"],
    ["Payouts", "payment-history"],
  ],
  admin: [
    ["Operations", "admin-home"],
    ["Users", "manage-users"],
    ["Campaigns", "manage-campaigns"],
    ["Withdrawals", "withdrawal-requests"],
    ["Reports", "reports"],
  ],
};

type Notification = { _id: string; message: string; actionRoute: string; time: string; read: boolean };

const accent: Record<Role, string> = {
  supporter: "var(--supporter)",
  creator: "var(--creator)",
  admin: "var(--admin)",
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
    <div className="min-h-screen bg-[var(--surface)]" style={{ ["--role-accent" as string]: roleColor }}>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-black/20 bg-[var(--ink)] px-4 text-white">
        <button className="mr-3 grid h-10 w-10 place-items-center lg:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">
          {menu ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {BRAND.name}<span style={{ color: roleColor }}>.</span>
        </Link>
        <div className="ml-4 hidden rounded-none border border-white/15 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-300 sm:block">
          {ROLE_LABEL[user.role]} workspace
        </div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <span className="hidden items-center gap-2 text-sm sm:flex">
            <Coins size={16} />
            <b>{user.credits}</b>
            <span className="text-gray-400">credits</span>
          </span>
          <div ref={bellRef} className="relative">
            <button onClick={() => void markRead()} className="relative grid h-10 w-10 place-items-center hover:bg-white/10" aria-label="Notifications">
              <Bell size={18} />
              {notifications.some((n) => !n.read) && <i className="absolute right-2 top-2 h-2 w-2 bg-[var(--pk-blue)]" />}
            </button>
            {popup && (
              <div className="absolute right-0 top-12 w-80 border border-[var(--border)] bg-white text-[var(--ink)] shadow-[var(--shadow-modal)]">
                <p className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold">Notifications</p>
                <div className="max-h-80 overflow-auto">
                  {notifications.length ? (
                    notifications.map((n) => (
                      <Link key={n._id} href={n.actionRoute} className="block border-b border-[var(--border)] px-4 py-3 text-sm hover:bg-[var(--surface)]">
                        {n.message}
                        <time className="mt-1 block text-xs text-[var(--muted)]">{new Date(n.time).toLocaleString()}</time>
                      </Link>
                    ))
                  ) : (
                    <p className="p-5 text-sm text-[var(--muted)]">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden text-right md:block">
            <p className="text-[0.6875rem] uppercase tracking-wide text-gray-400">{ROLE_LABEL[user.role]}</p>
            <p className="text-sm font-semibold">{user.name}</p>
          </div>
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-9 w-9 object-cover" />
          ) : (
            <span className="grid h-9 w-9 place-items-center text-sm font-bold text-white" style={{ background: roleColor }}>{user.name[0]}</span>
          )}
        </div>
      </header>

      <aside className={cn(
        "fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-[var(--border)] bg-white transition-transform lg:translate-x-0",
        menu ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="space-y-1 p-3">
          {nav.map(([label, route]) => {
            const active = pathname.endsWith(route);
            return (
              <Link
                key={route}
                href={`/dashboard/${route}`}
                onClick={() => setMenu(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium",
                  active ? "text-white" : "text-[var(--ink-2)] hover:bg-[var(--surface)]"
                )}
                style={active ? { background: roleColor } : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <button onClick={() => void logout()} className="absolute bottom-5 left-3 flex h-11 items-center gap-2 px-4 text-sm font-medium hover:bg-[var(--surface)]">
          <LogOut size={16} /> Log out
        </button>
      </aside>

      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
        <footer className="border-t border-[var(--border)] bg-white px-5 py-4 text-center text-xs text-[var(--muted)]">
          {BRAND.name} · {ROLE_LABEL[user.role]} console
        </footer>
      </main>
    </div>
  );
}
