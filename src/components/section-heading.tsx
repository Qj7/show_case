export function SectionHeading({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  id?: string;
}) {
  return (
    <div className="reveal mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
      <div>
        <p className="mb-4 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-muted uppercase">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
      </div>
      {text && <p className="leading-relaxed text-muted md:text-right">{text}</p>}
    </div>
  );
}
