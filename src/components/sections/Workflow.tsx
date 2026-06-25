"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function Workflow() {
  const { workflow } = useContent();

  return (
    <section id="workflow" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader badge={workflow.badge} title={workflow.title} />

        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {workflow.steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="glass-card-hover flex h-full flex-col items-center p-4 text-center lg:p-5">
                  <span className="font-mono text-xs text-cyan-400/60">
                    {step.step}
                  </span>
                  <span className="mt-2 text-2xl">{step.icon}</span>
                  <h3 className="mt-3 font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-cyan-400/80">{step.subtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>

                {index < workflow.steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-cyan-500/40 lg:block">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
