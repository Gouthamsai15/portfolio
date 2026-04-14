import { notFound } from "next/navigation";
import type { Viewport } from "next";
import { TemplateRenderer } from "@/components/portfolio/template-renderer";
import { getActiveCustomTemplateBySlug } from "@/lib/queries";
import { createTemplatePreviewRecord } from "@/lib/template-preview-record";
import { isBuiltInTemplateId, type TemplateId } from "@/lib/portfolio";

export const dynamic = "force-dynamic";
export const viewport: Viewport = {
  width: 1440,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type TemplatePreviewPageProps = {
  searchParams: Promise<{ template?: string }>;
};

export default async function TemplatePreviewPage({ searchParams }: TemplatePreviewPageProps) {
  const params = await searchParams;
  const templateParam = String(params.template ?? "").trim();

  if (!templateParam) {
    notFound();
  }

  if (isBuiltInTemplateId(templateParam)) {
    const record = createTemplatePreviewRecord(templateParam);

    return (
      <main className="template-preview-page">
        <div className="template-preview-page__desktop-canvas">
          <TemplateRenderer record={record} portfolioUrl="https://example.com/aarav-sharma" />
        </div>
      </main>
    );
  }

  if (!templateParam.startsWith("custom:")) {
    notFound();
  }

  const slug = templateParam.replace(/^custom:/, "");
  const customTemplate = await getActiveCustomTemplateBySlug(slug);

  if (!customTemplate) {
    notFound();
  }

  const record = createTemplatePreviewRecord(`custom:${slug}` as TemplateId, customTemplate);

  return (
    <main className="template-preview-page">
      <div className="template-preview-page__desktop-canvas">
        <TemplateRenderer record={record} portfolioUrl="https://example.com/aarav-sharma" />
      </div>
    </main>
  );
}
