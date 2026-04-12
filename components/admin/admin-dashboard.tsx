"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import { ExternalLink, LoaderCircle, Search, Trash2 } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminRow } from "@/lib/queries";
import { TEMPLATE_CATALOG } from "@/lib/portfolio";
import { formatDate } from "@/lib/utils";

export function AdminDashboard({
  initialRows,
  total,
}: {
  initialRows: AdminRow[];
  total: number;
}) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredRows = rows.filter((row) => {
    const haystack = `${row.name} ${row.username} ${row.template}`.toLowerCase();
    return haystack.includes(deferredQuery.trim().toLowerCase());
  });

  async function handleDelete(id: string, username: string) {
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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="glass-panel rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Total</p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">{rows.length || total}</p>
          <p className="mt-2 text-sm text-muted">Published portfolio routes tracked in Supabase.</p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Templates</p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
            {new Set(rows.map((row) => row.template)).size}
          </p>
          <p className="mt-2 text-sm text-muted">Distinct premium templates currently in use.</p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Latest</p>
          <p className="mt-3 font-display text-3xl font-semibold text-slate-950">
            {rows[0] ? formatDate(rows[0].created_at) : "No entries"}
          </p>
          <p className="mt-2 text-sm text-muted">Most recent portfolio creation date.</p>
        </article>
      </div>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold text-slate-950">Generated Portfolios</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Search by name, username, or template and manage live routes from one place.
            </p>
          </div>
          <label className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search portfolios..."
              className="pl-11"
            />
          </label>
        </div>

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
                const template = TEMPLATE_CATALOG.find((entry) => entry.id === row.template);

                return (
                  <div
                    key={row.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1fr_1fr_0.9fr_1fr] md:items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{row.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400 md:hidden">
                        {template?.name ?? row.template}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">/{row.username}</p>
                    <p className="hidden text-sm text-slate-600 md:block">{template?.name ?? row.template}</p>
                    <p className="text-sm text-slate-600">{formatDate(row.created_at)}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/${row.username}`}
                        target="_blank"
                        className={buttonStyles({ variant: "secondary", size: "sm" })}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deletingId === row.id}
                        onClick={() => handleDelete(row.id, row.username)}
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
      </section>
    </div>
  );
}
