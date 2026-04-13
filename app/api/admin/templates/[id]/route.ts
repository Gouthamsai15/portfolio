import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

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
