import { stackIcons } from "@/components/stack-icons";
import { stack } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";

function StackIcon({ name }: { name: string }) {
  const icon = stackIcons[name];
  if (!icon) return null;

  return (
    <svg viewBox="0 0 24 24" className="size-[1.15em] shrink-0" aria-hidden>
      <path fill={icon.color} d={icon.path} />
    </svg>
  );
}

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
              className="flex items-center gap-2.5 font-display text-lg whitespace-nowrap text-muted"
            >
              <StackIcon name={item} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
