import type { DemoNavGroup } from "./types";
import { packAgents } from "./pack-agents";

/** Simplified nav: Home + 5 Pack agents only */
export const demoNavigation: DemoNavGroup[] = [
  {
    title: "Command",
    icon: "🏠",
    items: [{ label: "Pack HQ", href: "/demo" }],
  },
  {
    title: "The Pack",
    icon: "🐕",
    items: packAgents.map((a) => ({
      label: a.name,
      href: a.href,
    })),
  },
];

export function findDemoNavTitle(pathname: string): string {
  if (pathname === "/demo") return "Pack HQ";
  const agent = packAgents.find((a) => pathname.startsWith(a.href));
  if (agent) return `Agent ${agent.name}`;
  if (pathname.startsWith("/demo/incident/")) return "Incident";
  return "Demo";
}
