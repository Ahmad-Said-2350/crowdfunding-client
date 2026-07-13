import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button ref={ref} className={cn("inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", {
      "bg-[var(--ibm-blue)] text-white hover:bg-[var(--ibm-blue-hover)]": variant === "primary",
      "border border-[var(--ink)] bg-white text-[var(--ink)] hover:bg-[var(--surface)]": variant === "secondary",
      "text-[var(--ink)] hover:bg-[var(--surface)]": variant === "ghost",
      "bg-red-700 text-white hover:bg-red-800": variant === "danger",
    }, className)} {...props} />
  )
);
Button.displayName = "Button";
