export function StatCard({
  label,
  value,
  detail,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  detail?: string;
  accent?: "blue" | "creator" | "admin";
}) {
  const border =
    accent === "creator" ? "border-[var(--creator)]" : accent === "admin" ? "border-[var(--admin)]" : "border-[var(--pk-blue)]";
  return (
    <div className={`border-t-4 ${border} bg-white p-6 pk-panel`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">{value}</p>
      {detail && <p className="mt-2 text-xs text-[var(--muted)]">{detail}</p>}
    </div>
  );
}
