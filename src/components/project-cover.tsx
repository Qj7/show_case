import Image from "next/image";
import type { Project } from "@/content/projects";
import { asset } from "@/content/site";

type Props = {
  project: Project;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function ProjectCover({ project, priority, sizes = "(min-width: 768px) 50vw, 100vw", className = "" }: Props) {
  const [a, b] = project.accent;

  if (project.cover) {
    return (
      <div className={`relative overflow-hidden bg-elevated ${className}`}>
        <Image
          src={asset(project.cover)}
          alt={`${project.title} — обложка проекта`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const isPhone = project.categories.includes("mobile") || project.categories.includes("bots");

  return (
    <div
      className={`relative overflow-hidden bg-elevated ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${a}b3, transparent 60%), radial-gradient(100% 90% at 100% 100%, ${b}cc, transparent 65%)`,
      }}
      aria-hidden
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <span className="absolute top-5 left-6 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none font-bold tracking-tighter text-white/10 select-none">
        {project.title}
      </span>

      {isPhone ? (
        <div className="absolute bottom-[-18%] left-1/2 h-[92%] w-[34%] min-w-32 -translate-x-1/2 rounded-[2rem] border border-white/15 bg-black/50 p-2 shadow-2xl backdrop-blur transition-transform duration-700 group-hover:-translate-y-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />
          <div className="space-y-2 px-2">
            <div className="h-16 rounded-xl" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-12 rounded-lg bg-white/10" />
              <div className="h-12 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute right-[-4%] bottom-[-10%] left-[12%] h-[72%] rounded-t-xl border border-white/15 bg-black/50 shadow-2xl backdrop-blur transition-transform duration-700 group-hover:-translate-y-3">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="ml-3 h-2 w-1/3 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-[1.4fr_1fr] gap-4 p-4">
            <div className="space-y-2.5">
              <div className="h-3 w-5/6 rounded-full bg-white/30" />
              <div className="h-3 w-2/3 rounded-full bg-white/20" />
              <div className="h-2 w-1/2 rounded-full bg-white/10" />
              <div className="mt-4 h-6 w-24 rounded-full" style={{ background: a }} />
            </div>
            <div className="rounded-lg" style={{ background: `linear-gradient(135deg, ${a}cc, ${b}cc)` }} />
          </div>
        </div>
      )}
    </div>
  );
}
