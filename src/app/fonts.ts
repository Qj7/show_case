import { Manrope, Unbounded } from "next/font/google";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  display: "swap",
});

export const fontVariables = `${manrope.variable} ${unbounded.variable}`;
