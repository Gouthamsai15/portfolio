import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Globe2, Upload } from "lucide-react";
import { PortfolioGeneratorForm } from "@/components/generator/portfolio-generator-form";
import { buttonStyles } from "@/components/ui/button";
import { getGeneratorTemplateCatalog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const templates = await getGeneratorTemplateCatalog();

  return (
    <main className="site-shell home-page">
      <div className="home-container">
        <header className="glass-panel home-header">
          <div>
            <p className="home-header__title">GSR Portfolio Builder</p>
            <p className="home-header__subtitle">Resume To Portfolio Website</p>
          </div>
          <Link href="#generate" className={buttonStyles({ size: "sm" }) + " home-header__cta"}>
            Create Your Portfolio
          </Link>
        </header>

        <section className="home-hero">
          <div className="home-hero__content">
            <div className="home-pill">
              <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
              Fast, simple, and ready to share
            </div>
            <div className="home-hero__headline-wrap">
              <h1 className="home-hero__title text-balance">
                Turn your resume into a clean portfolio website your customers can trust.
              </h1>
              <p className="home-hero__text">
                Upload your PDF, choose a design, and get a live portfolio page in minutes. No
                complicated setup, no long forms, and no technical steps.
              </p>
            </div>
            <div className="home-hero__actions">
              <Link href="#generate" className={buttonStyles({ size: "lg" })}>
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="home-steps">
              {[
                { step: "Upload your resume", icon: Upload },
                { step: "Choose your style", icon: BadgeCheck },
                { step: "Share your live link", icon: Globe2 },
              ].map(({ step, icon: Icon }) => (
                <div key={step} className="glass-panel home-step-card">
                  <Icon className="h-5 w-5 text-[var(--primary-color)]" />
                  <p className="home-step-card__text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel home-showcase">
            <div className="home-showcase__grid">
              <div className="home-showcase__card home-showcase__card--light">
                <p className="home-showcase__eyebrow">
                  Why customers like it
                </p>
                <p className="home-showcase__title">
                  Clear and easy
                </p>
                <p className="home-showcase__text">
                  A simple workflow that helps anyone publish a professional page without extra help.
                </p>
              </div>
              <div className="home-showcase__card home-showcase__card--dark">
                <p className="home-showcase__eyebrow home-showcase__eyebrow--dark">
                  Publishing speed
                </p>
                <p className="home-showcase__title home-showcase__title--dark">
                  <Clock3 className="h-6 w-6 text-[var(--secondary-color)]" />
                  Minutes, not hours
                </p>
                <p className="home-showcase__text home-showcase__text--dark">
                  Upload once, generate once, and open your personal route instantly.
                </p>
              </div>
            </div>
            <div className="home-showcase__list">
              {[
                "No sign-up needed for portfolio creation",
                "Public profile available on your own /username page",
                "Professional templates ready for resumes and personal branding",
              ].map((item) => (
                <div key={item} className="home-showcase__list-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-features">
          {[
            {
              title: "Simple to begin",
              description: "Just add your name, choose a username, and upload your resume PDF.",
            },
            {
              title: "Made for sharing",
              description: "Each portfolio gets its own public URL so clients and employers can open it easily.",
            },
            {
              title: "Designed to look polished",
              description: "Use a ready-made template so the final page feels professional from the start.",
            },
          ].map((item) => (
            <div key={item.title} className="glass-panel home-feature-card">
              <p className="home-feature-card__title">{item.title}</p>
              <p className="home-feature-card__text">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="home-center-section">
          <div className="home-pill home-pill--center">
            <BadgeCheck className="h-4 w-4 text-[var(--primary-color)]" />
            Resume in, portfolio out
          </div>
          <div className="home-center-section__content">
            <h2 className="home-center-section__title">
              Your portfolio goes live on a personal route
            </h2>
            <p className="home-center-section__text">
              Once generated, the site is published instantly on your own{" "}
              <code className="home-inline-code">
                /username
              </code>{" "}
              page so visitors can access it quickly.
            </p>
          </div>
        </section>

        <section id="generate" className="home-generate">
          <div className="home-generate__intro">
            <p className="home-generate__eyebrow">
              Portfolio Builder
            </p>
            <h2 className="home-generate__title">
              Start with your resume
            </h2>
            <p className="home-generate__text">
              Fill in the details below, upload the PDF, and generate a customer-ready portfolio page.
            </p>
          </div>
          <PortfolioGeneratorForm templates={templates} />
        </section>
      </div>
    </main>
  );
}
