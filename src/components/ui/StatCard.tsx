export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return <div className="border-t-4 border-[var(--ibm-blue)] bg-white p-6 shadow-sm">
    <p className="text-sm text-[var(--muted)]">{label}</p>
    <p className="mt-2 text-3xl font-semibold">{value}</p>
    {detail && <p className="mt-2 text-xs text-[var(--muted)]">{detail}</p>}
  </div>;
}
