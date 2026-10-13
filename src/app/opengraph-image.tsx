import { ogAlt, ogSize, renderOgImage } from "./og-image";

export const dynamic = "force-static";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage();
}
