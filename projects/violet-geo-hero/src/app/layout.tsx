import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Violet geo hero — demo",
  description: "Альтернативный первый экран с фиолетовым геометрическим фоном",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fontVariables} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
