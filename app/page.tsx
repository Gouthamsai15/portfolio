import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { PortfolioGeneratorForm } from "@/components/generator/portfolio-generator-form";
import { buttonStyles } from "@/components/ui/button";
import { hasGeneratorConfig } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export default function Home() {
  const isConfigured = hasGeneratorConfig();

  return (
    <main className="site-shell flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-8 sm:px-8">
        <header className="glass-panel flex items-center justify-between rounded-full px-5 py-4">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">GSR ERP</p>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">
              AI Resume Portfolio Generator
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex",
                isConfigured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800",
              )}
            >
              {isConfigured ? "Generator Ready" : "Setup Required"}
            </span>
            <Link href="/admin/login" className={buttonStyles({ variant: "secondary", size: "sm" })}>
              Admin Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-muted shadow-sm">
            <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
            Resume in, portfolio out
          </div>
          <div className="space-y-4">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl">
              Build a live portfolio website from a resume in seconds.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted">
              Upload a PDF, choose a template and colors, and publish instantly on your own{" "}
              <code className="rounded bg-white/70 px-2 py-1 font-mono text-sm text-slate-900">
                /username
              </code>{" "}
              route.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="#generate" className={buttonStyles({ size: "lg" })}>
              Start Generating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/login" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              Admin Login
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Upload resume", "Pick template", "Get live link"].map((step) => (
              <div key={step} className="glass-panel rounded-2xl px-4 py-4 text-sm font-medium text-slate-700">
                {step}
              </div>
            ))}
          </div>
        </section>

        <section id="generate" className="space-y-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
              Portfolio Builder
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Simple and direct
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Fill the form, upload the PDF, and generate the portfolio.
            </p>
          </div>
          <PortfolioGeneratorForm />
        </section>
      </div>
    </main>
  );
}
