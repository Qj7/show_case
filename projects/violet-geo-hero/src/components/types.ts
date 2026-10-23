export type VioletGeoHeroPlatformId = "web" | "mobile" | "desktop" | "bots";

export type VioletGeoHeroProps = {
  title: string;
  lead: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  platforms: Array<{
    id: VioletGeoHeroPlatformId;
    label: string;
    description: string;
  }>;
  stats: Array<{ value: string; label: string }>;
};
