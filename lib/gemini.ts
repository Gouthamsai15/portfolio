import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizePortfolioContent, type PortfolioContent } from "@/lib/portfolio";
import { safeParseJson } from "@/lib/utils";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    throw new Error("Gemini is not configured. Set GEMINI_API_KEY and GEMINI_MODEL.");
  }

  return {
    model,
    client: new GoogleGenerativeAI(apiKey),
  };
}

export async function transformResumeToPortfolio(
  resumeText: string,
  fallbackName: string,
): Promise<PortfolioContent> {
  const { client, model } = getGeminiClient();
  const gemini = client.getGenerativeModel({ model });

  const prompt = `Convert the following resume text into structured JSON format.

Return ONLY valid JSON.

Structure must be:
{
  "name": "",
  "role": "",
  "about": "",
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
    "github": ""
  }
}

Make the "about" section professional, attractive, and concise.

Resume Text:
<<<${resumeText}>>>`;

  const response = await gemini.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const parsed = safeParseJson<PortfolioContent>(response.response.text());

  return sanitizePortfolioContent(parsed, fallbackName);
}
