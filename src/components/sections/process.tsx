import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Process() {
  const dict = await getDictionary();
  const t = dict.process;

  return (
    <section id="process" aria-labelledby="process-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading id="process-title" eyebrow={t.eyebrow} title={t.title} text={t.text} />

      <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
        {t.steps.map((step, i) => (
          <li key={step.title} className="reveal group bg-bg p-7 transition-colors hover:bg-surface">
            <span className="font-display text-5xl font-semibold text-white/10 transition-colors group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-10 font-display text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
