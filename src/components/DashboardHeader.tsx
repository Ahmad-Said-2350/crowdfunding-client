import { BRAND } from "@/lib/types";

export function DashboardHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8 border-b border-[var(--border)] pb-6">
      <p className="pk-kicker">{eyebrow}</p>
      <h1 className="pk-title mt-2">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      <p className="mt-3 text-[0.6875rem] font-medium uppercase tracking-wide text-[var(--muted-2)]">{BRAND.name}</p>
    </header>
  );
}
