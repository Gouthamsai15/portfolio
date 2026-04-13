"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type TemplateCatalogItem, type TemplateId } from "@/lib/portfolio";
import { cn, normalizeUsername } from "@/lib/utils";

const defaultPrimaryColor = "#0f766e";
const defaultSecondaryColor = "#f97316";

export function PortfolioGeneratorForm({
  templates,
}: {
  templates: TemplateCatalogItem[];
}) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    templates[0]?.id ?? "modern-developer-dark",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState("");
  const [usernameHint, setUsernameHint] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setSuccessUrl("");
    setIsSubmitting(true);

    formData.set("template", selectedTemplate);
    formData.set("colorPrimary", defaultPrimaryColor);
    formData.set("colorSecondary", defaultSecondaryColor);

    const response = await fetch("/api/portfolios", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      url?: string;
    };

    if (!response.ok || !payload.url) {
      setError(payload.error ?? "Portfolio generation failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSuccessUrl(payload.url);
    startTransition(() => {
      router.push(payload.url!);
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        action={handleSubmit}
        className="glass-panel space-y-5 rounded-[1.75rem] p-4 sm:space-y-6 sm:rounded-[2rem] sm:p-7"
      >
        <div className="space-y-2">
          <p className="font-display text-xl font-semibold text-slate-950 sm:text-2xl">Create portfolio</p>
          <p className="text-xs leading-6 text-muted sm:text-sm">
            No signup required. Just upload the resume and generate the site.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-800">
            Full Name
            <Input name="fullName" required placeholder="Goutham Raj" autoComplete="name" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-800">
            Username
            <Input
              name="username"
              required
              placeholder="goutham"
              autoComplete="username"
              onChange={(event) => setUsernameHint(normalizeUsername(event.target.value))}
            />
          </label>
        </div>

        <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-4 sm:rounded-3xl">
          <label className="space-y-3 text-sm font-medium text-slate-800">
            Upload Resume (PDF)
            <Input
              name="resume"
              type="file"
              accept="application/pdf"
              required
              className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            Public portfolio route: <span className="font-semibold text-slate-900">/{usernameHint || "username"}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-slate-950 sm:text-xl">Choose your template</h3>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
              {templates.length} styles
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {templates.map((template) => {
              const isActive = template.id === selectedTemplate;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    "rounded-[1.5rem] border px-4 py-4 text-left sm:rounded-3xl",
                    isActive
                      ? "border-[var(--primary-color)] bg-slate-950 text-white shadow-xl shadow-slate-950/10"
                      : "border-black/8 bg-white/72 text-slate-900 hover:border-black/18",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-base font-semibold sm:text-lg">{template.name}</p>
                      <p className={cn("mt-1 text-sm leading-6", isActive ? "text-white/72" : "text-muted")}>
                        {template.description}
                      </p>
                    </div>
                    {isActive ? <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--secondary-color)]" /> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 sm:text-sm"
            >
              {error}
            </motion.p>
          ) : null}
          {successUrl ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 sm:text-sm"
            >
              Portfolio created at{" "}
              <Link href={successUrl} className="font-semibold underline underline-offset-4">
                {successUrl}
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Generating Portfolio...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Portfolio
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
}
