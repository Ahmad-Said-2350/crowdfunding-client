import Link from "next/link";
import { BRAND } from "@/lib/types";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--ink)] text-white">
      <div className="container-pk grid gap-10 py-14 md:grid-cols-[1.5fr_1fr]">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight">
            {BRAND.name}<span className="text-teal-300">.</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            {BRAND.tagline} Transparent credits, clear approvals, and measurable outcomes.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4 md:justify-end">
          {[
            ["LinkedIn", "https://www.linkedin.com/in/ahmad-said-2350"],
            ["Facebook", "https://www.facebook.com/ahmad.said.2350"],
            ["GitHub", "https://github.com/Ahmad-Said-2350"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {BRAND.name}. Built for accountable fundraising.
      </div>
    </footer>
  );
}
