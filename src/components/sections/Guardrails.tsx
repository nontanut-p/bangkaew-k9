"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function Guardrails() {
  const { guardrails } = useContent();

  return (
    <section id="guardrails" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader
          badge={guardrails.badge}
          title={guardrails.title}
          description={guardrails.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guardrails.items.map((item) => (
            <div
              key={item.title}
              className="glass-card border-l-2 border-l-amber-400/50 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-amber-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500">{item.subtitle}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
