"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function Roadmap() {
  const { roadmap } = useContent();

  return (
    <section id="roadmap" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader
          badge={roadmap.badge}
          title={roadmap.title}
          description={roadmap.description}
        />

        <div className="relative">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent lg:left-1/2 lg:-translate-x-px" />

          <div className="space-y-8">
            {roadmap.phases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative flex items-center gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              >
                <div className="hidden flex-1 lg:block" />

                <div
                  className={`absolute left-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full lg:left-1/2 ${
                    phase.status === "current"
                      ? "bg-cyan-400 shadow-glow"
                      : "border border-slate-600 bg-navy-800"
                  }`}
                >
                  {phase.status === "current" && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  )}
                </div>

                <div
                  className={`ml-12 flex-1 lg:ml-0 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}
                >
                  <div
                    className={`glass-card-hover inline-block p-6 ${phase.status === "current" ? "border-cyan-400/30" : ""}`}
                  >
                    <span
                      className={`font-mono text-xs ${phase.status === "current" ? "text-cyan-400" : "text-slate-500"}`}
                    >
                      {phase.phase}
                      {phase.status === "current" && roadmap.inProgress}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {phase.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
