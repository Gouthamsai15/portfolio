import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizePortfolioContent, type PortfolioContent } from "@/lib/portfolio";
import { safeParseJson } from "@/lib/utils";

const DEFAULT_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-1.5-flash",
];

function normalizeModelName(model: string) {
  return model.trim().replace(/^models\//, "");
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini is not configured. Set GEMINI_API_KEY.");
  }

  return {
    client: new GoogleGenerativeAI(apiKey),
  };
}

function getCandidateModels() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  return Array.from(
    new Set(
      [configuredModel, ...DEFAULT_GEMINI_MODELS]
        .filter((value): value is string => Boolean(value))
        .map(normalizeModelName),
    ),
  );
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
    normalized.includes("404") ||
    normalized.includes("403") ||
    normalized.includes("500")
  );
}

export async function transformResumeToPortfolio(
  resumeText: string,
  fallbackName: string,
): Promise<PortfolioContent> {
  const { client } = getGeminiClient();

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

  const candidateModels = getCandidateModels();
  let lastError: unknown;

  for (const model of candidateModels) {
    try {
      const gemini = client.getGenerativeModel({ model });
      const response = await gemini.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const parsed = safeParseJson<PortfolioContent>(response.response.text());

      return sanitizePortfolioContent(parsed, fallbackName);
    } catch (error) {
      lastError = error;

      if (!shouldTryNextModel(error)) {
        break;
      }
    }
  }

  throw lastError ?? new Error("Gemini generation failed.");
}
