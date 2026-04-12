import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import { deriveStoragePath } from "@/lib/utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Supabase admin configuration is missing." }, { status: 503 });
  }

  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("users")
    .select("id, resume_url")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  const storagePath = deriveStoragePath(existing.resume_url);

  if (storagePath) {
    await supabase.storage.from("resumes").remove([storagePath]);
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
