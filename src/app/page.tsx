import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { en } from "@/content";

export const metadata: Metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
};

export default function Home() {
  return <LandingPage content={en} />;
}
