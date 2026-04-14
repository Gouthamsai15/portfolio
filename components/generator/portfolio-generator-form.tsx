"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, LoaderCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, type FormEvent } from "react";
import { TemplatePreviewFrame } from "@/components/generator/template-preview-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type TemplateCatalogItem, type TemplateId } from "@/lib/portfolio";
import { cn, normalizeUsername } from "@/lib/utils";

const defaultPrimaryColor = "#0f766e";
const defaultSecondaryColor = "#f97316";

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function PortfolioGeneratorForm({
  templates,
}: {
  templates: TemplateCatalogItem[];
}) {
  const hasTemplates = templates.length > 0;
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    templates[0]?.id ?? "modern-developer-dark",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState("");
  const [usernameHint, setUsernameHint] = useState("");

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isSubmitting]);

  async function handleSubmit(formData: FormData) {
    setError("");
    setSuccessUrl("");
    setElapsedSeconds(0);
    setIsSubmitting(true);

    if (!hasTemplates) {
      setError("No templates are available right now. Ask the admin to upload an HTML template.");
      setIsSubmitting(false);
      return;
    }

    formData.set("template", selectedTemplate);
    formData.set("colorPrimary", defaultPrimaryColor);
    formData.set("colorSecondary", defaultSecondaryColor);

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        body: formData,
      });

      const rawBody = await response.text();
      let payload: {
        error?: string;
        url?: string;
      } = {};

      if (rawBody) {
        try {
          payload = JSON.parse(rawBody) as {
            error?: string;
            url?: string;
          };
        } catch {
          payload = {
            error: rawBody.slice(0, 240).trim(),
          };
        }
      }

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Portfolio generation failed. Please try again.");
        setIsSubmitting(false);
        setElapsedSeconds(0);
        return;
      }

      setSuccessUrl(payload.url);
      startTransition(() => {
        router.push(payload.url!);
      });
    } catch (error) {
      const fallbackMessage =
        error instanceof Error && error.message
          ? error.message.toLowerCase().includes("failed to fetch")
            ? "The generation request timed out or lost connection before the server responded. Please try again."
            : error.message
          : "The request could not reach the server. Please try again.";

      setError(fallbackMessage);
      setIsSubmitting(false);
      setElapsedSeconds(0);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    void handleSubmit(new FormData(event.currentTarget));
  }

  return (
    <div className="portfolio-form-shell">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleFormSubmit}
        className="glass-panel portfolio-form"
      >
        <div className="portfolio-form__intro">
          <p className="portfolio-form__title">Create portfolio</p>
          <p className="portfolio-form__text">
            No signup required. Just upload the resume and generate the site.
          </p>
        </div>

        <div className="form-grid">
          <label className="form-label">
            Full Name
            <Input name="fullName" required placeholder="Goutham Raj" autoComplete="name" />
          </label>
          <label className="form-label">
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

        <div className="form-upload-box">
          <label className="form-label">
            Upload Resume (PDF)
            <Input
              name="resume"
              type="file"
              accept="application/pdf"
              required
              className="ui-file-input"
            />
          </label>
          <p className="portfolio-form__route">
            Public portfolio route: <strong>/{usernameHint || "username"}</strong>
          </p>
        </div>

        <div className="portfolio-form__section">
          <div className="portfolio-form__section-head">
            <span className="portfolio-form__count">
              {templates.length} styles
            </span>
            <h3 className="portfolio-form__section-title">Choose your template</h3>
          </div>
          {hasTemplates ? (
            <div className="template-grid">
              {templates.map((template) => {
                const isActive = template.id === selectedTemplate;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      "template-card",
                      isActive && "template-card--active",
                    )}
                  >
                    <div className="template-card__preview">
                      <TemplatePreviewFrame
                        title={`${template.name} preview`}
                        src={`/template-preview?template=${encodeURIComponent(template.id)}`}
                      />
                    </div>
                    <div className="template-card__row">
                      <div>
                        <p className="template-card__title">{template.name}</p>
                        <p className="template-card__text">
                          {template.description}
                        </p>
                      </div>
                      {isActive ? <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--secondary-color)]" /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="feedback-message feedback-message--error">
              No templates are available right now. Ask the admin to upload an HTML template.
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="feedback-message feedback-message--error"
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
              className="feedback-message feedback-message--success"
            >
              Portfolio created at{" "}
              <Link href={successUrl} className="font-semibold underline underline-offset-4">
                {successUrl}
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isSubmitting ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="loading-state"
              aria-live="polite"
            >
              <div className="loading-state__row">
                <div className="loading-state__intro">
                  <p className="loading-state__title">Generating your portfolio</p>
                  <p className="loading-state__text">
                    We are processing your resume and building your portfolio page now.
                  </p>
                </div>
                <div className="loading-state__timer">
                  <Clock3 className="h-4 w-4 text-[var(--primary-color)]" />
                  {formatElapsedTime(elapsedSeconds)}
                </div>
              </div>
              <div className="loading-state__bar">
                <motion.div
                  className="loading-state__bar-fill"
                  initial={{ x: "-100%" }}
                  animate={{ x: ["-100%", "0%", "100%"] }}
                  transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  style={{ width: "40%" }}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button type="submit" size="lg" className="button-block" disabled={isSubmitting || !hasTemplates}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Generating Portfolio</span>
              <span className="submit-timer-chip">
                {formatElapsedTime(elapsedSeconds)}
              </span>
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
