"use client";

import { Button } from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";

export function FinalCTA() {
  const { cta } = useContent();

  return (
    <section id="demo" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-navy-800 to-blue-600/10 p-12 text-center lg:p-16">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10">
            <span className="text-5xl">🐕</span>
            <h2 className="mt-6 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-300">
              {cta.description}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="mailto:demo@bangkaew-k9.dev">{cta.primary}</Button>
              <Button href="#tech" variant="secondary">
                {cta.secondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
