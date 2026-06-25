import type { Content, Locale } from "./types";
import { th } from "./th";
import { en } from "./en";

const contentMap: Record<Locale, Content> = { th, en };

export function getContent(locale: Locale): Content {
  return contentMap[locale];
}

export function getLocalePath(locale: Locale): string {
  return locale === "en" ? "/" : "/th";
}

export { th, en };
export type { Content, Locale };
