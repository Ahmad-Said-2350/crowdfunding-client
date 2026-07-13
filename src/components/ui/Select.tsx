import { forwardRef, type SelectHTMLAttributes } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="pk-select-wrap">
      <select ref={ref} className={cn(className)} {...props}>
        {children}
      </select>
      <HiOutlineChevronDown size={16} className="pk-select-icon" />
    </div>
  )
);
Select.displayName = "Select";
