import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn("h-11 w-full border-b-2 border-[var(--muted)] bg-[var(--surface)] px-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-[var(--ibm-blue)]", className)} {...props} />
);
Input.displayName = "Input";
