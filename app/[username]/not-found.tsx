import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function PortfolioNotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
        Portfolio Not Found
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-950">
        This route is not published yet.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
        The portfolio may have been removed or the username may be incorrect. Generate a new one
        from the main dashboard.
      </p>
      <Link href="/" className={buttonStyles({ size: "lg" }) + " mt-8"}>
        Back to Generator
      </Link>
    </div>
  );
}
