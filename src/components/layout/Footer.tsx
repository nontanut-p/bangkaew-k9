"use client";

import { useContent } from "@/context/ContentContext";

export function Footer() {
  const { footer, locale } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-navy-900/50 py-12">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
              K9
            </div>
            <span className="font-semibold text-white">
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
          </div>
          <p className="text-center text-sm text-slate-500">{footer.tagline}</p>
          <p className="text-sm text-slate-600">
            {footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
