import { HiOutlineInbox } from "react-icons/hi2";

export function EmptyState({ title = "Nothing here yet", description }: { title?: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
      <HiOutlineInbox size={28} strokeWidth={1.5} className="mx-auto text-[var(--brand)]" />
      <h3 className="mt-4 text-base font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
