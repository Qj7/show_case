import { VioletGeoHero } from "@/components/VioletGeoHero";

export default function Home() {
  return (
    <VioletGeoHero
      title="Создаём сайты, приложения и\u00a0сервисы под\u00a0ключ"
      lead="Команда дизайнеров и разработчиков. Делаем веб, мобильные и десктопные продукты: от идеи и прототипа до релиза и поддержки."
      cta={{ label: "Обсудить проект", href: "#contact" }}
      secondary={{ label: "Смотреть работы", href: "#work" }}
      platforms={[
        { id: "web", label: "Web", description: "Сайты и сервисы" },
        { id: "mobile", label: "iOS · Android", description: "Мобильные приложения" },
        { id: "desktop", label: "macOS · Windows", description: "Десктоп-приложения" },
        { id: "bots", label: "Telegram", description: "Mini Apps и боты" },
      ]}
      stats={[
        { value: "10+ лет", label: "в разработке" },
        { value: "4", label: "платформы" },
        { value: "Под ключ", label: "от идеи до релиза" },
      ]}
    />
  );
}
