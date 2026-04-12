import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { PortfolioActions } from "@/components/portfolio/portfolio-actions";
import type { PortfolioTemplateProps } from "@/templates/types";

export function CreativeDesigner({ record, portfolioUrl }: PortfolioTemplateProps) {
  const { user, content } = record;

  return (
    <div className="min-h-screen bg-[#fff5ef] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
          <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white shadow-[0_40px_90px_rgba(15,23,42,0.18)] sm:rounded-[2.4rem] sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--secondary-color)] sm:text-xs sm:tracking-[0.34em]">
              Creative Designer
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-tight sm:mt-5 sm:text-7xl">
              {content.name}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-white/72 sm:mt-4 sm:text-2xl">{content.role}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/72 sm:mt-8 sm:text-lg sm:leading-8">{content.about}</p>
            <div className="mt-6 sm:mt-8">
              <PortfolioActions portfolioUrl={portfolioUrl} resumeUrl={user.resume_url} tone="dark" />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[1.5rem] border border-black/8 bg-[var(--primary-color)] p-4 text-white sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Creative Energy</p>
              <p className="mt-3 font-display text-2xl font-semibold sm:mt-4 sm:text-4xl">
                Distinct identity, bold motion, and sharp project storytelling.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white p-4 sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Contact</p>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
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
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <div className="grid gap-6">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Projects</p>
                <ArrowUpRight className="h-4 w-4 text-[var(--secondary-color)]" />
              </div>
              <div className="mt-5 grid gap-4">
                {content.projects.map((project) => (
                  <article
                    key={`${project.title}-${project.description}`}
                    className="rounded-[1.2rem] border border-black/8 bg-[#fff5ef] p-4 sm:rounded-[1.5rem] sm:p-5"
                  >
                    <h2 className="font-display text-2xl font-semibold sm:text-3xl">{project.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary-color)]">Experience</p>
              <div className="mt-5 space-y-5">
                {content.experience.map((item) => (
                  <article key={`${item.company}-${item.role}`} className="rounded-[1.2rem] border border-white/12 bg-white/[0.05] p-4 sm:rounded-[1.5rem] sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold sm:text-2xl">{item.role}</h3>
                        <p className="text-sm text-white/65">{item.company}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Skills</p>
              <div className="mt-5 space-y-3">
                {content.skills.map((skill, index) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                      <span>{skill}</span>
                      <span>{Math.max(72, 94 - index * 3)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.max(72, 94 - index * 3)}%`,
                          background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-black/8 bg-[var(--secondary-color)] p-4 text-slate-950 sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-900/60">Education</p>
              <div className="mt-5 space-y-4">
                {content.education.map((item) => (
                  <article key={`${item.degree}-${item.institution}`} className="rounded-[1.2rem] bg-white/75 p-4 sm:rounded-[1.5rem]">
                    <h3 className="font-display text-lg font-semibold sm:text-xl">{item.degree}</h3>
                    <p className="mt-1 text-sm text-slate-700">{item.institution}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{item.year}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
