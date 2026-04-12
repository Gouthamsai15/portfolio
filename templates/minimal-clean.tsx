import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { PortfolioActions } from "@/components/portfolio/portfolio-actions";
import type { PortfolioTemplateProps } from "@/templates/types";

export function MinimalClean({ record, portfolioUrl }: PortfolioTemplateProps) {
  const { user, content } = record;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <section className="rounded-[2rem] border border-black/8 bg-white px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.06)] sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-color)]">
                Minimal Clean
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                {content.name}
              </h1>
              <p className="mt-4 text-2xl text-slate-600">{content.role}</p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{content.about}</p>
            </div>
            <PortfolioActions portfolioUrl={portfolioUrl} resumeUrl={user.resume_url} />
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="space-y-6">
            <section className="rounded-[1.8rem] border border-black/8 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Contact</p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {content.contact.email ? (
                  <a href={`mailto:${content.contact.email}`} className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[var(--primary-color)]" />
                    {content.contact.email}
                  </a>
                ) : null}
                {content.contact.phone ? (
                  <a href={`tel:${content.contact.phone}`} className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[var(--primary-color)]" />
                    {content.contact.phone}
                  </a>
                ) : null}
                {content.contact.linkedin ? (
                  <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                    <Linkedin className="h-4 w-4 text-[var(--primary-color)]" />
                    LinkedIn
                  </a>
                ) : null}
                {content.contact.github ? (
                  <a href={content.contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-[var(--primary-color)]" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-black/8 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Skills</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {content.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-black/8 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Education</p>
              <div className="mt-5 space-y-4">
                {content.education.map((item) => (
                  <article key={`${item.degree}-${item.institution}`}>
                    <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.institution}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{item.year}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>

          <section className="space-y-8">
            <section className="rounded-[1.8rem] border border-black/8 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Projects</p>
              <div className="mt-5 grid gap-4">
                {content.projects.map((project) => (
                  <article key={`${project.title}-${project.description}`} className="rounded-[1.5rem] bg-slate-50 p-5">
                    <h2 className="font-display text-2xl font-semibold text-slate-900">{project.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-black/8 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Experience</p>
              <div className="mt-5 space-y-5">
                {content.experience.map((item) => (
                  <article key={`${item.company}-${item.role}`} className="border-l-2 border-[var(--primary-color)] pl-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{item.role}</h3>
                        <p className="text-sm text-slate-600">{item.company}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
