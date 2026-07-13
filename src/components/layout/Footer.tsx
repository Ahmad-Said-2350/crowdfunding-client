import Link from "next/link";
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { BRAND } from "@/lib/types";

export function Footer() {
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || BRAND.github;

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white">
      <div className="container-pk grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight">
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
          <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--muted)]">
            {BRAND.tagline} Transparent credits, clear approvals, and measurable outcomes.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: "https://www.linkedin.com/in/ahmad-said-2350", icon: FaLinkedinIn, label: "LinkedIn" },
              { href: "https://www.facebook.com/ahmad.said.2350", icon: FaFacebookF, label: "Facebook" },
              { href: "https://github.com/Ahmad-Said-2350", icon: FaGithub, label: "GitHub" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-lg text-[var(--ink-soft)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--brand)]"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--ink)]">Platform</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li><Link href="/explore" className="transition hover:text-[var(--brand)]">Explore campaigns</Link></li>
            <li><Link href="/register" className="transition hover:text-[var(--brand)]">Create account</Link></li>
            <li><Link href="/login" className="transition hover:text-[var(--brand)]">Sign in</Link></li>
            <li><a href={github} target="_blank" rel="noreferrer" className="transition hover:text-[var(--brand)]">Join as Developer</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--ink)]">Categories</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {["Environment", "Community", "Education", "Technology"].map((c) => (
              <li key={c}>
                <Link href={`/explore?category=${encodeURIComponent(c)}`} className="transition hover:text-[var(--brand)]">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--ink)]">Contact</h3>
          <ul className="mt-4 space-y-4 text-sm text-[var(--muted)]">
            <li className="flex gap-3">
              <HiOutlineMapPin size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex gap-3">
              <HiOutlineEnvelope size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
              <a href="mailto:hello@pledgekit.app" className="hover:text-[var(--brand)]">hello@pledgekit.app</a>
            </li>
            <li className="flex gap-3">
              <HiOutlinePhone size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
              <span>+880 1700-000000</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-pk flex flex-col gap-2 py-5 text-xs text-[var(--muted-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. Built for accountable fundraising.</p>
          <p>Credits · Approvals · Transparent outcomes</p>
        </div>
      </div>
    </footer>
  );
}
