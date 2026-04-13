"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, ExternalLink, FileCode2, LoaderCircle, Search, Trash2, WandSparkles } from "lucide-react";
import type { AdminRow } from "@/lib/queries";
import {
  TEMPLATE_CATALOG,
  type CustomTemplateRecord,
} from "@/lib/portfolio";
import { formatDate } from "@/lib/utils";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getTemplateLabel(templateId: string, templates: CustomTemplateRecord[]) {
  const builtIn = TEMPLATE_CATALOG.find((entry) => entry.id === templateId);

  if (builtIn) {
    return builtIn.name;
  }

  const custom = templates.find((entry) => `custom:${entry.slug}` === templateId);
  return custom?.name ?? templateId;
}

export function AdminDashboard({
  initialRows,
  total,
  initialTemplates,
}: {
  initialRows: AdminRow[];
  total: number;
  initialTemplates: CustomTemplateRecord[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isPortfolioListOpen, setIsPortfolioListOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filteredRows = rows.filter((row) => {
    const haystack = `${row.name} ${row.username} ${getTemplateLabel(row.template, templates)}`.toLowerCase();
    return haystack.includes(deferredQuery.trim().toLowerCase());
  });

  async function handleDeletePortfolio(id: string, username: string) {
    const confirmed = window.confirm(`Delete ${username}'s portfolio? This removes the live route.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    const response = await fetch(`/api/admin/portfolios/${id}`, {
      method: "DELETE",
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to delete this portfolio.");
      setDeletingId(null);
      return;
    }

    startTransition(() => {
      setRows((current) => current.filter((row) => row.id !== id));
    });
    setDeletingId(null);
  }

  async function handleUploadTemplate(formData: FormData) {
    setUploadError("");
    setUploadSuccess("");
    setIsUploadingTemplate(true);

    const response = await fetch("/api/admin/templates", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      template?: CustomTemplateRecord;
    };

    if (!response.ok || !payload.template) {
      setUploadError(payload.error ?? "Unable to upload this HTML template.");
      setIsUploadingTemplate(false);
      return;
    }

    startTransition(() => {
      setTemplates((current) => [payload.template!, ...current]);
    });
    setUploadSuccess(`Template "${payload.template.name}" is now available in Choose your template.`);
    setIsUploadingTemplate(false);
  }

  function handleUploadTemplateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUploadingTemplate) {
      return;
    }

    void handleUploadTemplate(new FormData(event.currentTarget));
  }

  async function handleDeleteTemplate(template: CustomTemplateRecord) {
    const confirmed = window.confirm(`Delete HTML template "${template.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingTemplateId(template.id);
    setUploadError("");
    setUploadSuccess("");

    const response = await fetch(`/api/admin/templates/${template.id}`, {
      method: "DELETE",
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setUploadError(payload.error ?? "Unable to delete this HTML template.");
      setDeletingTemplateId(null);
      return;
    }

    startTransition(() => {
      setTemplates((current) => current.filter((entry) => entry.id !== template.id));
    });
    setDeletingTemplateId(null);
  }

  return (
    <div className="space-y-8">
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <article className="glass-panel w-[calc(50vw-1.25rem)] min-w-[140px] max-w-[168px] shrink-0 snap-start rounded-[1rem] p-3 sm:min-w-0 sm:max-w-none sm:rounded-[1.75rem] sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--primary-color)] sm:text-xs sm:tracking-[0.3em]">Total</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:mt-3 sm:text-4xl">{rows.length || total}</p>
          <p className="mt-1 text-xs leading-5 text-muted sm:mt-2 sm:text-sm">Published portfolio routes tracked in Supabase.</p>
        </article>
        <article className="glass-panel w-[calc(50vw-1.25rem)] min-w-[140px] max-w-[168px] shrink-0 snap-start rounded-[1rem] p-3 sm:min-w-0 sm:max-w-none sm:rounded-[1.75rem] sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--primary-color)] sm:text-xs sm:tracking-[0.3em]">Templates</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:mt-3 sm:text-4xl">
            {new Set(rows.map((row) => row.template)).size}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted sm:mt-2 sm:text-sm">Distinct built-in and uploaded templates currently in use.</p>
        </article>
        <article className="glass-panel w-[calc(50vw-1.25rem)] min-w-[140px] max-w-[168px] shrink-0 snap-start rounded-[1rem] p-3 sm:min-w-0 sm:max-w-none sm:rounded-[1.75rem] sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--primary-color)] sm:text-xs sm:tracking-[0.3em]">HTML Library</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:mt-3 sm:text-4xl">{templates.length}</p>
          <p className="mt-1 text-xs leading-5 text-muted sm:mt-2 sm:text-sm">Custom HTML templates available.</p>
        </article>
      </div>

      <section className="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-7">
        <div>
          <div>
            <p className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">Upload HTML Templates</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload any portfolio HTML file. AI will clean sample data from it and convert it
              into a resume-driven template automatically.
            </p>

            <form onSubmit={handleUploadTemplateSubmit} className="mt-6 space-y-4 sm:max-w-xl">
              <label className="space-y-2 text-sm font-medium text-slate-800">
                Template Name
                <Input name="name" required placeholder="Warm Editorial Portfolio" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-800">
                HTML File
                <Input
                  name="htmlFile"
                  type="file"
                  accept=".html,text/html"
                  required
                  className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>

              {uploadError ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {uploadError}
                </p>
              ) : null}

              {uploadSuccess ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {uploadSuccess}
                </p>
              ) : null}

              {isUploadingTemplate ? (
                <div
                  className="rounded-[1.5rem] border border-[var(--primary-color)]/20 bg-[var(--primary-color)]/6 px-4 py-4"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-white/80 p-2 shadow-sm">
                      <LoaderCircle className="h-5 w-5 animate-spin text-[var(--primary-color)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">Uploading HTML template</p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        Please wait while we upload the file and prepare it for the generator.
                      </p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                        <div className="h-full w-2/5 animate-pulse rounded-full bg-[var(--primary-color)]" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isUploadingTemplate}>
                {isUploadingTemplate ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Uploading Template...
                  </>
                ) : (
                  <>
                    <WandSparkles className="h-4 w-4" />
                    Upload HTML Template
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">HTML Template Library</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              These custom templates are shown to customers under Choose your template.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="w-fit rounded-full border border-black/8 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              {templates.length} uploaded
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setIsTemplateLibraryOpen((current) => !current)}
            >
              {isTemplateLibraryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isTemplateLibraryOpen ? "Close" : "Open"}
            </Button>
          </div>
        </div>

        {isTemplateLibraryOpen ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {templates.length ? (
              templates.map((template) => (
                <article key={template.id} className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl font-semibold text-slate-950">{template.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">custom:{template.slug}</p>
                    </div>
                    <FileCode2 className="h-5 w-5 text-[var(--primary-color)]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{template.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.highlights.map((item) => (
                      <span key={item} className="rounded-full border border-black/8 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">Added {formatDate(template.created_at)}</p>
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={deletingTemplateId === template.id}
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      {deletingTemplateId === template.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white/60 px-5 py-12 text-center text-sm text-muted md:col-span-2">
                No custom HTML templates uploaded yet.
              </div>
            )}
          </div>
        ) : null}
      </section>

      <section className="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">Generated Portfolios</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Search by name, username, or template and manage live routes from one place.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setIsPortfolioListOpen((current) => !current)}
          >
            {isPortfolioListOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isPortfolioListOpen ? "Close" : "Open"}
          </Button>
        </div>

        {isPortfolioListOpen ? (
          <>
            <label className="relative mt-5 block w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search portfolios..."
                className="pl-11"
              />
            </label>

            {error ? (
              <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white/80">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.9fr_1fr] gap-4 border-b border-black/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 md:grid">
                <span>Name</span>
                <span>Username</span>
                <span>Template</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-black/6">
                {filteredRows.length ? (
                  filteredRows.map((row) => {
                    const templateLabel = getTemplateLabel(row.template, templates);

                    return (
                      <div
                        key={row.id}
                        className="grid gap-3 px-4 py-4 sm:px-5 sm:py-5 md:grid-cols-[1.2fr_1fr_1fr_0.9fr_1fr] md:items-center"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{row.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400 md:hidden">
                            {templateLabel}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 break-all">/{row.username}</p>
                        <p className="hidden text-sm text-slate-600 md:block">{templateLabel}</p>
                        <p className="text-sm text-slate-600">{formatDate(row.created_at)}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          <Link
                            href={`/${row.username}`}
                            target="_blank"
                            className={buttonStyles({ variant: "secondary", size: "sm" }) + " w-full sm:w-auto"}
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="w-full sm:w-auto"
                            disabled={deletingId === row.id}
                            onClick={() => handleDeletePortfolio(row.id, row.username)}
                          >
                            {deletingId === row.id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-12 text-center text-sm text-muted">
                    No portfolios match your search yet.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
