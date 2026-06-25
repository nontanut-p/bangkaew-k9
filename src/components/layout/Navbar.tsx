"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";
import { getLocalePath } from "@/content";

export function Navbar() {
  const { nav, locale } = useContent();
  const homePath = getLocalePath(locale);
  const switchPath = getLocalePath(nav.langSwitchTarget);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-navy-950/80 backdrop-blur-xl">
      <nav className="section-container flex h-16 items-center justify-between">
        <Link href={homePath} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-glow">
            K9
          </div>
          <span className="text-lg font-bold text-white">
            {locale === "th" ? (
              <>
                บางแก้ว <span className="text-cyan-400">K9</span>
              </>
            ) : (
              <>
                Bangkaew <span className="text-cyan-400">K9</span>
              </>
            )}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={switchPath}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400"
          >
            {nav.langSwitch}
          </Link>
          <Button href="#demo" variant="secondary">
            {nav.requestDemo}
          </Button>
        </div>
      </nav>
    </header>
  );
}
