import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-[var(--surface)] text-[var(--ink)]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  blue: "bg-[var(--pk-blue-soft)] text-[var(--pk-blue)]",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex h-6 items-center px-2 text-[0.6875rem] font-semibold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
