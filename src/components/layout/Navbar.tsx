"use client";

import Link from "next/link";
import { Coins, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Ahmad-Said-2350/crowdfunding-client";
  return <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center px-5">
      <Link href="/" className="mr-10 font-serif text-2xl font-bold tracking-tight">Fundora<span className="text-[var(--ibm-blue)]">.</span></Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/explore" className="hover:text-[var(--ibm-blue)]">Explore</Link>
        <a href={github} target="_blank" rel="noreferrer" className="hidden hover:text-[var(--ibm-blue)] sm:block">Join as Developer</a>
      </nav>
      <div className="ml-auto flex items-center gap-3 text-sm">
        {!loading && (user ? <>
          <span className="hidden items-center gap-1 text-[var(--muted)] md:flex"><Coins size={16} /> {user.credits}</span>
          <Link href="/dashboard" className="font-semibold text-[var(--ibm-blue)]">Dashboard</Link>
          <span className="hidden items-center gap-2 lg:flex"><UserRound size={18} />{user.name}</span>
          <button onClick={() => void logout()} aria-label="Log out" className="p-2 hover:bg-[var(--surface)]"><LogOut size={18} /></button>
        </> : <>
          <Link href="/login">Login</Link>
          <Link href="/register" className="bg-[var(--ibm-blue)] px-4 py-2 font-semibold text-white">Register</Link>
        </>)}
      </div>
    </div>
  </header>;
}
