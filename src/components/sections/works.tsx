import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { projects, usedCategories } from "@/content/projects";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Works() {
  const dict = await getDictionary();
  const t = dict.works;
  const sorted = [...projects].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.year - a.year,
  );
  const filters = [
    { id: "all", label: t.all },
    ...usedCategories().map((c) => ({ id: c, label: dict.categories[c] })),
    ...(projects.some((p) => p.ai) ? [{ id: "ai", label: t.ai }] : []),
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="works mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        id="work-title"
        eyebrow={t.eyebrow}
        title={
          <>
            {t.title}
            <span className="text-gradient">{t.titleAccent}</span>
          </>
        }
        text={t.text}
      />

      {filters.length > 2 && (
        <fieldset className="reveal mb-10 flex flex-wrap gap-2">
          <legend className="sr-only">{t.filterLegend}</legend>
          {filters.map((f) => (
            <label
              key={f.id}
              className="filter-chip cursor-pointer rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <input type="radio" name="work-filter" id={`f-${f.id}`} defaultChecked={f.id === "all"} className="sr-only" />
              {f.label}
            </label>
          ))}
        </fieldset>
      )}

      <ul className="grid gap-6 md:grid-cols-2">
        {sorted.map((project, i) => (
          <ProjectCard key={project.slug} project={project} priority={i < 2} />
        ))}
      </ul>
    </section>
  );
}
