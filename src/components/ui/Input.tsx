import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)]",
        "shadow-sm outline-none placeholder:text-[var(--muted-soft)]",
        "transition-all duration-200",
        "hover:border-[var(--border-strong)]",
        "focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]",
        "disabled:bg-[var(--bg-soft)] disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
