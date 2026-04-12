import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { PortfolioActions } from "@/components/portfolio/portfolio-actions";
import type { PortfolioTemplateProps } from "@/templates/types";

export function CorporateProfessional({ record, portfolioUrl }: PortfolioTemplateProps) {
  const { user, content } = record;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[0.34fr_0.66fr]">
            <aside className="bg-slate-950 px-7 py-8 text-white sm:px-8">
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">Corporate Professional</p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">{content.name}</h1>
              <p className="mt-3 text-lg text-white/72">{content.role}</p>
              <p className="mt-6 text-sm leading-7 text-white/72">{content.about}</p>

              <div className="mt-8 space-y-6">
                <section>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Contact</p>
                  <div className="mt-4 space-y-3 text-sm text-white/78">
                    {content.contact.email ? (
                      <a href={`mailto:${content.contact.email}`} className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-[var(--secondary-color)]" />
                        {content.contact.email}
                      </a>
                    ) : null}
                    {content.contact.phone ? (
                      <a href={`tel:${content.contact.phone}`} className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-[var(--secondary-color)]" />
                        {content.contact.phone}
                      </a>
                    ) : null}
                    {content.contact.linkedin ? (
                      <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                        <Linkedin className="h-4 w-4 text-[var(--secondary-color)]" />
                        LinkedIn
                      </a>
                    ) : null}
                    {content.contact.github ? (
                      <a href={content.contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                        <Github className="h-4 w-4 text-[var(--secondary-color)]" />
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </section>

                <section>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Skills</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {content.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Education</p>
                  <div className="mt-4 space-y-4">
                    {content.education.map((item) => (
                      <article key={`${item.degree}-${item.institution}`}>
                        <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                        <p className="mt-1 text-sm text-white/72">{item.institution}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--secondary-color)]">
                          {item.year}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </aside>

            <main className="px-7 py-8 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Executive Overview</p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    Structured presentation for hiring managers, consulting teams, and leadership reviews.
                  </p>
                </div>
                <PortfolioActions portfolioUrl={portfolioUrl} resumeUrl={user.resume_url} />
              </div>

              <section className="mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Experience</p>
                <div className="mt-5 space-y-6">
                  {content.experience.map((item) => (
                    <article
                      key={`${item.company}-${item.role}`}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-2xl font-semibold">{item.role}</h3>
                          <p className="text-sm text-slate-600">{item.company}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                          {item.duration}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Projects</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {content.projects.map((project) => (
                    <article
                      key={`${project.title}-${project.description}`}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <h2 className="font-display text-2xl font-semibold">{project.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
