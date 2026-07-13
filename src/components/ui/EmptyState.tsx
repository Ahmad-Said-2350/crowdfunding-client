import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description }: { title?: string; description: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
        <Inbox size={24} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
