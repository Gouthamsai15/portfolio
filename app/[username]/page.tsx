import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/portfolio/template-renderer";
import { getPortfolioByUsername } from "@/lib/queries";
import { getBaseUrl } from "@/lib/utils";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const record = await getPortfolioByUsername(username);

  if (!record) {
    return {
      title: "Portfolio Not Found | GSR ERP",
    };
  }

  const canonical = `${getBaseUrl()}/${record.user.username}`;

  return {
    title: `${record.content.name} | ${record.content.role}`,
    description: record.content.about,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${record.content.name} | ${record.content.role}`,
      description: record.content.about,
      url: canonical,
      type: "profile",
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const record = await getPortfolioByUsername(username);

  if (!record) {
    notFound();
  }

  const portfolioUrl = `${getBaseUrl()}/${record.user.username}`;

  return (
    <div
      style={
        {
          "--primary-color": record.user.color_primary,
          "--secondary-color": record.user.color_secondary,
        } as CSSProperties
      }
    >
      <TemplateRenderer record={record} portfolioUrl={portfolioUrl} />
    </div>
  );
}
