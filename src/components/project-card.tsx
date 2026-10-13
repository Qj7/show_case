import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";
import type { Project } from "@/content/projects";
import { localeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <li data-cat={project.categories.join(" ")} data-ai={project.ai || undefined} className="reveal">
      <Link
        href={localeHref(locale, `/work/${project.slug}/`)}
        prefetch
        className="card-glow group block rounded-3xl border border-line bg-surface p-2 transition-colors hover:bg-elevated"
      >
        <ProjectCover project={project} priority={priority} className="aspect-[4/3] rounded-[1.25rem]" />
        <div className="flex items-start justify-between gap-4 px-4 pt-5 pb-4">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary[locale]}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent group-hover:text-black">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 text-xs text-muted">
          <span className="font-mono">{project.year}</span>
          <span className="text-white/20">/</span>
          {project.categories.map((c) => (
            <span key={c}>{dict.categories[c]}</span>
          ))}
          {project.ai && (
            <span className="ml-auto rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
              {dict.project.aiShort}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}
