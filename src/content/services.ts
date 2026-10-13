export type ServiceId = "web" | "mobile" | "desktop" | "bots" | "design" | "backend";

export const services: { id: ServiceId; wide?: boolean }[] = [
  { id: "web", wide: true },
  { id: "mobile" },
  { id: "desktop" },
  { id: "bots", wide: true },
  { id: "design" },
  { id: "backend", wide: true },
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
