"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function Problem() {
  const { problem } = useContent();

  return (
    <section id="problem" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader badge={problem.badge} title={problem.title} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problem.items.map((item, index) => (
            <div
              key={item.title}
              className={`glass-card-hover p-6 ${index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
