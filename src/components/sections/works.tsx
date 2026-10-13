import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, projects, usedCategories } from "@/content/projects";

export function Works() {
  const sorted = [...projects].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.year - a.year,
  );
  const filters = [
    { id: "all", label: "Все" },
    ...usedCategories().map((c) => ({ id: c, label: categories[c] })),
    ...(projects.some((p) => p.ai) ? [{ id: "ai", label: "Сделано с AI" }] : []),
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="works mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        id="work-title"
        eyebrow="Избранные работы"
        title={
          <>
            Проекты, которые <span className="text-gradient">уже работают</span>
          </>
        }
        text="Сайты, сервисы и приложения для бизнеса: от лендинга за неделю до продукта с личным кабинетом и интеграциями."
      />

      {filters.length > 2 && (
        <fieldset className="reveal mb-10 flex flex-wrap gap-2">
          <legend className="sr-only">Фильтр по типу проекта</legend>
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
