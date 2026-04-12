import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
        The page you opened does not exist, or the portfolio route has not been published yet.
      </p>
      <Link href="/" className={buttonStyles({ size: "lg" }) + " mt-8"}>
        Back to Home
      </Link>
    </main>
  );
}
