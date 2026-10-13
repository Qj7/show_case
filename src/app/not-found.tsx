import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="font-display text-[clamp(6rem,20vw,12rem)] leading-none font-bold tracking-tighter text-gradient">404</p>
      <h1 className="mt-6 font-display text-2xl font-semibold">Такой страницы нет</h1>
      <p className="mt-3 text-muted">Возможно, она переехала или никогда не существовала.</p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-accent px-7 py-4 font-semibold text-black transition-transform hover:scale-[1.03]"
      >
        На главную
      </Link>
    </section>
  );
}
