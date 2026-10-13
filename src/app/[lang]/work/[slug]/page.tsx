import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectCover } from "@/components/project-cover";
import { Contact } from "@/components/sections/contact";
import { getProject, projects } from "@/content/projects";
import { asset, site } from "@/content/site";
import { format, localeHref, locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/[lang]/work/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{ slug }, locale, previous] = await Promise.all([params, getLocale(), parent]);
  const project = getProject(slug);
  if (!project) return {};
  const summary = project.summary[locale];
  const path = `/work/${project.slug}/`;
  return {
    title: project.title,
    description: summary,
    alternates: {
      canonical: `${site.url}${localeHref(locale, path)}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${localeHref(l, path)}`])),
    },
    openGraph: { ...previous.openGraph, title: project.title, description: summary },
  };
}

const storyKeys = ["task", "solution", "result"] as const;

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-36 md:pt-44">
        <Link
          href={localeHref(locale, "#work")}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {dict.project.back}
        </Link>
        <Suspense fallback={<CaseSkeleton />}>
          {params.then(({ slug }) => (
            <ProjectCase slug={slug} />
          ))}
        </Suspense>
      </div>
      <Contact />
    </>
  );
}

function CaseSkeleton() {
  return (
    <div aria-hidden className="mt-10 animate-pulse">
      <div className="h-20 w-2/3 rounded-2xl bg-surface md:h-28" />
      <div className="mt-6 h-6 w-1/2 rounded-full bg-surface" />
      <div className="mt-14 h-24 rounded-2xl bg-surface" />
      <div className="mt-12 aspect-[16/9] rounded-3xl bg-surface" />
    </div>
  );
}

async function ProjectCase({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) notFound();

  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.project;

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const story = storyKeys.flatMap((key) => {
    const text = project.story?.[key]?.[locale];
    return text ? [{ key, text }] : [];
  });

  const meta = [
    { label: t.year, value: String(project.year) },
    { label: t.type, value: project.categories.map((c) => dict.categories[c]).join(", ") },
    project.role && { label: t.role, value: project.role[locale] },
    project.client && { label: t.client, value: project.client },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      <header className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          {project.ai && (
            <p className="mb-5 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
              {t.aiBadge}
            </p>
          )}
          <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] font-semibold tracking-[-0.03em]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{project.summary[locale]}</p>
        </div>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 justify-self-start rounded-full bg-accent px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03] md:justify-self-end"
          >
            {t.openSite}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        )}
      </header>

      <dl className="mt-14 grid grid-cols-2 gap-6 border-y border-line py-8 md:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <dt className="text-xs tracking-widest text-muted uppercase">{m.label}</dt>
            <dd className="font-medium">{m.value}</dd>
          </div>
        ))}
      </dl>

      <ProjectCover
        project={project}
        priority
        sizes="(min-width: 1152px) 1104px, 100vw"
        className="group mt-12 aspect-[16/9] rounded-3xl border border-line"
      />

      <div className="mt-20 grid gap-14 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-xs tracking-widest text-muted uppercase">{t.stack}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-line px-3 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {story.length > 0 && (
          <div className="space-y-12">
            {story.map(({ key, text }) => (
              <section key={key} className="reveal">
                <h2 className="font-display text-2xl font-semibold">{t[key]}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p>
              </section>
            ))}
          </div>
        )}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <ul className="mt-20 grid gap-6 md:grid-cols-2">
          {project.gallery.map((src, i) => (
            <li
              key={src}
              className={`reveal relative overflow-hidden rounded-3xl border border-line bg-surface ${i % 3 === 0 ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]"}`}
            >
              <Image
                src={asset(src)}
                alt={format(t.screen, { title: project.title, n: i + 1 })}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      <Link
        href={localeHref(locale, `/work/${next.slug}/`)}
        prefetch
        className="card-glow group mt-28 flex items-center justify-between gap-6 rounded-3xl border border-line bg-surface p-8 transition-colors hover:bg-elevated md:p-12"
      >
        <div>
          <p className="text-xs tracking-widest text-muted uppercase">{t.next}</p>
          <p className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">{next.title}</p>
        </div>
        <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </article>
  );
}
