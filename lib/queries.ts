import { createSupabaseAdminClient } from "@/lib/supabase";
import { hasSupabaseConfig, sanitizePortfolioContent, type PortfolioRecord, type TemplateId } from "@/lib/portfolio";

export interface AdminRow {
  id: string;
  name: string;
  username: string;
  template: TemplateId;
  created_at: string;
}

export async function getPortfolioByUsername(username: string): Promise<PortfolioRecord | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name, username, resume_url, template, color_primary, color_secondary, created_at, portfolio_data(role, about, skills, projects, education, experience, contact)",
    )
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const nested = Array.isArray(data.portfolio_data) ? data.portfolio_data[0] : data.portfolio_data;

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
        skills: nested?.skills,
        projects: nested?.projects,
        education: nested?.education,
        experience: nested?.experience,
        contact: nested?.contact,
      },
      data.name,
    ),
  };
}

export async function getAdminDashboardData() {
  if (!hasSupabaseConfig()) {
    return {
      total: 0,
      rows: [] as AdminRow[],
    };
  }

  const supabase = createSupabaseAdminClient();
  const [{ count }, rowsResponse] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("id, name, username, template, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return {
    total: count ?? rowsResponse.data?.length ?? 0,
    rows: (rowsResponse.data ?? []) as AdminRow[],
  };
}
