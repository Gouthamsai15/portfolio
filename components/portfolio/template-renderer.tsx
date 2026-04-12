import { CorporateProfessional } from "@/templates/corporate-professional";
import { CreativeDesigner } from "@/templates/creative-designer";
import { Glassmorphism } from "@/templates/glassmorphism";
import { MinimalClean } from "@/templates/minimal-clean";
import { ModernDeveloperDark } from "@/templates/modern-developer-dark";
import type { PortfolioTemplateProps } from "@/templates/types";

const templateMap = {
  "modern-developer-dark": ModernDeveloperDark,
  "minimal-clean": MinimalClean,
  glassmorphism: Glassmorphism,
  "creative-designer": CreativeDesigner,
  "corporate-professional": CorporateProfessional,
};

export function TemplateRenderer({ record, portfolioUrl }: PortfolioTemplateProps) {
  const Component = templateMap[record.user.template] ?? CorporateProfessional;

  return <Component record={record} portfolioUrl={portfolioUrl} />;
}
