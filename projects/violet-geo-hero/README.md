# Violet geo hero

Отдельный мини-проект: альтернативный первый экран с фиолетовыми бликами и интерактивной геометрической сеткой (Three.js). Не связан с основным сайтом `show_case`.

## Запуск

```bash
cd projects/violet-geo-hero
npm install
npm run dev
```

Откройте [http://localhost:3001](http://localhost:3001) (порт 3001, чтобы не мешать основному dev-серверу на 3000).

## Структура

- `src/components/VioletGeoHero.tsx` — разметка hero
- `src/components/NetBackground.tsx` + `net-scene.ts` — WebGL-фон

Скопируйте папку `projects/violet-geo-hero` в любой репозиторий и настройте тексты в `src/app/page.tsx`.
