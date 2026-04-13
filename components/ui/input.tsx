import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const fieldStyles =
  "w-full rounded-3xl border border-black/10 bg-white/85 px-4 py-3 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--primary-color)] focus:ring-4 focus:ring-[var(--ring)] sm:text-sm";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input suppressHydrationWarning className={cn(fieldStyles, className)} {...props} />;
}
