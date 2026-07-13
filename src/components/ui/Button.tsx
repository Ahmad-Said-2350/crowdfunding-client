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
      "inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold whitespace-nowrap",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0",
      "active:scale-[0.98]",
      size === "sm" && "h-10 min-w-[5.5rem] px-4 text-sm",
      size === "md" && "h-12 min-w-[8rem] px-5 text-sm",
      size === "lg" && "h-14 min-w-[9rem] px-7 text-base",
      variant === "primary" &&
        "bg-[var(--brand)] text-white shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:bg-[var(--brand-hover)] hover:shadow-[0_10px_24px_rgba(15,118,110,0.32)] hover:-translate-y-0.5",
      variant === "secondary" &&
        "border border-[var(--border-strong)] bg-white text-[var(--ink)] shadow-sm hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)]",
      variant === "soft" &&
        "bg-[var(--brand-soft)] text-[var(--brand-deep)] hover:bg-[#d7efeb]",
      variant === "ghost" &&
        "bg-transparent text-[var(--ink-soft)] hover:bg-black/[0.04] hover:text-[var(--ink)]",
      variant === "danger" &&
        "bg-[var(--danger)] text-white shadow-[0_8px_20px_rgba(220,38,38,0.2)] hover:brightness-95 hover:-translate-y-0.5",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
