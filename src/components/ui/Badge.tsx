import { cn } from "@/lib/utils";

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "blue"; className?: string }) {
  return <span className={cn("inline-flex px-2.5 py-1 text-xs font-semibold capitalize", {
    "bg-gray-200 text-gray-800": tone === "neutral", "bg-green-100 text-green-800": tone === "success",
    "bg-amber-100 text-amber-900": tone === "warning", "bg-red-100 text-red-800": tone === "danger",
    "bg-blue-100 text-blue-800": tone === "blue",
  }, className)}>{children}</span>;
}
