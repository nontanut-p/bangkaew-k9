"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

const agentStyles: Record<string, string> = {
  Shepherd: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  Bangkaew: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  Retriever: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Collie: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  Pitbull: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

function EndpointGrid() {
  const endpoints = [
    { label: "SRV-01", type: "server" },
    { label: "SRV-02", type: "server" },
    { label: "IT-01", type: "laptop" },
    { label: "IT-02", type: "laptop" },
    { label: "IT-03", type: "laptop" },
    { label: "IT-04", type: "laptop" },
    { label: "IT-05", type: "laptop" },
    { label: "PC-01", type: "desktop" },
    { label: "PC-02", type: "desktop" },
    { label: "PC-03", type: "desktop" },
  ];

  return (
    <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
      {endpoints.map((ep, i) => (
        <div
          key={ep.label}
          className="flex flex-col items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-1 py-2"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="text-sm">
            {ep.type === "server" ? "🖥️" : ep.type === "laptop" ? "💻" : "🖥"}
          </span>
          <span className="font-mono text-[9px] text-slate-500">{ep.label}</span>
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
        </div>
      ))}
    </div>
  );
}

export function ProductStory() {
  const { story, pack } = useContent();

  return (
    <section id="story" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader
          badge={story.badge}
          title={story.title}
          description={story.description}
        />

        {/* 1-Click Deploy highlight */}
        <div className="relative mb-16 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-navy-800 to-blue-600/10 p-8 text-center lg:p-10">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-20" />
          <div className="relative z-10">
            <span className="badge mb-4">⚡ Deploy</span>
            <h3 className="text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {story.deployHighlight}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-slate-400">
              {story.deploySub}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Shepherd · Bangkaew · Retriever · Collie · Pitbull — ready to deploy
            </div>
          </div>
        </div>

        {/* Story chapters timeline */}
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent lg:left-8" />

          <div className="space-y-12">
            {story.chapters.map((chapter, index) => (
              <div key={chapter.chapter} className="relative pl-16 lg:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-cyan-400 bg-navy-950 lg:left-8">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>

                <div className="glass-card-hover p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400">
                      {chapter.chapter}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-slate-400">
                      {chapter.timing}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-3">
                    <span className="text-3xl">{chapter.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {chapter.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-slate-300">
                        {chapter.narrative}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5 border-t border-white/5 pt-5">
                    {chapter.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-slate-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Agent chips */}
                  {chapter.agents.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                      {chapter.agents.map((agent) => (
                        <span
                          key={agent}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${agentStyles[agent] ?? "border-white/10 bg-white/5 text-slate-300"}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {pack.agentPrefix} {agent}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Endpoint grid for chapter 1 */}
                  {index === 0 && <EndpointGrid />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
