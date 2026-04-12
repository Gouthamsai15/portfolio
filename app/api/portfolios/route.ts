import { NextResponse } from "next/server";
import { transformResumeToPortfolio } from "@/lib/gemini";
import {
  getMissingGeneratorConfigKeys,
  TEMPLATE_CATALOG,
  hasGeneratorConfig,
  normalizeHexColor,
  type TemplateId,
} from "@/lib/portfolio";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { normalizeUsername } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const templateIds = new Set<string>(TEMPLATE_CATALOG.map((template) => template.id));

export async function POST(request: Request) {
  if (!hasGeneratorConfig()) {
    const missingKeys = getMissingGeneratorConfigKeys();

    return NextResponse.json(
      {
        error: `Missing generator configuration: ${missingKeys.join(", ")}. Next.js reads .env.local or .env, not .env.example. GEMINI_MODEL is optional.`,
      },
      { status: 500 },
    );
  }

  let uploadedPath: string | null = null;

  try {
    const formData = await request.formData();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const username = normalizeUsername(String(formData.get("username") ?? ""));
    const resume = formData.get("resume");
    const templateInput = String(formData.get("template") ?? "");
    const colorPrimary = normalizeHexColor(
      String(formData.get("colorPrimary") ?? ""),
      "#0f766e",
    );
    const colorSecondary = normalizeHexColor(
      String(formData.get("colorSecondary") ?? ""),
      "#f97316",
    );

    if (!fullName || !username) {
      return NextResponse.json({ error: "Name and username are required." }, { status: 400 });
    }

    if (!(resume instanceof File) || resume.type !== "application/pdf") {
      return NextResponse.json({ error: "Upload a PDF resume." }, { status: 400 });
    }

    const template: TemplateId = templateIds.has(templateInput)
      ? (templateInput as TemplateId)
      : "modern-developer-dark";

    const supabase = createSupabaseAdminClient();
    const existing = await supabase.from("users").select("id").eq("username", username).maybeSingle();

    if (existing.data) {
      return NextResponse.json(
        { error: "That username is already taken. Please pick another one." },
        { status: 409 },
      );
    }

    const buffer = Buffer.from(await resume.arrayBuffer());

    if (buffer.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Please upload a PDF smaller than 8 MB." }, { status: 400 });
    }

    const uploadPath = `${username}-${Date.now()}.pdf`;
    uploadedPath = uploadPath;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(uploadPath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(uploadPath);
    const pdfParseModule = await import("pdf-parse");
    const parsedPdf = await pdfParseModule.default(buffer);

    if (!parsedPdf.text.trim()) {
      await supabase.storage.from("resumes").remove([uploadPath]);

      return NextResponse.json(
        { error: "We couldn't extract readable text from that PDF." },
        { status: 400 },
      );
    }

    const portfolio = await transformResumeToPortfolio(parsedPdf.text, fullName);

    const userInsert = await supabase
      .from("users")
      .insert({
        name: fullName,
        username,
        resume_url: publicUrlData.publicUrl,
        template,
        color_primary: colorPrimary,
        color_secondary: colorSecondary,
      })
      .select("id, username")
      .single();

    if (userInsert.error || !userInsert.data) {
      await supabase.storage.from("resumes").remove([uploadPath]);
      uploadedPath = null;
      throw userInsert.error ?? new Error("Unable to create user record.");
    }

    const portfolioInsert = await supabase.from("portfolio_data").insert({
      user_id: userInsert.data.id,
      role: portfolio.role,
      about: portfolio.about,
      highlights: portfolio.highlights,
      skills: portfolio.skills,
      projects: portfolio.projects,
      education: portfolio.education,
      experience: portfolio.experience,
      contact: portfolio.contact,
      additional_sections: portfolio.additionalSections,
    });

    if (portfolioInsert.error) {
      await supabase.from("users").delete().eq("id", userInsert.data.id);
      await supabase.storage.from("resumes").remove([uploadPath]);
      uploadedPath = null;
      throw portfolioInsert.error;
    }

    return NextResponse.json(
      {
        username: userInsert.data.username,
        url: `/${userInsert.data.username}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Portfolio generation failed", error);

    if (uploadedPath) {
      try {
        const supabase = createSupabaseAdminClient();
        await supabase.storage.from("resumes").remove([uploadedPath]);
      } catch (cleanupError) {
        console.error("Resume cleanup failed", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error: "Portfolio generation failed. Check Supabase storage, database tables, and Gemini settings.",
      },
      { status: 500 },
    );
  }
}
