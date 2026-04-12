export type TemplateId =
  | "modern-developer-dark"
  | "minimal-clean"
  | "glassmorphism"
  | "creative-designer"
  | "corporate-professional";

export interface PortfolioProject {
  title: string;
  description: string;
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
}

export interface PortfolioContent {
  name: string;
  role: string;
  about: string;
  skills: string[];
  projects: PortfolioProject[];
  education: PortfolioEducation[];
  experience: PortfolioExperience[];
  contact: PortfolioContact;
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
}

export interface TemplateCatalogItem {
  id: TemplateId;
  name: string;
  description: string;
  persona: string;
  highlights: string[];
}

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = [
  {
    id: "modern-developer-dark",
    name: "Modern Developer Dark",
    description: "Neon-led, motion-rich layout for engineers and technical creators.",
    persona: "Technical",
    highlights: ["typing hero", "dark canvas", "glow panels"],
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Quiet luxury with refined spacing and editorial typography.",
    persona: "Minimal",
    highlights: ["soft contrast", "clean grid", "editorial rhythm"],
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Gradient atmosphere with frosted panels and luminous depth.",
    persona: "Futuristic",
    highlights: ["blur cards", "floating layers", "light bloom"],
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Expressive, bold composition for visually driven personal brands.",
    persona: "Creative",
    highlights: ["oversized type", "asymmetric layout", "animated accents"],
  },
  {
    id: "corporate-professional",
    name: "Corporate Professional",
    description: "Polished resume-style presentation for consultants and leaders.",
    persona: "Formal",
    highlights: ["two-column layout", "structured timeline", "executive tone"],
  },
];

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
    },
  };
}

export function getThemeDefaults() {
  return DEFAULT_THEME;
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getMissingGeneratorConfigKeys() {
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ] as const;

  return keys.filter((key) => !process.env[key]);
}

export function hasGeneratorConfig() {
  return hasSupabaseConfig() && Boolean(process.env.GEMINI_API_KEY);
}
