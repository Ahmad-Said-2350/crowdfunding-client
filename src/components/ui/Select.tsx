import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full appearance-none rounded-[12px] border border-[var(--border)] bg-white px-4 text-sm text-[var(--ink)]",
        "shadow-sm outline-none transition-all duration-200",
        "hover:border-[var(--border-strong)]",
        "focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
