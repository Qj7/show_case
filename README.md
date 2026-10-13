# Orbita — портфолио команды

Next.js 16 (App Router, static export), Tailwind CSS v4, TypeScript. Сайт целиком собирается в статику (`out/`), клиентского JS почти нет: фильтр работ, анимации появления и бегущая строка сделаны на CSS.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # статическая сборка в out/
```

## Где что править

| Что | Файл |
| --- | --- |
| Название, описание, контакты | `src/content/site.ts` |
| Проекты (кейсы) | `src/content/projects.ts` |
| Услуги, процесс, стек в бегущей строке | `src/content/services.ts` |
| Цвета и шрифты | `src/app/globals.css` (`@theme`), `src/app/layout.tsx` |

## Как добавить проект

1. Положите скриншоты в `public/projects/<slug>/` (лучше `.webp`, обложка 1600×1200).
2. Добавьте объект в массив `projects` в `src/content/projects.ts`:

```ts
{
  slug: "my-app",
  title: "My App",
  summary: "Одно-два предложения о проекте.",
  year: 2026,
  categories: ["mobile", "desktop"], // web | mobile | desktop | bots
  stack: ["React Native", "Tauri"],
  accent: ["#22d3ee", "#a855f7"],     // цвета сгенерированной обложки, пока нет скриншота
  cover: "/projects/my-app/cover.webp",
  gallery: ["/projects/my-app/1.webp", "/projects/my-app/2.webp"],
  url: "https://my-app.com",
  role: "Дизайн и разработка",
  ai: true,        // бейдж «Сделано с AI-агентами в Cursor» и фильтр «Сделано с AI»
  featured: true,  // показывать в начале списка
  story: { task: "…", solution: "…", result: "…" },
}
```

Страница `/work/<slug>`, карточка, фильтр и sitemap обновятся автоматически. Фильтр показывает только категории, в которых есть проекты.

## Деплой

Сайт публикуется на GitHub Pages через `.github/workflows/deploy.yml` при каждом пуше в `main`.

Один раз в репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Workflow сам подставляет при сборке:

- `NEXT_PUBLIC_BASE_PATH` — префикс пути (`/show_case` для `qj7.github.io/show_case`, пусто для своего домена);
- `NEXT_PUBLIC_SITE_URL` — полный адрес сайта, от него строятся sitemap, robots и OG-картинки.

Картинки из `public/` в `next/image` оборачивайте в `asset()` из `src/content/site.ts` — иначе на GitHub Pages они не получат префикс пути. Ссылки через `next/link` префикс получают автоматически.

Проверить сборку как на GitHub Pages локально:

```bash
NEXT_PUBLIC_BASE_PATH=/show_case NEXT_PUBLIC_SITE_URL=https://qj7.github.io/show_case npm run build
```
