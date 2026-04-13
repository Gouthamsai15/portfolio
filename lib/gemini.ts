import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizePortfolioContent, type PortfolioContent } from "@/lib/portfolio";
import { safeParseJson } from "@/lib/utils";

const DEFAULT_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
  "gemini-flash-latest",
];

function normalizeModelName(model: string) {
  return model.trim().replace(/^models\//, "");
}

function deriveModelAliases(model: string) {
  const normalized = normalizeModelName(model);
  const aliases = new Set<string>([normalized]);

  if (normalized.endsWith("-latest")) {
    aliases.add(normalized.replace(/-latest$/, ""));
  }

  return [...aliases];
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini is not configured. Set GEMINI_API_KEY.");
  }

  return {
    client: new GoogleGenerativeAI(apiKey),
    apiKey,
  };
}

function getCandidateModels() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  return Array.from(
    new Set(
      [configuredModel, ...DEFAULT_GEMINI_MODELS]
        .filter((value): value is string => Boolean(value))
        .flatMap(deriveModelAliases),
    ),
  );
}

async function getAvailableGenerateContentModels(apiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`List models failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    models?: Array<{
      name?: string;
      supportedGenerationMethods?: string[];
    }>;
  };

  return (payload.models ?? [])
    .filter((model) => model.name?.startsWith("models/gemini-"))
    .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => normalizeModelName(model.name!));
}

function shouldTryNextModel(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  return (
    normalized.includes("not found") ||
    normalized.includes("unsupported") ||
    normalized.includes("not supported") ||
    normalized.includes("permission") ||
    normalized.includes("forbidden") ||
    normalized.includes("api key not valid") ||
    normalized.includes("invalid api key") ||
    normalized.includes("404") ||
    normalized.includes("403") ||
    normalized.includes("429") ||
    normalized.includes("500") ||
    normalized.includes("503")
  );
}

function extractHtmlDocument(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  return trimmed;
}

function containsCustomerPortfolioData(html: string, portfolio: PortfolioContent) {
  const haystack = html.toLowerCase();
  const signals = [
    portfolio.name,
    portfolio.role,
    portfolio.contact.email,
    portfolio.contact.phone,
    portfolio.contact.linkedin,
    portfolio.contact.github,
    portfolio.contact.website,
    portfolio.contact.location,
    portfolio.projects[0]?.title,
    portfolio.experience[0]?.company,
    portfolio.education[0]?.institution,
  ]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return signals.some((value) => haystack.includes(value));
}

async function generateJsonWithGemini<T>(prompt: string) {
  const { client, apiKey } = getGeminiClient();
  const triedModels = new Set<string>();
  const candidateModels = getCandidateModels();
  let lastError: unknown;

  for (const model of candidateModels) {
    try {
      triedModels.add(model);
      const gemini = client.getGenerativeModel({ model });
      const response = await gemini.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      return safeParseJson<T>(response.response.text());
    } catch (error) {
      lastError = error;

      if (!shouldTryNextModel(error)) {
        break;
      }
    }
  }

  try {
    const discoveredModels = await getAvailableGenerateContentModels(apiKey);

    for (const model of discoveredModels) {
      if (triedModels.has(model)) {
        continue;
      }

      try {
        triedModels.add(model);
        const gemini = client.getGenerativeModel({ model });
        const response = await gemini.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          },
        });

        return safeParseJson<T>(response.response.text());
      } catch (error) {
        lastError = error;

        if (!shouldTryNextModel(error)) {
          break;
        }
      }
    }
  } catch (error) {
    if (!lastError) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Gemini generation failed.");
}

export async function transformResumeToPortfolio(
  resumeText: string,
  fallbackName: string,
): Promise<PortfolioContent> {
  const prompt = `Convert the following resume text into structured JSON format.

Return ONLY valid JSON.

Structure must be:
{
  "name": "",
  "role": "",
  "about": "",
  "highlights": [],
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "contact": {
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "website": "",
    "location": ""
  },
  "additionalSections": [
    {
      "title": "",
      "items": []
    }
  ]
}

Make the "about" section professional, attractive, and concise.
Preserve as much useful information from the resume as possible.
If the resume includes certifications, achievements, awards, volunteering, publications, languages, internships, leadership, workshops, or other notable sections, place them inside "additionalSections" instead of dropping them.
Return clean, portfolio-ready content with strong wording, but do not invent facts.

Resume Text:
<<<${resumeText}>>>`;
  const parsed = await generateJsonWithGemini<PortfolioContent>(prompt);
  return sanitizePortfolioContent(parsed, fallbackName);
}

export async function transformUploadedHtmlToTemplate(templateName: string, html: string) {
  const prompt = `You are converting an uploaded portfolio HTML file into a reusable resume-driven template.

Return ONLY valid JSON.

Allowed placeholder tokens:
{{name}}
{{full_name}}
{{role}}
{{about}}
{{username}}
{{email}}
{{phone}}
{{linkedin}}
{{github}}
{{website}}
{{location}}
{{resume_url}}
{{portfolio_url}}
{{primary_color}}
{{secondary_color}}
{{highlights_list}}
{{highlights_tags}}
{{skills_list}}
{{skills_tags}}
{{projects_cards}}
{{experience_items}}
{{education_items}}
{{additional_sections}}

Rules:
- Preserve the uploaded layout, CSS, animation, spacing, and overall visual style as much as possible.
- Remove all sample, random, fake, or hardcoded person data from the HTML.
- Replace content areas with the allowed placeholder tokens so customer resume data can be injected later.
- Keep the HTML usable as a full page template.
- Do not invent extra placeholder names.
- Write a short one-line description suitable for a template picker.
- Keep highlights as 3 short phrases maximum.

  JSON structure:
  {
    "name": "",
    "description": "",
    "persona": "",
    "highlights": []
  }

Requested template name:
${templateName}

Uploaded HTML:
<<<${html}>>>`;

  const parsed = await generateJsonWithGemini<{
    name?: string;
    description?: string;
    persona?: string;
    highlights?: string[];
  }>(prompt);

  return {
    name: (parsed.name || templateName).trim() || templateName,
    description:
      (parsed.description || "AI-cleaned HTML template that adapts to uploaded resume data.")
        .trim()
        .slice(0, 180),
    persona: (parsed.persona || "Professional").trim() || "Professional",
    highlights: Array.isArray(parsed.highlights)
      ? parsed.highlights
          .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
          .slice(0, 3)
      : [],
  };
}

export async function mergePortfolioIntoUploadedHtml(args: {
  templateHtml: string;
  portfolio: PortfolioContent;
  username: string;
  resumeUrl: string;
  portfolioUrl: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  const prompt = `You are editing an uploaded portfolio HTML file for a real customer.

Goal:
- Keep the original HTML structure, CSS, animations, layout, and visual identity as close as possible to the uploaded file.
- Replace any demo/sample/random hardcoded person data with the customer's resume data.
- Do not turn it into a generic template. Preserve the original design language.
- Return a complete HTML document.

Important rules:
- Preserve existing styles, class names, transitions, and decorative effects whenever possible.
- Update text content, repeated cards, lists, experience sections, project sections, and contact sections to fit the customer data.
- You may duplicate or remove repeated content blocks only when needed to fit the resume data cleanly.
- Keep the page professional and polished.
- Use the provided colors where appropriate if the original file has obvious accent colors.
- The final HTML must clearly contain real customer data such as the customer's name, role, contact details, projects, or experience.
- Do not leave the original demo person's name or demo biography in place.
- Return ONLY HTML.

Customer portfolio JSON:
${JSON.stringify(args.portfolio, null, 2)}

Runtime values:
- username: ${args.username}
- resume_url: ${args.resumeUrl}
- portfolio_url: ${args.portfolioUrl}
- primary_color: ${args.primaryColor}
- secondary_color: ${args.secondaryColor}

Original uploaded HTML:
<<<${args.templateHtml}>>>`;

  const { client, apiKey } = getGeminiClient();
  const triedModels = new Set<string>();
  const candidateModels = getCandidateModels();
  let lastError: unknown;

  for (const model of candidateModels) {
    try {
      triedModels.add(model);
      const gemini = client.getGenerativeModel({ model });
      const response = await gemini.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
        },
      });

      const html = extractHtmlDocument(response.response.text());

      if (html && containsCustomerPortfolioData(html, args.portfolio)) {
        return html;
      }

      lastError = new Error("Generated HTML did not contain customer portfolio data.");
    } catch (error) {
      lastError = error;

      if (!shouldTryNextModel(error)) {
        break;
      }
    }
  }

  try {
    const discoveredModels = await getAvailableGenerateContentModels(apiKey);

    for (const model of discoveredModels) {
      if (triedModels.has(model)) {
        continue;
      }

      try {
        triedModels.add(model);
        const gemini = client.getGenerativeModel({ model });
        const response = await gemini.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          },
        });

        const html = extractHtmlDocument(response.response.text());

        if (html && containsCustomerPortfolioData(html, args.portfolio)) {
          return html;
        }

        lastError = new Error("Generated HTML did not contain customer portfolio data.");
      } catch (error) {
        lastError = error;

        if (!shouldTryNextModel(error)) {
          break;
        }
      }
    }
  } catch (error) {
    if (!lastError) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Gemini HTML merge failed.");
}
