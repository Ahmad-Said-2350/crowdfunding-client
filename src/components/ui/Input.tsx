import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full border-0 border-b-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)] focus:border-[var(--pk-blue)] disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
