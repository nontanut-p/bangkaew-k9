import type { Content } from "@/content/types";
import { ContentProvider } from "@/context/ContentContext";
import { GridBackground } from "@/components/ui/GridBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { ProductStory } from "@/components/sections/ProductStory";
import { ThePack } from "@/components/sections/ThePack";
import { Workflow } from "@/components/sections/Workflow";
import { KeyFeatures } from "@/components/sections/KeyFeatures";
import { Guardrails } from "@/components/sections/Guardrails";
import { TechStack } from "@/components/sections/TechStack";
import { UseCases } from "@/components/sections/UseCases";
import { Roadmap } from "@/components/sections/Roadmap";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function LandingPage({ content }: { content: Content }) {
  return (
    <ContentProvider content={content}>
      <GridBackground />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <ProductStory />
        <ThePack />
        <Workflow />
        <KeyFeatures />
        <Guardrails />
        <TechStack />
        <UseCases />
        <Roadmap />
        <FinalCTA />
      </main>
      <Footer />
    </ContentProvider>
  );
}
