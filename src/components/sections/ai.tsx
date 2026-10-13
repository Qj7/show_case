import { getDictionary } from "@/i18n/get-dictionary";

export async function AiSection() {
  const dict = await getDictionary();
  const t = dict.ai;

  return (
    <section aria-labelledby="ai-title" className="px-4 py-12 md:py-20">
      <div className="noise relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-16 md:px-14 md:py-20">
        <div aria-hidden className="absolute -top-40 -right-40 -z-10 size-[30rem] rounded-full bg-violet/30 blur-[100px]" />
        <div aria-hidden className="absolute -bottom-48 -left-24 -z-10 size-[26rem] rounded-full bg-accent/10 blur-[100px]" />

        <div className="reveal grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-muted uppercase">
              <span className="h-px w-8 bg-accent" />
              {t.eyebrow}
            </p>
            <h2 id="ai-title" className="font-display text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
              {t.title}
              <span className="text-gradient">{t.titleAccent}</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted">{t.text}</p>
          </div>

          <ul className="grid gap-3">
            {t.points.map((p) => (
              <li key={p.value} className="flex items-baseline gap-5 rounded-2xl border border-line bg-bg/40 p-5 backdrop-blur">
                <strong className="font-display text-2xl font-semibold text-accent">{p.value}</strong>
                <span className="text-sm text-muted">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
