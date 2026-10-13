import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Works } from "@/components/sections/works";
import { Services } from "@/components/sections/services";
import { AiSection } from "@/components/sections/ai";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Works />
      <Services />
      <AiSection />
      <Process />
      <Contact />
    </>
  );
}
