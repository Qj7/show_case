export type Service = {
  id: string;
  title: string;
  text: string;
  points: string[];
  wide?: boolean;
};

export const services: Service[] = [
  {
    id: "web",
    title: "Веб-разработка",
    text: "Сайты, лендинги, интернет-магазины и сложные веб-сервисы. Быстрые, адаптивные, готовые к SEO.",
    points: ["Next.js · React", "E-commerce", "Личные кабинеты", "CMS и админки"],
    wide: true,
  },
  {
    id: "mobile",
    title: "Мобильные приложения",
    text: "Кроссплатформенные приложения для iOS и Android с нативным ощущением.",
    points: ["React Native", "Expo", "Публикация в сторах"],
  },
  {
    id: "desktop",
    title: "Десктоп",
    text: "Приложения для macOS, Windows и Linux из одной кодовой базы.",
    points: ["Electron", "Tauri", "Автообновления"],
  },
  {
    id: "bots",
    title: "Telegram Mini Apps и боты",
    text: "Магазины, сервисы и автоматизация прямо внутри Telegram.",
    points: ["Mini Apps", "Боты на Python", "Платежи"],
    wide: true,
  },
  {
    id: "design",
    title: "UI/UX-дизайн",
    text: "Прототипы, дизайн-системы и интерфейсы, которые понятны с первого экрана.",
    points: ["Figma", "Дизайн-системы", "Прототипы"],
  },
  {
    id: "backend",
    title: "Бэкенд и инфраструктура",
    text: "API, интеграции, базы данных, серверы и CI/CD. Берём на себя всё, что под капотом.",
    points: ["Ruby on Rails", "Python", "PostgreSQL", "Docker"],
    wide: true,
  },
];

export const process = [
  {
    title: "Бриф",
    text: "Разбираемся в задаче и бизнесе, фиксируем цели, сроки и бюджет.",
  },
  {
    title: "Дизайн",
    text: "Собираем прототип и визуал. Вы видите продукт до того, как он написан.",
  },
  {
    title: "Разработка",
    text: "Короткие итерации с демо каждую неделю. AI-агенты ускоряют рутину, люди отвечают за качество.",
  },
  {
    title: "Запуск и рост",
    text: "Деплой, аналитика, поддержка и развитие продукта после релиза.",
  },
];

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "React Native",
  "Expo",
  "Electron",
  "Tauri",
  "Ruby on Rails",
  "Python",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Telegram Mini Apps",
  "Docker",
  "Vercel",
  "Figma",
  "Cursor AI",
];
