import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-muted">{description}</p>
    </div>
  );
}
