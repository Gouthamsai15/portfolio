import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { PortfolioGeneratorForm } from "@/components/generator/portfolio-generator-form";
import { buttonStyles } from "@/components/ui/button";
import { hasGeneratorConfig } from "@/lib/portfolio";
import { getGeneratorTemplateCatalog } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const isConfigured = hasGeneratorConfig();
  const templates = await getGeneratorTemplateCatalog();

  return (
    <main className="site-shell flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-5 sm:gap-10 sm:px-6 sm:py-8">
        <header className="glass-panel flex flex-col gap-3 rounded-[1.75rem] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5">
          <div>
            <p className="font-display text-base font-semibold tracking-tight sm:text-lg">GSR ERP</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted sm:text-xs sm:tracking-[0.28em]">
              AI Resume Portfolio Generator
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            <Link href="/admin/login" className={buttonStyles({ variant: "secondary", size: "sm" }) + " w-full sm:w-auto"}>
              Admin Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-5 text-center sm:space-y-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-muted shadow-sm sm:px-4 sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
            Resume in, portfolio out
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="mx-auto max-w-4xl font-display text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
              Build a live portfolio website from a resume in seconds.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-muted sm:text-lg sm:leading-8">
              Upload a PDF, choose a template and colors, and publish instantly on your own{" "}
              <code className="rounded bg-white/70 px-2 py-1 font-mono text-xs text-slate-900 sm:text-sm">
                /username
              </code>{" "}
              route.
            </p>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="#generate" className={buttonStyles({ size: "lg" }) + " w-full sm:w-auto"}>
              Start Generating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/login" className={buttonStyles({ variant: "secondary", size: "lg" }) + " w-full sm:w-auto"}>
              Admin Login
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Upload resume", "Pick template", "Get live link"].map((step) => (
              <div key={step} className="glass-panel rounded-2xl px-4 py-3 text-xs font-medium text-slate-700 sm:py-4 sm:text-sm">
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
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Simple and direct
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Fill the form, upload the PDF, and generate the portfolio.
            </p>
          </div>
          <PortfolioGeneratorForm templates={templates} />
        </section>
      </div>
    </main>
  );
}
