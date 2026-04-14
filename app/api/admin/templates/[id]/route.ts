import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function isMissingPortfolioTemplatesTable(message: string) {
  return (
    message.includes('relation "public.portfolio_templates" does not exist') ||
    message.includes("could not find the table 'public.portfolio_templates' in the schema cache")
  );
}

export async function PUT(request: Request, { params }: RouteProps) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const htmlFile = formData.get("htmlFile");

  if (!name) {
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
    .update({
      name,
      description: `${name} custom HTML portfolio template.`,
      html,
    })
    .eq("id", id)
    .select("id, slug, name, description, persona, highlights, html, is_active, created_at")
    .single();

  if (response.error || !response.data) {
    const message = response.error?.message?.toLowerCase() ?? "";

    if (isMissingPortfolioTemplatesTable(message)) {
      return NextResponse.json(
        { error: "Run the latest supabase/schema.sql to create the portfolio_templates table." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: response.error?.message ?? "Unable to update this template." },
      { status: 500 },
    );
  }

  return NextResponse.json({ template: response.data });
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const response = await supabase.from("portfolio_templates").delete().eq("id", id);

  if (response.error) {
    return NextResponse.json(
      { error: response.error.message || "Unable to delete this template." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
