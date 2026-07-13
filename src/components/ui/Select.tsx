import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => <select ref={ref} className={cn("h-11 w-full border-b-2 border-[var(--muted)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--ibm-blue)]", className)} {...props}>{children}</select>
);
Select.displayName = "Select";
