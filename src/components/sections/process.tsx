import { SectionHeading } from "@/components/section-heading";
import { process } from "@/content/services";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        id="process-title"
        eyebrow="Как мы работаем"
        title="Прозрачно на каждом шаге"
        text="Вы всегда знаете, что происходит с проектом: демо каждую неделю, понятные сроки, без сюрпризов в конце."
      />

      <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
        {process.map((step, i) => (
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
