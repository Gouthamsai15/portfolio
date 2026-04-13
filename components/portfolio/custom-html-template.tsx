import { renderCustomTemplate } from "@/lib/custom-template";
import type { PortfolioTemplateProps } from "@/templates/types";

export function CustomHtmlTemplate({ record, portfolioUrl }: PortfolioTemplateProps) {
  const rendered = renderCustomTemplate(record, portfolioUrl);

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {rendered.links ? <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: rendered.links }} /> : null}
      {rendered.styles ? <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: rendered.styles }} /> : null}
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: rendered.body }} />
    </div>
  );
}
