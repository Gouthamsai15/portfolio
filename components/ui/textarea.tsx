import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/input";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldStyles, "min-h-28 resize-none", className)} {...props} />;
}
