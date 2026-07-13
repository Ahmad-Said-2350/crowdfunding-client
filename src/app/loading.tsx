export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-5">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
        <p className="mt-3 text-sm text-[var(--muted)]">Loading…</p>
      </div>
    </div>
  );
}
