import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { th } from "@/content";

export const metadata: Metadata = {
  title: th.metadata.title,
  description: th.metadata.description,
};

export default function ThaiHome() {
  return <LandingPage content={th} />;
}
