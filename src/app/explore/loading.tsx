export default function ExploreLoading() {
  return (
    <div className="container-pk section-space">
      <div className="h-8 w-48 animate-pulse rounded bg-[var(--border)]" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            <div className="aspect-[16/10] animate-pulse bg-[var(--bg-soft)]" />
            <div className="space-y-2 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--bg-soft)]" />
              <div className="h-3 w-full animate-pulse rounded bg-[var(--bg-soft)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
