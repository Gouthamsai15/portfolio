"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Download, ExternalLink, FileCode2, LoaderCircle, Pencil, Search, Trash2, WandSparkles, X } from "lucide-react";
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
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingTemplateName, setEditingTemplateName] = useState("");
  const [editingTemplateFile, setEditingTemplateFile] = useState<File | null>(null);
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);
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

  function handleStartEditingTemplate(template: CustomTemplateRecord) {
    setUploadError("");
    setUploadSuccess("");
    setEditingTemplateId(template.id);
    setEditingTemplateName(template.name);
    setEditingTemplateFile(null);
  }

  function handleCancelEditingTemplate() {
    setEditingTemplateId(null);
    setEditingTemplateName("");
    setEditingTemplateFile(null);
    setSavingTemplateId(null);
  }

  async function handleSaveTemplate(template: CustomTemplateRecord) {
    setUploadError("");
    setUploadSuccess("");
    setSavingTemplateId(template.id);

    if (!editingTemplateFile) {
      setUploadError("Upload the updated .html file before saving.");
      setSavingTemplateId(null);
      return;
    }

    const formData = new FormData();
    formData.set("name", editingTemplateName);
    formData.set("htmlFile", editingTemplateFile);

    const response = await fetch(`/api/admin/templates/${template.id}`, {
      method: "PUT",
      body: formData,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      template?: CustomTemplateRecord;
    };

    if (!response.ok || !payload.template) {
      setUploadError(payload.error ?? "Unable to update this HTML template.");
      setSavingTemplateId(null);
      return;
    }

    startTransition(() => {
      setTemplates((current) =>
        current.map((entry) => (entry.id === template.id ? payload.template! : entry)),
      );
    });
    setUploadSuccess(`Template "${payload.template.name}" was updated.`);
    handleCancelEditingTemplate();
  }

  function handleDownloadTemplate(template: CustomTemplateRecord) {
    const blob = new Blob([template.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${template.slug || template.name}.html`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
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
    if (editingTemplateId === template.id) {
      handleCancelEditingTemplate();
    }
    setDeletingTemplateId(null);
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats">
        <article className="glass-panel admin-stat-card">
          <p className="admin-stat-card__label">Total</p>
          <p className="admin-stat-card__value">{rows.length || total}</p>
          <p className="admin-stat-card__text">Published portfolio routes tracked in Supabase.</p>
        </article>
        <article className="glass-panel admin-stat-card">
          <p className="admin-stat-card__label">Templates</p>
          <p className="admin-stat-card__value">
            {new Set(rows.map((row) => row.template)).size}
          </p>
          <p className="admin-stat-card__text">Distinct built-in and uploaded templates currently in use.</p>
        </article>
        <article className="glass-panel admin-stat-card">
          <p className="admin-stat-card__label">HTML Library</p>
          <p className="admin-stat-card__value">{templates.length}</p>
          <p className="admin-stat-card__text">Custom HTML templates available.</p>
        </article>
      </div>

      <section className="glass-panel admin-section">
        <div className="admin-section__header">
          <div>
            <p className="admin-section__title">Upload HTML Templates</p>
            <p className="admin-section__text">
              Upload any portfolio HTML file. AI will clean sample data from it and convert it
              into a resume-driven template automatically.
            </p>

            <form onSubmit={handleUploadTemplateSubmit} className="admin-form">
              <label className="form-label">
                Template Name
                <Input name="name" required placeholder="Warm Editorial Portfolio" />
              </label>

              <label className="form-label">
                HTML File
                <Input
                  name="htmlFile"
                  type="file"
                  accept=".html,text/html"
                  required
                  className="ui-file-input"
                />
              </label>

              {uploadError ? (
                <p className="feedback-message feedback-message--error">
                  {uploadError}
                </p>
              ) : null}

              {uploadSuccess ? (
                <p className="feedback-message feedback-message--success">
                  {uploadSuccess}
                </p>
              ) : null}

              {isUploadingTemplate ? (
                <div className="admin-loading-box" aria-live="polite">
                  <div className="admin-loading-box__row">
                    <div className="admin-loading-box__icon">
                      <LoaderCircle className="h-5 w-5 animate-spin text-[var(--primary-color)]" />
                    </div>
                    <div className="admin-loading-box__content">
                      <p className="admin-loading-box__title">Uploading HTML template</p>
                      <p className="admin-loading-box__text">
                        Please wait while we upload the file and prepare it for the generator.
                      </p>
                      <div className="admin-loading-box__bar">
                        <div className="admin-loading-box__bar-fill animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={isUploadingTemplate}>
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

      <section className="glass-panel admin-section">
        <div className="admin-section__header-between">
          <div>
            <p className="admin-section__title">HTML Template Library</p>
            <p className="admin-section__text">
              These custom templates are shown to customers under Choose your template.
            </p>
          </div>
          <div className="admin-section__meta">
            <div className="admin-badge">
              {templates.length} uploaded
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsTemplateLibraryOpen((current) => !current)}
            >
              {isTemplateLibraryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isTemplateLibraryOpen ? "Close" : "Open"}
            </Button>
          </div>
        </div>

        {isTemplateLibraryOpen ? (
          <div className="admin-template-grid">
            {templates.length ? (
              templates.map((template) => (
                <article key={template.id} className="admin-template-card">
                  {editingTemplateId === template.id ? (
                    <div className="admin-template-editor">
                      <div className="admin-template-editor__header">
                        <p className="admin-template-editor__title">Edit HTML Template</p>
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancelEditingTemplate}>
                          <X className="h-4 w-4" />
                          Close
                        </Button>
                      </div>

                      <div className="admin-template-editor__body">
                        <label className="form-label">
                          Template Name
                          <Input
                            value={editingTemplateName}
                            onChange={(event) => setEditingTemplateName(event.target.value)}
                            placeholder="Warm Editorial Portfolio"
                          />
                        </label>

                        <label className="form-label">
                          Updated HTML File
                          <Input
                            type="file"
                            accept=".html,text/html"
                            className="ui-file-input"
                            onChange={(event) => setEditingTemplateFile(event.target.files?.[0] ?? null)}
                          />
                        </label>

                        <p className="admin-template-editor__hint">
                          Upload the replacement `.html` file for this template.
                        </p>

                        <div className="admin-template-editor__actions">
                          <Button
                            type="button"
                            size="sm"
                            disabled={savingTemplateId === template.id}
                            onClick={() => handleSaveTemplate(template)}
                          >
                            {savingTemplateId === template.id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Pencil className="h-4 w-4" />
                            )}
                            Save Changes
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadTemplate(template)}
                          >
                            <Download className="h-4 w-4" />
                            Download Current File
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="admin-template-card__head">
                    <div>
                      <p className="admin-template-card__title">{template.name}</p>
                      <p className="admin-template-card__slug">custom:{template.slug}</p>
                    </div>
                    <FileCode2 className="h-5 w-5 text-[var(--primary-color)]" />
                  </div>
                  <p className="admin-template-card__text">{template.description}</p>
                  <div className="admin-tag-list">
                    {template.highlights.map((item) => (
                      <span key={item} className="admin-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="admin-template-card__footer">
                    <p className="admin-meta-text">Added {formatDate(template.created_at)}</p>
                    <div className="admin-template-card__actions">
                      <Button
                        type="button"
                        variant={editingTemplateId === template.id ? "ghost" : "secondary"}
                        size="sm"
                        onClick={() =>
                          editingTemplateId === template.id
                            ? handleCancelEditingTemplate()
                            : handleStartEditingTemplate(template)
                        }
                      >
                        {editingTemplateId === template.id ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                        {editingTemplateId === template.id ? "Cancel" : "Edit"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadTemplate(template)}
                      >
                        <Download className="h-4 w-4" />
                        Download HTML
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
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
                  </div>
                </article>
              ))
            ) : (
              <div className="admin-empty-card">
                No custom HTML templates uploaded yet.
              </div>
            )}
          </div>
        ) : null}
      </section>

      <section className="glass-panel admin-section">
        <div className="admin-section__header-between">
          <div>
            <p className="admin-section__title">Generated Portfolios</p>
            <p className="admin-section__text">
              Search by name, username, or template and manage live routes from one place.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsPortfolioListOpen((current) => !current)}
          >
            {isPortfolioListOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isPortfolioListOpen ? "Close" : "Open"}
          </Button>
        </div>

        {isPortfolioListOpen ? (
          <>
            <label className="admin-search">
              <Search className="admin-search__icon h-4 w-4" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search portfolios..."
                className="admin-search__input"
              />
            </label>

            {error ? (
              <p className="feedback-message feedback-message--error">
                {error}
              </p>
            ) : null}

            <div className="admin-table">
              <div className="admin-table__head">
                <span>Name</span>
                <span>Username</span>
                <span>Template</span>
                <span>Created</span>
                <span>Actions</span>
              </div>

              <div className="admin-table__body">
                {filteredRows.length ? (
                  filteredRows.map((row) => {
                    const templateLabel = getTemplateLabel(row.template, templates);

                    return (
                      <div key={row.id} className="admin-row">
                        <div>
                          <p className="admin-row__name">{row.name}</p>
                          <p className="admin-row__template-mobile">
                            {templateLabel}
                          </p>
                        </div>
                        <p className="admin-row__path">/{row.username}</p>
                        <p className="admin-row__template">{templateLabel}</p>
                        <p className="admin-row__date">{formatDate(row.created_at)}</p>
                        <div className="admin-row__actions">
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
                  <div className="admin-empty-state">
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
