import type { Localized } from "@/i18n/config";

export const categoryIds = ["web", "mobile", "desktop", "bots"] as const;

export type Category = (typeof categoryIds)[number];

export type Project = {
  slug: string;
  title: string;
  summary: Localized;
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
  role?: Localized;
  /** Built with AI agents in Cursor. */
  ai?: boolean;
  featured?: boolean;
  story?: {
    task?: Localized;
    solution?: Localized;
    result?: Localized;
  };
};

const designAndDev: Localized = {
  ru: "Дизайн и разработка",
  en: "Design and development",
  vi: "Thiết kế và phát triển",
  es: "Diseño y desarrollo",
};

export const projects: Project[] = [
  {
    slug: "hanoi-exchange",
    title: "Hanoi Exchange",
    summary: {
      ru: "Веб-сервис для обмена валют в Ханое: актуальные курсы и быстрая заявка с телефона.",
      en: "A currency exchange web service in Hanoi: live rates and a quick request from your phone.",
      vi: "Dịch vụ web đổi tiền tại Hà Nội: tỷ giá cập nhật và gửi yêu cầu nhanh từ điện thoại.",
      es: "Servicio web de cambio de divisas en Hanói: tipos actualizados y solicitud rápida desde el móvil.",
    },
    year: 2025,
    categories: ["web"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    accent: ["#f97316", "#7c3aed"],
    url: "https://hanoi-exchange.vercel.app",
    role: designAndDev,
    featured: true,
    story: {
      task: {
        ru: "Сделать понятный сервис, где турист за минуту узнаёт курс и оставляет заявку на обмен.",
        en: "Build a clear service where a tourist can check the rate and request an exchange in a minute.",
        vi: "Làm một dịch vụ dễ hiểu, nơi du khách xem tỷ giá và gửi yêu cầu đổi tiền chỉ trong một phút.",
        es: "Crear un servicio claro donde un turista consulte el tipo de cambio y solicite el cambio en un minuto.",
      },
      solution: {
        ru: "Mobile-first интерфейс, калькулятор курса и короткая форма заявки. Сделали два варианта дизайна для A/B-сравнения.",
        en: "A mobile-first interface, a rate calculator and a short request form. We made two design variants for A/B comparison.",
        vi: "Giao diện ưu tiên di động, máy tính tỷ giá và form yêu cầu ngắn gọn. Chúng tôi làm hai phương án thiết kế để so sánh A/B.",
        es: "Interfaz mobile-first, calculadora de tipo de cambio y un formulario breve. Hicimos dos variantes de diseño para una comparación A/B.",
      },
    },
  },
  {
    slug: "esho",
    title: "Esho",
    summary: {
      ru: "Основной сайт бренда и отдельный рекламный лендинг под платный трафик.",
      en: "The brand's main website and a separate landing page for paid traffic.",
      vi: "Website chính của thương hiệu và một landing page riêng cho quảng cáo trả phí.",
      es: "Web principal de la marca y una landing independiente para tráfico de pago.",
    },
    year: 2025,
    categories: ["web"],
    stack: ["Next.js", "TypeScript", "Vercel"],
    accent: ["#06b6d4", "#2563eb"],
    url: "https://esho-main.vercel.app",
    role: designAndDev,
    featured: true,
  },
  {
    slug: "galactica",
    title: "Galactica",
    summary: {
      ru: "Telegram Mini App и поисковый бот: каталог и поиск прямо внутри мессенджера.",
      en: "A Telegram Mini App and search bot: catalog and search right inside the messenger.",
      vi: "Telegram Mini App và bot tìm kiếm: danh mục và tìm kiếm ngay trong ứng dụng nhắn tin.",
      es: "Telegram Mini App y bot de búsqueda: catálogo y búsqueda dentro del propio mensajero.",
    },
    year: 2025,
    categories: ["bots"],
    stack: ["TypeScript", "Telegram Mini Apps", "Python"],
    accent: ["#8b5cf6", "#ec4899"],
    role: {
      ru: "Разработка Mini App и бота",
      en: "Mini App and bot development",
      vi: "Phát triển Mini App và bot",
      es: "Desarrollo de la Mini App y el bot",
    },
    featured: true,
  },
  {
    slug: "ger-shop",
    title: "GER",
    summary: {
      ru: "Интернет-магазин климатической техники и серия лендингов под отдельные направления бизнеса.",
      en: "An online store for climate equipment and a series of landing pages for individual business lines.",
      vi: "Cửa hàng trực tuyến thiết bị điều hòa không khí và loạt landing page cho từng mảng kinh doanh.",
      es: "Tienda online de equipos de climatización y una serie de landings para cada línea de negocio.",
    },
    year: 2024,
    categories: ["web"],
    stack: ["TypeScript", "React", "HTML/CSS"],
    accent: ["#10b981", "#0ea5e9"],
    role: {
      ru: "E-commerce и лендинги",
      en: "E-commerce and landing pages",
      vi: "Thương mại điện tử và landing page",
      es: "E-commerce y landings",
    },
  },
  {
    slug: "sport-marketing",
    title: "Sport Marketing",
    summary: {
      ru: "Промо-лендинг агентства спортивного маркетинга с акцентом на кейсы и заявки.",
      en: "A promo landing page for a sports marketing agency focused on case studies and leads.",
      vi: "Landing page quảng bá cho agency marketing thể thao, tập trung vào case study và thu hút khách hàng.",
      es: "Landing promocional para una agencia de marketing deportivo, centrada en casos de éxito y captación de clientes.",
    },
    year: 2024,
    categories: ["web"],
    stack: ["TypeScript", "React"],
    accent: ["#ef4444", "#f59e0b"],
    role: {
      ru: "Лендинг",
      en: "Landing page",
      vi: "Landing page",
      es: "Landing page",
    },
  },
  {
    slug: "danang-realtor",
    title: "Danang Realtor",
    summary: {
      ru: "Сайт агентства недвижимости в Дананге и схема базы данных объектов.",
      en: "A website for a Da Nang real estate agency and a database schema for its property listings.",
      vi: "Website cho công ty bất động sản tại Đà Nẵng và thiết kế cơ sở dữ liệu bất động sản.",
      es: "Web de una agencia inmobiliaria en Da Nang y el esquema de base de datos de sus inmuebles.",
    },
    year: 2023,
    categories: ["web"],
    stack: ["HTML/CSS", "JavaScript", "SQL"],
    accent: ["#14b8a6", "#4f46e5"],
    role: {
      ru: "Сайт и проектирование БД",
      en: "Website and database design",
      vi: "Website và thiết kế cơ sở dữ liệu",
      es: "Sitio web y diseño de la base de datos",
    },
  },
  {
    slug: "pwa-rails",
    title: "PWA on Rails",
    summary: {
      ru: "Прогрессивное веб-приложение на Ruby on Rails: установка на телефон и работа офлайн.",
      en: "A progressive web app on Ruby on Rails: installs on your phone and works offline.",
      vi: "Ứng dụng web tiến bộ (PWA) trên Ruby on Rails: cài lên điện thoại và hoạt động offline.",
      es: "Aplicación web progresiva en Ruby on Rails: se instala en el móvil y funciona sin conexión.",
    },
    year: 2022,
    categories: ["web", "mobile"],
    stack: ["Ruby on Rails", "PWA", "Service Worker"],
    accent: ["#e11d48", "#9333ea"],
    role: {
      ru: "Разработка",
      en: "Development",
      vi: "Phát triển",
      es: "Desarrollo",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function usedCategories() {
  const used = new Set(projects.flatMap((p) => p.categories));
  return categoryIds.filter((c) => used.has(c));
}
