import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Globe2, Upload } from "lucide-react";
import { PortfolioGeneratorForm } from "@/components/generator/portfolio-generator-form";
import { buttonStyles } from "@/components/ui/button";
import { getGeneratorTemplateCatalog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const templates = await getGeneratorTemplateCatalog();

  return (
    <main className="site-shell flex-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:gap-10 sm:px-6 sm:py-8">
        <header className="glass-panel flex flex-col gap-3 rounded-[1.5rem] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5">
          <div>
            <p className="font-display text-base font-semibold tracking-tight sm:text-lg">GSR Portfolio Builder</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted sm:text-xs sm:tracking-[0.28em]">
              Resume To Portfolio Website
            </p>
          </div>
          <Link href="#generate" className={buttonStyles({ size: "sm" }) + " w-full sm:w-auto"}>
            Create Your Portfolio
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5 text-center lg:text-left sm:space-y-6">
            <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-center text-xs text-muted shadow-sm sm:px-4 sm:text-sm lg:justify-start">
              <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
              Fast, simple, and ready to share
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
                Turn your resume into a clean portfolio website your customers can trust.
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-muted sm:text-lg sm:leading-8 lg:mx-0">
                Upload your PDF, choose a design, and get a live portfolio page in minutes. No
                complicated setup, no long forms, and no technical steps.
              </p>
            </div>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <Link href="#generate" className={buttonStyles({ size: "lg" }) + " w-full sm:w-auto"}>
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-3">
              {[
                { step: "Upload your resume", icon: Upload },
                { step: "Choose your style", icon: BadgeCheck },
                { step: "Share your live link", icon: Globe2 },
              ].map(({ step, icon: Icon }) => (
                <div
                  key={step}
                  className="glass-panel min-w-[220px] shrink-0 rounded-2xl px-4 py-4 text-center sm:min-w-0 sm:text-left"
                >
                  <Icon className="h-5 w-5 text-[var(--primary-color)]" />
                  <p className="mt-3 text-sm font-medium text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden glass-panel rounded-[2rem] p-5 sm:p-6 lg:block">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary-color)]">
                  Why customers like it
                </p>
                <p className="mt-3 font-display text-2xl font-semibold text-slate-950">
                  Clear and easy
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  A simple workflow that helps anyone publish a professional page without extra help.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  Publishing speed
                </p>
                <p className="mt-3 flex items-center gap-2 font-display text-xl font-semibold sm:text-2xl">
                  <Clock3 className="h-6 w-6 text-[var(--secondary-color)]" />
                  Minutes, not hours
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Upload once, generate once, and open your personal route instantly.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "No sign-up needed for portfolio creation",
                "Public profile available on your own /username page",
                "Professional templates ready for resumes and personal branding",
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-black/8 bg-white/65 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-3 sm:gap-4">
          {[
            {
              title: "Simple to begin",
              description: "Just add your name, choose a username, and upload your resume PDF.",
            },
            {
              title: "Made for sharing",
              description: "Each portfolio gets its own public URL so clients and employers can open it easily.",
            },
            {
              title: "Designed to look polished",
              description: "Use a ready-made template so the final page feels professional from the start.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-panel w-[calc(82vw-1rem)] min-w-[220px] max-w-[260px] shrink-0 snap-start rounded-[1.2rem] p-4 sm:min-w-0 sm:max-w-none sm:rounded-[1.75rem] sm:p-6"
            >
              <p className="font-display text-lg font-semibold text-slate-950 sm:text-xl">{item.title}</p>
              <p className="mt-2 text-xs leading-5 text-muted sm:mt-3 sm:text-sm sm:leading-6">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="space-y-5 text-center sm:space-y-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-muted shadow-sm sm:px-4 sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
            Resume in, portfolio out
          </div>
          <div className="space-y-3">
            <h2 className="mx-auto max-w-3xl font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your portfolio goes live on a personal route
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
              Once generated, the site is published instantly on your own{" "}
              <code className="rounded bg-white/70 px-2 py-1 font-mono text-xs text-slate-900 sm:text-sm">
                /username
              </code>{" "}
              page so visitors can access it quickly.
            </p>
          </div>
        </section>

        <section id="generate" className="space-y-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-color)]">
              Portfolio Builder
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Start with your resume
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Fill in the details below, upload the PDF, and generate a customer-ready portfolio page.
            </p>
          </div>
          <PortfolioGeneratorForm templates={templates} />
        </section>
      </div>
    </main>
  );
}
