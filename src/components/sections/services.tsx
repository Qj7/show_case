import { SectionHeading } from "@/components/section-heading";
import { services } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Services() {
  const dict = await getDictionary();
  const t = dict.services;

  return (
    <section id="services" aria-labelledby="services-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        id="services-title"
        eyebrow={t.eyebrow}
        title={
          <>
            {t.title}
            <span className="text-gradient">{t.titleAccent}</span>
          </>
        }
        text={t.text}
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => {
          const item = t.items[s.id];
          return (
            <li
              key={s.id}
              className={`card-glow reveal group flex flex-col justify-between rounded-3xl border border-line bg-surface p-7 transition-colors hover:bg-elevated md:min-h-72 ${s.wide ? "md:col-span-2" : ""}`}
            >
              <div>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{item.text}</p>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {item.points.map((p) => (
                  <li key={p} className="rounded-full border border-line px-3 py-1.5 text-xs text-fg/80">
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
