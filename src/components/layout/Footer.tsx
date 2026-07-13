import Link from "next/link";
import { BRAND } from "@/lib/types";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--ink)] text-white">
      <div className="container-pk grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            {BRAND.name}<span className="text-[var(--pk-blue)]">.</span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">{BRAND.tagline} Transparent credits, clear approvals, measurable outcomes.</p>
        </div>
        <div className="flex flex-wrap items-end gap-6 md:justify-end">
          <a aria-label="LinkedIn" href="https://www.linkedin.com/in/ahmad-said-2350" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 hover:text-white">LinkedIn</a>
          <a aria-label="Facebook" href="https://www.facebook.com/ahmad.said.2350" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 hover:text-white">Facebook</a>
          <a aria-label="GitHub" href="https://github.com/Ahmad-Said-2350" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 hover:text-white">GitHub</a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {BRAND.name}. Built for accountable fundraising.
      </div>
    </footer>
  );
}
