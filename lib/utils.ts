export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function extractJsonString(input: string) {
  const trimmed = input.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    return trimmed;
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
}

export function safeParseJson<T>(input: string): T {
  return JSON.parse(extractJsonString(input)) as T;
}

export function deriveStoragePath(publicUrl: string) {
  const [, path = ""] = publicUrl.split("/object/public/");

  if (!path) {
    return null;
  }

  return decodeURIComponent(path).replace(/^resumes\//, "");
}
