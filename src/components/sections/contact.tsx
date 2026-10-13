import { site } from "@/content/site";
import { getDictionary } from "@/i18n/get-dictionary";

export async function Contact() {
  const dict = await getDictionary();
  const t = dict.contact;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden px-6 py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute bottom-[-30%] left-1/2 size-[50rem] -translate-x-1/2 rounded-full bg-violet/25 blur-[140px]" />
        <div className="grid-bg absolute inset-0 rotate-180" />
      </div>

      <div className="reveal mx-auto max-w-4xl text-center">
        <p className="mb-6 text-xs font-medium tracking-[0.2em] text-muted uppercase">{t.eyebrow}</p>
        <h2 id="contact-title" className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
          {t.title}
          <span className="text-gradient">{t.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.text}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a
            href={site.contacts.telegram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.6 13.4 2 12c-1-.3-1-1 .2-1.5L20.6 3.4c.8-.3 1.6.2 1.3.9z" />
            </svg>
            {t.telegram}
          </a>
          <a
            href={`mailto:${site.contacts.email}`}
            className="inline-flex items-center rounded-full border border-line bg-white/[0.03] px-8 py-4 font-semibold backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            {site.contacts.email}
          </a>
        </div>
      </div>
    </section>
  );
}
