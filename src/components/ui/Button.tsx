import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "tertiary";
type Size = "md" | "sm";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--pk-blue)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      size === "md" ? "h-11 min-w-[7.5rem] px-5 text-sm" : "h-9 min-w-[5.5rem] px-3 text-xs",
      {
        "bg-[var(--pk-blue)] text-white hover:bg-[var(--pk-blue-hover)] active:bg-[var(--pk-blue-active)]": variant === "primary",
        "border border-[var(--ink)] bg-white text-[var(--ink)] hover:bg-[var(--surface)]": variant === "secondary",
        "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)]": variant === "tertiary",
        "text-[var(--ink)] hover:bg-[var(--surface)]": variant === "ghost",
        "bg-[var(--danger)] text-white hover:brightness-95": variant === "danger",
      },
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
