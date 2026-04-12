import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-slate-950 text-white shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-slate-800 disabled:bg-slate-400",
  secondary:
    "border border-black/10 bg-white/75 text-slate-900 hover:-translate-y-0.5 hover:bg-white disabled:bg-white/60",
  ghost: "text-slate-700 hover:bg-black/5",
  danger:
    "bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:-translate-y-0.5 hover:bg-rose-500 disabled:bg-rose-300",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
}: {
  variant?: Variant;
  size?: Size;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none",
    sizeMap[size],
    variantMap[variant],
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
