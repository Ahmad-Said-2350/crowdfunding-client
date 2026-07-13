export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)]">{value}</p>
      {detail && <p className="mt-2 text-xs text-[var(--muted)]">{detail}</p>}
    </div>
  );
}
