import { mergePortfolioIntoUploadedHtml } from "@/lib/gemini";
import { renderCustomTemplate } from "@/lib/custom-template";
import type { PortfolioTemplateProps } from "@/templates/types";

export async function CustomHtmlTemplate({ record, portfolioUrl }: PortfolioTemplateProps) {
  let resolvedRecord = record;

  if (!record.content.renderedHtml.trim() && record.customTemplate?.html.trim()) {
    const regeneratedHtml = await mergePortfolioIntoUploadedHtml({
      templateHtml: record.customTemplate.html,
      portfolio: record.content,
      username: record.user.username,
      resumeUrl: record.user.resume_url,
      portfolioUrl,
      primaryColor: record.user.color_primary,
      secondaryColor: record.user.color_secondary,
    });

    resolvedRecord = {
      ...record,
      content: {
        ...record.content,
        renderedHtml: regeneratedHtml,
      },
    };
  }

  const rendered = renderCustomTemplate(resolvedRecord, portfolioUrl);

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {rendered.links ? <div dangerouslySetInnerHTML={{ __html: rendered.links }} /> : null}
      {rendered.styles ? <style dangerouslySetInnerHTML={{ __html: rendered.styles }} /> : null}
      <div dangerouslySetInnerHTML={{ __html: rendered.body }} />
    </div>
  );
}
