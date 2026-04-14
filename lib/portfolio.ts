export type BuiltInTemplateId =
  | "modern-developer-dark"
  | "minimal-clean"
  | "glassmorphism"
  | "creative-designer"
  | "corporate-professional";

export type TemplateId = BuiltInTemplateId | `custom:${string}`;

export interface PortfolioProject {
  title: string;
  description: string;
}

export interface PortfolioAdditionalSection {
  title: string;
  items: string[];
}

export interface PortfolioEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface PortfolioExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface PortfolioContact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  location: string;
}

export interface PortfolioContent {
  name: string;
  role: string;
  about: string;
  highlights: string[];
  skills: string[];
  projects: PortfolioProject[];
  education: PortfolioEducation[];
  experience: PortfolioExperience[];
  contact: PortfolioContact;
  additionalSections: PortfolioAdditionalSection[];
  renderedHtml: string;
}

export interface PortfolioUserRecord {
  id: string;
  name: string;
  username: string;
  resume_url: string;
  template: TemplateId;
  color_primary: string;
  color_secondary: string;
  created_at: string;
}

export interface PortfolioRecord {
  user: PortfolioUserRecord;
  content: PortfolioContent;
  customTemplate: CustomTemplateRecord | null;
}

export interface TemplateCatalogItem {
  id: TemplateId;
  name: string;
  description: string;
  persona: string;
  highlights: string[];
  source?: "built-in" | "custom";
  slug?: string;
}

export interface CustomTemplateRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  persona: string;
  highlights: string[];
  html: string;
  is_active: boolean;
  created_at: string;
}

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = [];

const builtInTemplateIds = new Set<BuiltInTemplateId>([
  "modern-developer-dark",
  "minimal-clean",
  "glassmorphism",
  "creative-designer",
  "corporate-professional",
]);

export const THEME_PRESETS = [
  { name: "Ocean Signal", primary: "#0f766e", secondary: "#f97316" },
  { name: "Midnight Pulse", primary: "#2563eb", secondary: "#ec4899" },
  { name: "Forest Ember", primary: "#166534", secondary: "#ea580c" },
  { name: "Royal Citrus", primary: "#7c3aed", secondary: "#f59e0b" },
  { name: "Rose Carbon", primary: "#be123c", secondary: "#1f2937" },
];

const DEFAULT_THEME = THEME_PRESETS[0];

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => stringValue(item))
    .filter(Boolean)
    .slice(0, 20);
}

function objectArray<T extends object>(
  value: unknown,
  keys: (keyof T)[],
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const normalized: Record<string, string> = {};

      keys.forEach((key) => {
        normalized[key as string] = stringValue((entry as Record<string, unknown>)[key as string]);
      });

      return normalized as T;
    })
    .filter((entry): entry is T => Boolean(entry));
}

function additionalSectionArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const section = entry as Record<string, unknown>;
      const title = stringValue(section.title);
      const items = stringArray(section.items);

      if (!title || !items.length) {
        return null;
      }

      return {
        title,
        items,
      };
    })
    .filter((entry): entry is PortfolioAdditionalSection => Boolean(entry))
    .slice(0, 6);
}

export function normalizeHexColor(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim();

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized;
  }

  return fallback;
}

export function isBuiltInTemplateId(value: string): value is BuiltInTemplateId {
  return builtInTemplateIds.has(value as TemplateId);
}

export function isCustomTemplateId(value: string): value is `custom:${string}` {
  return value.startsWith("custom:");
}

export function getCustomTemplateId(slug: string) {
  return `custom:${slug}` as const;
}

export function normalizeTemplateSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.html?$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function sanitizePortfolioContent(
  payload: Partial<PortfolioContent> | null | undefined,
  fallbackName: string,
): PortfolioContent {
  const safePayload = payload ?? {};

  return {
    name: stringValue(safePayload.name, fallbackName),
    role: stringValue(safePayload.role, "Portfolio Professional"),
    about: stringValue(
      safePayload.about,
      `${fallbackName} brings a practical blend of execution, communication, and results-driven delivery.`,
    ),
    highlights: stringArray(safePayload.highlights).slice(0, 6),
    skills: stringArray(safePayload.skills),
    projects: objectArray<PortfolioProject>(safePayload.projects, ["title", "description"]),
    education: objectArray<PortfolioEducation>(safePayload.education, [
      "degree",
      "institution",
      "year",
    ]),
    experience: objectArray<PortfolioExperience>(safePayload.experience, [
      "company",
      "role",
      "duration",
      "description",
    ]),
    contact: {
      email: stringValue(safePayload.contact?.email),
      phone: stringValue(safePayload.contact?.phone),
      linkedin: stringValue(safePayload.contact?.linkedin),
      github: stringValue(safePayload.contact?.github),
      website: stringValue(safePayload.contact?.website),
      location: stringValue(safePayload.contact?.location),
    },
    additionalSections: additionalSectionArray(safePayload.additionalSections),
    renderedHtml: stringValue((safePayload as { renderedHtml?: unknown }).renderedHtml),
  };
}

export function getThemeDefaults() {
  return DEFAULT_THEME;
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getMissingGeneratorConfigKeys() {
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ] as const;

  return keys.filter((key) => !process.env[key]);
}

export function hasGeneratorConfig() {
  return hasSupabaseConfig() && Boolean(process.env.GEMINI_API_KEY);
}
