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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="container-pk flex h-16 items-center gap-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-[var(--ink)]">
          {BRAND.name}<span className="text-[var(--pk-blue)]">.</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/explore" className="text-[var(--ink-2)] hover:text-[var(--pk-blue)]">Explore</Link>
          <a href={github} target="_blank" rel="noreferrer" className="text-[var(--ink-2)] hover:text-[var(--pk-blue)]">Join as Developer</a>
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {!loading && (user ? (
            <>
              <span className="inline-flex h-11 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm">
                <Coins size={16} className="text-[var(--pk-blue)]" />
                <span className="font-semibold">{user.credits}</span>
                <span className="text-[var(--muted)]">credits</span>
              </span>
              <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
              <button onClick={() => void logout()} aria-label="Log out" className="grid h-11 w-11 place-items-center border border-[var(--border)] hover:bg-[var(--surface)]">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-[var(--pk-blue)]">Sign in</Link>
              <Link href="/register"><Button size="sm">Create account</Button></Link>
            </>
          ))}
        </div>
        <button className="ml-auto grid h-11 w-11 place-items-center border border-[var(--border)] md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <div className={cn("border-t border-[var(--border)] bg-white px-5 py-4 md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-3 text-sm font-medium">
          <Link href="/explore" onClick={() => setOpen(false)}>Explore</Link>
          <a href={github} target="_blank" rel="noreferrer">Join as Developer</a>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard · {user.credits} credits</Link>
              <button onClick={() => void logout()} className="text-left">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/register" onClick={() => setOpen(false)}>Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
