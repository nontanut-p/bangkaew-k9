"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function KeyFeatures() {
  const { features } = useContent();

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader badge={features.badge} title={features.title} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((feature) => (
            <div key={feature.title} className="glass-card-hover group p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-xl transition-colors group-hover:bg-cyan-500/20">
                {feature.icon}
              </div>
              <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
