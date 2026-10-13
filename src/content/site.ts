export const site = {
  name: "Orbita",
  tagline: "Web · Mobile · Desktop",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  since: 2015,
  copyrightYear: 2026,
  contacts: {
    telegram: "https://t.me/your_handle",
    email: "hello@example.com",
  },
} as const;

/** `next/image` does not apply `basePath` to `src`, so files from /public must go through this. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const navSections = ["work", "services", "process", "contact"] as const;
