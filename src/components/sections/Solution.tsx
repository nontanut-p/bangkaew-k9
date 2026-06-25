"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function Solution() {
  const { solution } = useContent();

  return (
    <section id="solution" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader badge={solution.badge} title={solution.title} />

        <div className="glass-card mx-auto max-w-4xl p-8 lg:p-12">
          <p className="text-balance text-center text-lg leading-relaxed text-slate-300">
            {solution.bodyBefore}
            <span className="font-semibold text-cyan-400">
              {" "}
              {solution.highlight}{" "}
            </span>
            {solution.bodyAfter}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {solution.metaphors.map((item) => (
              <div
                key={item.role}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center"
              >
                <span className="text-3xl">{item.icon}</span>
                <h4 className="mt-3 font-semibold text-white">{item.role}</h4>
                <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
