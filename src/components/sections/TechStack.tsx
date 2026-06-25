"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function TechStack() {
  const { tech } = useContent();

  return (
    <section id="tech" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader
          badge={tech.badge}
          title={tech.title}
          description={tech.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tech.stack.map((group) => (
            <div key={group.category} className="glass-card-hover p-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                {group.category}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
