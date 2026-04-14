import type { CustomTemplateRecord, PortfolioRecord, TemplateId } from "@/lib/portfolio";

export function createTemplatePreviewRecord(
  template: TemplateId,
  customTemplate: CustomTemplateRecord | null = null,
): PortfolioRecord {
  return {
    user: {
      id: "preview-user",
      name: "Aarav Sharma",
      username: "aarav-sharma",
      resume_url: "/resume-preview.pdf",
      template,
      color_primary: "#0f766e",
      color_secondary: "#f97316",
      created_at: new Date().toISOString(),
    },
    content: {
      name: "Aarav Sharma",
      role: "Product Designer & Frontend Builder",
      about:
        "Designing calm, conversion-ready portfolio sites with strong storytelling, clear systems, and modern UI craft.",
      highlights: ["Brand systems", "Responsive UI", "Fast delivery"],
      skills: ["Figma", "Next.js", "Design Systems", "Tailwind", "Prototyping"],
      projects: [
        {
          title: "Studio Portfolio",
          description: "A polished showcase site with editorial layouts and strong project storytelling.",
        },
        {
          title: "SaaS Landing Revamp",
          description: "A sharper, trust-building redesign for product onboarding and conversion pages.",
        },
      ],
      education: [
        {
          degree: "B.Des in Visual Communication",
          institution: "National Design Institute",
          year: "2022",
        },
      ],
      experience: [
        {
          company: "Northstar Studio",
          role: "Senior Product Designer",
          duration: "2023 - Present",
          description: "Leading interface design, prototypes, and front-end collaboration for client launches.",
        },
        {
          company: "Pixel Harbor",
          role: "UI Designer",
          duration: "2021 - 2023",
          description: "Created responsive marketing pages and reusable systems across multiple products.",
        },
      ],
      contact: {
        email: "aarav@example.com",
        phone: "+1 415 555 0198",
        linkedin: "https://linkedin.com/in/aarav",
        github: "https://github.com/aarav",
        website: "https://aarav.dev",
        location: "San Francisco, CA",
      },
      additionalSections: [
        {
          title: "Approach",
          items: ["Research-led design decisions", "Clear hierarchy", "Handoff-ready systems"],
        },
      ],
      renderedHtml: customTemplate?.html ?? "",
    },
    customTemplate,
  };
}
