"use client";

import Link from "next/link";
import { Coins, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || BRAND.github;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-white/85 backdrop-blur-xl">
      <div className="container-pk flex h-[4.25rem] items-center gap-4">
        <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-[var(--ink)]">
          {BRAND.name}<span className="text-[var(--brand)]">.</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          <Link href="/explore" className="rounded-full px-4 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:bg-[var(--bg)] hover:text-[var(--brand)]">
            Explore
          </Link>
          <a href={github} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:bg-[var(--bg)] hover:text-[var(--brand)]">
            Join as Developer
          </a>
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {!loading && (user ? (
            <>
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 text-sm">
                <Coins size={16} className="text-[var(--brand)]" />
                <b>{user.credits}</b>
                <span className="text-[var(--muted)]">credits</span>
              </span>
              <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
              <button
                onClick={() => void logout()}
                aria-label="Log out"
                className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-white transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--brand)]">
                Sign in
              </Link>
              <Link href="/register"><Button size="sm">Get started</Button></Link>
            </>
          ))}
        </div>
        <button
          className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <div className={cn("border-t border-[var(--border)] bg-white px-5 py-4 md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-2 text-sm font-medium">
          <Link href="/explore" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg)]">Explore</Link>
          <a href={github} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg)]">Join as Developer</a>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg)]">Dashboard · {user.credits} credits</Link>
              <button onClick={() => void logout()} className="rounded-xl px-3 py-2.5 text-left hover:bg-[var(--bg)]">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg)]">Sign in</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg)]">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
