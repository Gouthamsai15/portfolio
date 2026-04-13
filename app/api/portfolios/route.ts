import { NextResponse } from "next/server";
import { mergePortfolioIntoUploadedHtml, transformResumeToPortfolio } from "@/lib/gemini";
import {
  getMissingGeneratorConfigKeys,
  hasGeneratorConfig,
  isBuiltInTemplateId,
  isCustomTemplateId,
  normalizeHexColor,
  type TemplateId,
} from "@/lib/portfolio";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { normalizeUsername } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

function isMissingPortfolioTemplatesTableError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes('relation "public.portfolio_templates" does not exist') ||
    message.includes("could not find the table 'public.portfolio_templates' in the schema cache")
  );
}

function isMissingExtendedPortfolioColumnsError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("column") &&
    (message.includes("highlights") || message.includes("additional_sections") || message.includes("rendered_html"))
  );
}

async function insertPortfolioData(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
  portfolio: Awaited<ReturnType<typeof transformResumeToPortfolio>>,
  renderedHtml: string,
) {
  const fullInsert = await supabase.from("portfolio_data").insert({
    user_id: userId,
    role: portfolio.role,
    about: portfolio.about,
    highlights: portfolio.highlights,
    skills: portfolio.skills,
    projects: portfolio.projects,
    education: portfolio.education,
    experience: portfolio.experience,
    contact: portfolio.contact,
    additional_sections: portfolio.additionalSections,
    rendered_html: renderedHtml,
  });

  if (!fullInsert.error) {
    return fullInsert;
  }

  if (!isMissingExtendedPortfolioColumnsError(fullInsert.error)) {
    return fullInsert;
  }

  return supabase.from("portfolio_data").insert({
    user_id: userId,
    role: portfolio.role,
    about: portfolio.about,
    skills: portfolio.skills,
    projects: portfolio.projects,
    education: portfolio.education,
    experience: portfolio.experience,
    contact: portfolio.contact,
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) {
      return message;
    }
  }

  return "Unknown error";
}

function formatGenerationError(error: unknown) {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (normalized.includes("bucket") && normalized.includes("not found")) {
    return {
      status: 500,
      error: "Supabase Storage bucket 'resumes' is missing. Create it or run supabase/schema.sql first.",
    };
  }

  if (
    normalized.includes('relation "users" does not exist') ||
    normalized.includes('relation "portfolio_data" does not exist')
  ) {
    return {
      status: 500,
      error: "Supabase database tables are missing. Run supabase/schema.sql in your Supabase SQL editor.",
    };
  }

  if (
    normalized.includes("column") &&
    (normalized.includes("highlights") || normalized.includes("additional_sections") || normalized.includes("rendered_html"))
  ) {
    return {
      status: 500,
      error:
        "Your Supabase schema is outdated. Run the latest supabase/schema.sql to add the new portfolio columns.",
    };
  }

  if (normalized.includes("row-level security") || normalized.includes("permission denied")) {
    return {
      status: 500,
      error:
        "Supabase permissions are blocking the request. Confirm SUPABASE_SERVICE_ROLE_KEY is set correctly.",
    };
  }

  if (normalized.includes("invalid api key") || normalized.includes("api key not valid")) {
    return {
      status: 500,
      error: "GEMINI_API_KEY is invalid. Update it in .env.local and restart the dev server.",
    };
  }

  if (
    normalized.includes("models/") ||
    normalized.includes("model") ||
    normalized.includes("unsupported") ||
    normalized.includes("not found") ||
    normalized.includes("forbidden")
  ) {
    return {
      status: 500,
      error:
        "Gemini request failed. Check GEMINI_API_KEY and GEMINI_MODEL, or remove GEMINI_MODEL to use automatic fallbacks.",
    };
  }

  if (error instanceof SyntaxError || normalized.includes("json")) {
    return {
      status: 500,
      error:
        "Gemini returned invalid JSON for this resume. Try again, or switch to a more stable Gemini model in .env.local.",
    };
  }

  return {
    status: 500,
    error: `Portfolio generation failed: ${message}`,
  };
}

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

    const supabase = createSupabaseAdminClient();
    let template: TemplateId = "modern-developer-dark";
    let customTemplateHtml = "";

    if (isBuiltInTemplateId(templateInput)) {
      template = templateInput;
    } else if (isCustomTemplateId(templateInput)) {
      const slug = templateInput.replace(/^custom:/, "");
      const customTemplateResponse = await supabase
        .from("portfolio_templates")
        .select("id, html")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (isMissingPortfolioTemplatesTableError(customTemplateResponse.error)) {
        return NextResponse.json(
          { error: "Run the latest supabase/schema.sql to create the portfolio_templates table." },
          { status: 500 },
        );
      }

      if (customTemplateResponse.error || !customTemplateResponse.data) {
        return NextResponse.json({ error: "Selected HTML template is no longer available." }, { status: 400 });
      }

      template = templateInput;
      customTemplateHtml = customTemplateResponse.data.html ?? "";
    }

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
    let renderedHtml = "";

    if (isCustomTemplateId(template) && customTemplateHtml.trim()) {
      renderedHtml = await mergePortfolioIntoUploadedHtml({
        templateHtml: customTemplateHtml,
        portfolio,
        username,
        resumeUrl: publicUrlData.publicUrl,
        portfolioUrl: `/${username}`,
        primaryColor: colorPrimary,
        secondaryColor: colorSecondary,
      });
    }

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

    const portfolioInsert = await insertPortfolioData(supabase, userInsert.data.id, portfolio, renderedHtml);

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

    const formatted = formatGenerationError(error);

    return NextResponse.json({ error: formatted.error }, { status: formatted.status });
  }
}
