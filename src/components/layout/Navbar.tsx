"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineCodeBracketSquare,
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineUserPlus,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || BRAND.github;

  const menuItem =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-[var(--ink-soft)] transition hover:bg-[var(--bg)] hover:text-[var(--brand)]";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-white/85 backdrop-blur-xl">
      <div className="container-pk flex h-16 items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2.5 text-[1.15rem] font-bold tracking-tight text-[var(--ink)]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
            <span className="grid grid-cols-2 gap-0.5">
              <i className="h-1.5 w-1.5 rounded-[2px] bg-white" />
              <i className="h-1.5 w-1.5 rounded-[2px] bg-white/70" />
              <i className="h-1.5 w-1.5 rounded-[2px] bg-white/70" />
              <i className="h-1.5 w-1.5 rounded-[2px] bg-white" />
            </span>
          </span>
          {BRAND.name}
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          <Link href="/explore" className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:bg-[var(--bg)] hover:text-[var(--brand)]">
            Explore
          </Link>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:bg-[var(--bg)] hover:text-[var(--brand)]"
          >
            <HiOutlineCodeBracketSquare size={16} />
            Join as Developer
          </a>
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          {!loading && (user ? (
            <>
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm">
                <HiOutlineCurrencyDollar size={16} className="text-[var(--brand)]" />
                <b>{user.credits}</b>
                <span className="text-[var(--muted)]">credits</span>
              </span>
              <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
              <button
                onClick={() => void logout()}
                aria-label="Log out"
                className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-white transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <HiOutlineArrowRightOnRectangle size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--brand)]">
                Sign in
              </Link>
              <Link href="/register"><Button size="sm">Get started</Button></Link>
            </>
          ))}
        </div>

        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
        </button>
      </div>

      <div className={cn("border-t border-[var(--border)] bg-white px-5 py-3 md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-0.5 text-sm font-medium">
          <Link href="/" onClick={() => setOpen(false)} className={menuItem}>
            <HiOutlineHome size={18} className="text-[var(--brand)]" /> Home
          </Link>
          <Link href="/explore" onClick={() => setOpen(false)} className={menuItem}>
            <HiOutlineMagnifyingGlass size={18} className="text-[var(--brand)]" /> Explore
          </Link>
          <a href={github} target="_blank" rel="noreferrer" className={menuItem}>
            <HiOutlineCodeBracketSquare size={18} className="text-[var(--brand)]" /> Join as Developer
          </a>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className={menuItem}>
                <HiOutlineSquares2X2 size={18} className="text-[var(--brand)]" />
                Dashboard · {user.credits} credits
              </Link>
              <button onClick={() => void logout()} className={`${menuItem} w-full text-left`}>
                <HiOutlineArrowRightOnRectangle size={18} className="text-[var(--brand)]" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className={menuItem}>
                <HiOutlineArrowRightOnRectangle size={18} className="text-[var(--brand)]" /> Sign in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className={menuItem}>
                <HiOutlineUserPlus size={18} className="text-[var(--brand)]" /> Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
