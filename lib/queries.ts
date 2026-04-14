import { createSupabaseAdminClient } from "@/lib/supabase";
import {
  getCustomTemplateId,
  hasSupabaseConfig,
  isCustomTemplateId,
  sanitizePortfolioContent,
  TEMPLATE_CATALOG,
  type CustomTemplateRecord,
  type PortfolioRecord,
  type TemplateCatalogItem,
  type TemplateId,
} from "@/lib/portfolio";

export interface AdminRow {
  id: string;
  name: string;
  username: string;
  template: TemplateId;
  created_at: string;
}

function hasMissingCustomTemplatesTableError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";
  return (
    message.includes('relation "public.portfolio_templates" does not exist') ||
    message.includes("could not find the table 'public.portfolio_templates' in the schema cache")
  );
}

function normalizeCustomTemplateRow(row: {
  id: string;
  slug: string;
  name: string;
  description: string;
  persona: string;
  highlights: unknown;
  html: string;
  is_active: boolean;
  created_at: string;
}): CustomTemplateRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    persona: row.persona,
    highlights: Array.isArray(row.highlights)
      ? row.highlights.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      : [],
    html: row.html,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

function hasMissingExtendedPortfolioColumnsError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";

  return (
    message.includes("column") &&
    (message.includes("highlights") || message.includes("additional_sections") || message.includes("rendered_html"))
  );
}

export async function getPortfolioByUsername(username: string): Promise<PortfolioRecord | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  let response = await supabase
    .from("users")
    .select(
      "id, name, username, resume_url, template, color_primary, color_secondary, created_at, portfolio_data(role, about, highlights, skills, projects, education, experience, contact, additional_sections, rendered_html)",
    )
    .eq("username", username)
    .maybeSingle();

  if (hasMissingExtendedPortfolioColumnsError(response.error)) {
    response = await supabase
      .from("users")
      .select(
        "id, name, username, resume_url, template, color_primary, color_secondary, created_at, portfolio_data(role, about, skills, projects, education, experience, contact, rendered_html)",
      )
      .eq("username", username)
      .maybeSingle();
  }

  const { data, error } = response;

  if (error || !data) {
    return null;
  }

  const nested = Array.isArray(data.portfolio_data) ? data.portfolio_data[0] : data.portfolio_data;
  let customTemplate: CustomTemplateRecord | null = null;

  if (isCustomTemplateId(data.template)) {
    const slug = data.template.replace(/^custom:/, "");
    const customResponse = await supabase
      .from("portfolio_templates")
      .select("id, slug, name, description, persona, highlights, html, is_active, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (!customResponse.error && customResponse.data) {
      customTemplate = normalizeCustomTemplateRow(customResponse.data);
    }
  }

  return {
    user: {
      id: data.id,
      name: data.name,
      username: data.username,
      resume_url: data.resume_url,
      template: data.template,
      color_primary: data.color_primary,
      color_secondary: data.color_secondary,
      created_at: data.created_at,
    },
    content: sanitizePortfolioContent(
      {
        name: data.name,
        role: nested?.role,
        about: nested?.about,
        highlights: nested?.highlights,
        skills: nested?.skills,
        projects: nested?.projects,
        education: nested?.education,
        experience: nested?.experience,
        contact: nested?.contact,
        additionalSections: nested?.additional_sections,
        renderedHtml: nested?.rendered_html,
      },
      data.name,
    ),
    customTemplate,
  };
}

export async function getActiveCustomTemplates() {
  if (!hasSupabaseConfig()) {
    return [] as TemplateCatalogItem[];
  }

  const supabase = createSupabaseAdminClient();
  const response = await supabase
    .from("portfolio_templates")
    .select("slug, name, description, persona, highlights")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (hasMissingCustomTemplatesTableError(response.error)) {
    return [] as TemplateCatalogItem[];
  }

  if (response.error || !response.data) {
    return [] as TemplateCatalogItem[];
  }

  return response.data.map((row) => ({
    id: getCustomTemplateId(row.slug),
    name: row.name,
    description: row.description,
    persona: row.persona,
    highlights: Array.isArray(row.highlights)
      ? row.highlights.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      : [],
    source: "custom" as const,
    slug: row.slug,
  }));
}

export async function getGeneratorTemplateCatalog() {
  const customTemplates = await getActiveCustomTemplates();
  return [...TEMPLATE_CATALOG, ...customTemplates];
}

export async function getActiveCustomTemplateBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const response = await supabase
    .from("portfolio_templates")
    .select("id, slug, name, description, persona, highlights, html, is_active, created_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (hasMissingCustomTemplatesTableError(response.error)) {
    return null;
  }

  if (response.error || !response.data) {
    return null;
  }

  return normalizeCustomTemplateRow(response.data);
}

export async function getAdminTemplates() {
  if (!hasSupabaseConfig()) {
    return [] as CustomTemplateRecord[];
  }

  const supabase = createSupabaseAdminClient();
  const response = await supabase
    .from("portfolio_templates")
    .select("id, slug, name, description, persona, highlights, html, is_active, created_at")
    .order("created_at", { ascending: false });

  if (hasMissingCustomTemplatesTableError(response.error)) {
    return [] as CustomTemplateRecord[];
  }

  if (response.error || !response.data) {
    return [] as CustomTemplateRecord[];
  }

  return response.data.map(normalizeCustomTemplateRow);
}

export async function getAdminDashboardData() {
  if (!hasSupabaseConfig()) {
    return {
      total: 0,
      rows: [] as AdminRow[],
      templates: [] as CustomTemplateRecord[],
    };
  }

  const supabase = createSupabaseAdminClient();
  const [{ count }, rowsResponse, templates] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("id, name, username, template, created_at")
      .order("created_at", { ascending: false }),
    getAdminTemplates(),
  ]);

  return {
    total: count ?? rowsResponse.data?.length ?? 0,
    rows: (rowsResponse.data ?? []) as AdminRow[],
    templates,
  };
}
