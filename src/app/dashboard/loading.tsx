export default function DashboardLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5">
      <div className="w-full max-w-md space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[var(--border)]" />
        <div className="h-4 w-full animate-pulse rounded bg-[var(--bg-soft)]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--bg-soft)]" />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-xl bg-[var(--bg-soft)]" />
          <div className="h-24 animate-pulse rounded-xl bg-[var(--bg-soft)]" />
        </div>
        <p className="pt-2 text-center text-sm text-[var(--muted)]">Loading workspace…</p>
      </div>
    </div>
  );
}
