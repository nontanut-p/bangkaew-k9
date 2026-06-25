"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";

function AlertCard({
  title,
  severity,
  className,
}: {
  title: string;
  severity: "high" | "medium" | "low";
  className?: string;
}) {
  const colors = {
    high: "border-red-500/40 bg-red-500/10 text-red-300",
    medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    low: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  };

  return (
    <div
      className={`glass-card animate-float rounded-lg px-3 py-2 text-xs ${colors[severity]} ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {title}
      </div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2L4 6v6c0 5.25 3.5 10 8 12 4.5-2 8-6.75 8-12V6l-8-4z"
      />
    </svg>
  );
}

function NetworkNode({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 ${className ?? ""}`}
    >
      <div className="h-2 w-2 rounded-full bg-cyan-400" />
    </div>
  );
}

export function Hero() {
  const { hero } = useContent();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative z-10">
            <span className="badge mb-6">{hero.badge}</span>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {hero.title}{" "}
              <span className="gradient-text">{hero.titleHighlight}</span>
            </h1>
            <p className="mt-4 text-xl font-medium text-slate-300 sm:text-2xl">
              {hero.subtitle}
            </p>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-400">
              {hero.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#story">{hero.ctaPrimary}</Button>
              <Button href="/demo" variant="secondary">
                {hero.ctaSecondary}
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
              {hero.trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <ShieldIcon className="h-4 w-4 text-cyan-400" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-600/20 blur-2xl" />

              <div className="glass-card relative overflow-hidden rounded-3xl p-2">
                <Image
                  src="/k9-hero-mascot.png"
                  alt={hero.imageAlt}
                  width={600}
                  height={600}
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>

              {hero.alerts.map((alert, i) => (
                <AlertCard
                  key={alert.title}
                  title={alert.title}
                  severity={alert.severity}
                  className={
                    i === 0
                      ? "absolute -left-4 top-8 animate-float-delayed"
                      : i === 1
                        ? "absolute -right-2 top-24"
                        : "absolute -bottom-2 left-8"
                  }
                />
              ))}

              <NetworkNode className="absolute right-12 top-4 animate-pulse-slow" />
              <NetworkNode className="absolute bottom-16 right-4 animate-pulse-slow" />
              <ShieldIcon className="absolute left-6 bottom-24 h-6 w-6 text-cyan-400/60" />
              <ShieldIcon className="absolute right-8 bottom-32 h-5 w-5 text-amber-400/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
