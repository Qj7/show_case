export const categories = {
  web: "Веб",
  mobile: "Мобайл",
  desktop: "Десктоп",
  bots: "Telegram",
} as const;

export type Category = keyof typeof categories;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  categories: Category[];
  stack: string[];
  /** Two colors for the generated cover when there is no screenshot yet. */
  accent: [string, string];
  /** Path inside /public, e.g. "/projects/hanoi-exchange/cover.webp". */
  cover?: string;
  gallery?: string[];
  url?: string;
  client?: string;
  role?: string;
  /** Built with AI agents in Cursor. */
  ai?: boolean;
  featured?: boolean;
  story?: {
    task?: string;
    solution?: string;
    result?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "hanoi-exchange",
    title: "Hanoi Exchange",
    summary: "Веб-сервис для обмена валют в Ханое: актуальные курсы и быстрая заявка с телефона.",
    year: 2025,
    categories: ["web"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    accent: ["#f97316", "#7c3aed"],
    url: "https://hanoi-exchange.vercel.app",
    role: "Дизайн и разработка",
    featured: true,
    story: {
      task: "Сделать понятный сервис, где турист за минуту узнаёт курс и оставляет заявку на обмен.",
      solution: "Mobile-first интерфейс, калькулятор курса и короткая форма заявки. Сделали два варианта дизайна для A/B-сравнения.",
    },
  },
  {
    slug: "esho",
    title: "Esho",
    summary: "Основной сайт бренда и отдельный рекламный лендинг под платный трафик.",
    year: 2025,
    categories: ["web"],
    stack: ["Next.js", "TypeScript", "Vercel"],
    accent: ["#06b6d4", "#2563eb"],
    url: "https://esho-main.vercel.app",
    role: "Дизайн и разработка",
    featured: true,
  },
  {
    slug: "galactica",
    title: "Galactica",
    summary: "Telegram Mini App и поисковый бот: каталог и поиск прямо внутри мессенджера.",
    year: 2025,
    categories: ["bots"],
    stack: ["TypeScript", "Telegram Mini Apps", "Python"],
    accent: ["#8b5cf6", "#ec4899"],
    role: "Разработка Mini App и бота",
    featured: true,
  },
  {
    slug: "ger-shop",
    title: "GER",
    summary: "Интернет-магазин климатической техники и серия лендингов под отдельные направления бизнеса.",
    year: 2024,
    categories: ["web"],
    stack: ["TypeScript", "React", "HTML/CSS"],
    accent: ["#10b981", "#0ea5e9"],
    role: "E-commerce и лендинги",
  },
  {
    slug: "sport-marketing",
    title: "Sport Marketing",
    summary: "Промо-лендинг агентства спортивного маркетинга с акцентом на кейсы и заявки.",
    year: 2024,
    categories: ["web"],
    stack: ["TypeScript", "React"],
    accent: ["#ef4444", "#f59e0b"],
    role: "Лендинг",
  },
  {
    slug: "danang-realtor",
    title: "Danang Realtor",
    summary: "Сайт агентства недвижимости в Дананге и схема базы данных объектов.",
    year: 2023,
    categories: ["web"],
    stack: ["HTML/CSS", "JavaScript", "SQL"],
    accent: ["#14b8a6", "#4f46e5"],
    role: "Сайт и проектирование БД",
  },
  {
    slug: "pwa-rails",
    title: "PWA on Rails",
    summary: "Прогрессивное веб-приложение на Ruby on Rails: установка на телефон и работа офлайн.",
    year: 2022,
    categories: ["web", "mobile"],
    stack: ["Ruby on Rails", "PWA", "Service Worker"],
    accent: ["#e11d48", "#9333ea"],
    role: "Разработка",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function usedCategories() {
  const used = new Set(projects.flatMap((p) => p.categories));
  return (Object.keys(categories) as Category[]).filter((c) => used.has(c));
}
