import { Download, ExternalLink } from "lucide-react";
import { CopyLinkButton } from "@/components/portfolio/copy-link-button";
import { cn } from "@/lib/utils";

export function PortfolioActions({
  portfolioUrl,
  resumeUrl,
  tone = "light",
}: {
  portfolioUrl: string;
  resumeUrl: string;
  tone?: "light" | "dark";
}) {
  const actionClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold",
    tone === "dark"
      ? "border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12]"
      : "border border-black/10 bg-white/80 text-slate-900 hover:bg-white",
  );

  return (
    <div className="flex flex-wrap gap-3">
      <CopyLinkButton url={portfolioUrl} tone={tone} />
      <a href={resumeUrl} target="_blank" rel="noreferrer" className={actionClassName}>
        <Download className="h-4 w-4" />
        Resume PDF
      </a>
      <a href={portfolioUrl} target="_blank" rel="noreferrer" className={actionClassName}>
        <ExternalLink className="h-4 w-4" />
        Open Live
      </a>
    </div>
  );
}
