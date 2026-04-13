import type { PortfolioRecord } from "@/lib/portfolio";

function extractDocumentParts(html: string) {
  const styles = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1])
    .join("\n");
  const links = Array.from(html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi))
    .map((match) => match[0])
    .join("\n");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    styles,
    links,
    body: bodyMatch?.[1] ?? html,
  };
}

export function renderCustomTemplate(record: PortfolioRecord, portfolioUrl: string) {
  const html = record.content.renderedHtml || record.customTemplate?.html || "";
  return extractDocumentParts(html);
}
