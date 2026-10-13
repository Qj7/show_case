import { stack } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Marquee() {
  const dict = await getDictionary();

  return (
    <section aria-label={dict.marquee.label} className="border-y border-line bg-surface/50 py-6">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="flex shrink-0 animate-marquee items-center gap-12 pr-12 hover:[animation-play-state:paused]">
          {[...stack, ...stack].map((item, i) => (
            <li
              key={i}
              aria-hidden={i >= stack.length || undefined}
              className="flex items-center gap-12 font-display text-lg whitespace-nowrap text-muted"
            >
              {item}
              <span className="size-1.5 rounded-full bg-accent/60" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
