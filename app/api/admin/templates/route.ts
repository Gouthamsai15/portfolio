import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { normalizeTemplateSlug } from "@/lib/portfolio";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

function isMissingPortfolioTemplatesTable(message: string) {
  return (
    message.includes('relation "public.portfolio_templates" does not exist') ||
    message.includes("could not find the table 'public.portfolio_templates' in the schema cache")
  );
}

export async function POST(request: Request) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const htmlFile = formData.get("htmlFile");
  const slug = normalizeTemplateSlug(name);

  if (!name || !slug) {
    return NextResponse.json({ error: "Template name is required." }, { status: 400 });
  }

  if (!(htmlFile instanceof File) || !htmlFile.name.toLowerCase().endsWith(".html")) {
    return NextResponse.json({ error: "Upload a valid .html template file." }, { status: 400 });
  }

  const html = await htmlFile.text();

  if (!html.trim()) {
    return NextResponse.json({ error: "Uploaded HTML file is empty." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const response = await supabase
    .from("portfolio_templates")
    .insert({
      slug,
      name,
      description: `${name} custom HTML portfolio template.`,
      persona: "Custom",
      highlights: [],
      html,
      is_active: true,
    })
    .select("id, slug, name, description, persona, highlights, html, is_active, created_at")
    .single();

  if (response.error || !response.data) {
    const message = response.error?.message?.toLowerCase() ?? "";

    if (message.includes("duplicate key")) {
      return NextResponse.json({ error: "That template slug already exists." }, { status: 409 });
    }

    if (isMissingPortfolioTemplatesTable(message)) {
      return NextResponse.json(
        { error: "Run the latest supabase/schema.sql to create the portfolio_templates table." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: response.error?.message ?? "Unable to save this HTML template." },
      { status: 500 },
    );
  }

  return NextResponse.json({ template: response.data }, { status: 201 });
}
