import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { PortfolioActions } from "@/components/portfolio/portfolio-actions";
import type { PortfolioTemplateProps } from "@/templates/types";

export function Glassmorphism({ record, portfolioUrl }: PortfolioTemplateProps) {
  const { user, content } = record;

  return (
    <div className="min-h-screen bg-[#09101e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_24%),linear-gradient(135deg,var(--primary-color),#111827_45%,var(--secondary-color))]" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <section className="glass-panel rounded-[2rem] p-7 text-slate-950 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-color)]">
                Frosted Interface
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                {content.name}
              </h1>
              <p className="mt-3 text-2xl text-slate-600">{content.role}</p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{content.about}</p>
            </div>
            <PortfolioActions portfolioUrl={portfolioUrl} resumeUrl={user.resume_url} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="grid gap-6">
            <div className="glass-panel rounded-[2rem] p-6 text-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Projects</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {content.projects.map((project) => (
                  <article key={`${project.title}-${project.description}`} className="rounded-[1.5rem] border border-white/55 bg-white/70 p-5">
                    <h2 className="font-display text-2xl font-semibold">{project.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 text-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Experience</p>
              <div className="mt-5 space-y-4">
                {content.experience.map((item) => (
                  <article key={`${item.company}-${item.role}`} className="rounded-[1.5rem] border border-white/55 bg-white/70 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{item.role}</h3>
                        <p className="text-sm text-slate-600">{item.company}</p>
                      </div>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="glass-panel rounded-[2rem] p-6 text-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Skills</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/65 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 text-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">Education</p>
              <div className="mt-5 space-y-4">
                {content.education.map((item) => (
                  <article key={`${item.degree}-${item.institution}`} className="rounded-[1.5rem] border border-white/55 bg-white/70 p-4">
                    <h3 className="font-display text-xl font-semibold">{item.degree}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.institution}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.26em] text-slate-400">{item.year}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 text-slate-950">
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
          </aside>
        </div>
      </div>
    </div>
  );
}
