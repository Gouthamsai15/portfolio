import { Mail, Github, Linkedin, Phone } from "lucide-react";
import { PortfolioActions } from "@/components/portfolio/portfolio-actions";
import { TypewriterRole } from "@/components/portfolio/typewriter-role";
import type { PortfolioTemplateProps } from "@/templates/types";

export function ModernDeveloperDark({ record, portfolioUrl }: PortfolioTemplateProps) {
  const { user, content } = record;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-20 h-56 w-56 rounded-full bg-[var(--primary-color)]/20 blur-[120px]" />
        <div className="absolute bottom-16 right-[8%] h-72 w-72 rounded-full bg-[var(--secondary-color)]/20 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <section className="dark-panel rounded-[2rem] p-7 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
                {user.username}
              </p>
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                {content.name}
              </h1>
              <TypewriterRole text={content.role} />
              <p className="max-w-2xl text-lg leading-8 text-white/72">{content.about}</p>
            </div>
            <PortfolioActions portfolioUrl={portfolioUrl} resumeUrl={user.resume_url} tone="dark" />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.66fr_0.34fr]">
          <section className="space-y-6">
            <div className="dark-panel rounded-[2rem] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Projects</p>
              <div className="mt-5 grid gap-4">
                {content.projects.map((project) => (
                  <article
                    key={`${project.title}-${project.description}`}
                    className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <h2 className="font-display text-2xl font-semibold">{project.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/72">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="dark-panel rounded-[2rem] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Experience</p>
              <div className="mt-5 space-y-5">
                {content.experience.map((item) => (
                  <article
                    key={`${item.company}-${item.role}`}
                    className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{item.role}</h3>
                        <p className="text-sm text-[var(--secondary-color)]">{item.company}</p>
                      </div>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="dark-panel rounded-[2rem] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Skills</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/86"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="dark-panel rounded-[2rem] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Education</p>
              <div className="mt-5 space-y-4">
                {content.education.map((item) => (
                  <article key={`${item.degree}-${item.institution}`} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                    <p className="mt-1 text-sm text-white/72">{item.institution}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--secondary-color)]">
                      {item.year}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="dark-panel rounded-[2rem] p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Contact</p>
              <div className="mt-5 space-y-3 text-sm text-white/78">
                {content.contact.email ? (
                  <a className="flex items-center gap-3" href={`mailto:${content.contact.email}`}>
                    <Mail className="h-4 w-4 text-[var(--secondary-color)]" />
                    {content.contact.email}
                  </a>
                ) : null}
                {content.contact.phone ? (
                  <a className="flex items-center gap-3" href={`tel:${content.contact.phone}`}>
                    <Phone className="h-4 w-4 text-[var(--secondary-color)]" />
                    {content.contact.phone}
                  </a>
                ) : null}
                {content.contact.linkedin ? (
                  <a className="flex items-center gap-3" href={content.contact.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin className="h-4 w-4 text-[var(--secondary-color)]" />
                    LinkedIn
                  </a>
                ) : null}
                {content.contact.github ? (
                  <a className="flex items-center gap-3" href={content.contact.github} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4 text-[var(--secondary-color)]" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
