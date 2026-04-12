"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyLinkButton({
  url,
  tone = "light",
}: {
  url: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold",
        tone === "dark"
          ? "border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12]"
          : "border border-black/10 bg-white/80 text-slate-900 hover:bg-white",
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy Link"}
    </button>
  );
}
