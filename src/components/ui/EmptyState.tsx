import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description }: { title?: string; description: string }) {
  return (
    <div className="border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
      <Inbox className="mx-auto mb-4 text-[var(--muted)]" size={32} strokeWidth={1.5} />
      <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
