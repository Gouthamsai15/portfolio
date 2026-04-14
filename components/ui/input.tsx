import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const fieldStyles = "ui-field";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input suppressHydrationWarning className={cn(fieldStyles, className)} {...props} />;
}
