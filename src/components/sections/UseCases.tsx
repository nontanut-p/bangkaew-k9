"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function UseCases() {
  const { useCases } = useContent();

  return (
    <section id="use-cases" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader badge={useCases.badge} title={useCases.title} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.items.map((useCase, index) => (
            <div
              key={useCase.title}
              className={`glass-card-hover p-6 ${index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span className="text-3xl">{useCase.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {useCase.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
