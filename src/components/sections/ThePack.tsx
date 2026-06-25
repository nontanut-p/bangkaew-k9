"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContent } from "@/context/ContentContext";

export function ThePack() {
  const { pack } = useContent();

  return (
    <section id="pack" className="py-20 lg:py-28">
      <div className="section-container">
        <SectionHeader
          badge={pack.badge}
          title={pack.title}
          description={pack.description}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pack.members.map((member) => (
            <div
              key={member.agentName}
              className={`glass-card-hover group overflow-hidden border-t-2 ${member.borderColor}`}
            >
              <div className="relative h-48 overflow-hidden sm:h-52">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10`}
                />
                <Image
                  src={member.image}
                  alt={member.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-cyan-400/80">
                    {member.role}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {pack.agentPrefix} {member.agentName}
                  </h3>
                  <p className="text-sm text-slate-400">{member.breed}</p>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs text-slate-400">
                    {pack.poweredBy}{" "}
                    <span className="text-cyan-300">{member.tool}</span>
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  {member.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {member.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
