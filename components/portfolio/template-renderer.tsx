import { CustomHtmlTemplate } from "@/components/portfolio/custom-html-template";
import { CorporateProfessional } from "@/templates/corporate-professional";
import { CreativeDesigner } from "@/templates/creative-designer";
import { Glassmorphism } from "@/templates/glassmorphism";
import { MinimalClean } from "@/templates/minimal-clean";
import { ModernDeveloperDark } from "@/templates/modern-developer-dark";
import { isBuiltInTemplateId } from "@/lib/portfolio";
import type { PortfolioTemplateProps } from "@/templates/types";

const templateMap = {
  "modern-developer-dark": ModernDeveloperDark,
  "minimal-clean": MinimalClean,
  glassmorphism: Glassmorphism,
  "creative-designer": CreativeDesigner,
  "corporate-professional": CorporateProfessional,
};

export function TemplateRenderer({ record, portfolioUrl }: PortfolioTemplateProps) {
  if (!isBuiltInTemplateId(record.user.template) && record.customTemplate) {
    return <CustomHtmlTemplate record={record} portfolioUrl={portfolioUrl} />;
  }

  const Component = isBuiltInTemplateId(record.user.template)
    ? templateMap[record.user.template]
    : CorporateProfessional;

  return <Component record={record} portfolioUrl={portfolioUrl} />;
}
