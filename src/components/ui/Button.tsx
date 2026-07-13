import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "md" | "sm" | "lg";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0",
      "active:scale-[0.98]",
      size === "sm" && "h-10 min-w-[5.5rem] px-4 text-sm",
      size === "md" && "h-11 min-w-[7.5rem] px-5 text-sm",
      size === "lg" && "h-12 min-w-[9rem] px-6 text-[0.95rem]",
      variant === "primary" &&
        "bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(15,118,110,0.18)] hover:bg-[var(--brand-hover)] hover:shadow-[0_6px_18px_rgba(15,118,110,0.22)] hover:-translate-y-px",
      variant === "secondary" &&
        "border border-[var(--border-strong)] bg-white text-[var(--ink)] shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)]",
      variant === "soft" &&
        "bg-[var(--brand-soft)] text-[var(--brand-deep)] hover:bg-[#d7efeb]",
      variant === "ghost" &&
        "bg-transparent text-[var(--ink-soft)] hover:bg-black/[0.04] hover:text-[var(--ink)]",
      variant === "danger" &&
        "bg-[var(--danger)] text-white shadow-[0_4px_14px_rgba(220,38,38,0.16)] hover:brightness-95 hover:-translate-y-px",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
