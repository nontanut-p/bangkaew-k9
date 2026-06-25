"use client";

const PACK_DOGS = [
  { src: "/runner/run-shepherd.png", name: "Shepherd" },
  { src: "/runner/run-bangkaew.png", name: "Bangkaew" },
  { src: "/runner/run-retriever.png", name: "Retriever" },
  { src: "/runner/run-collie.png", name: "Collie" },
  { src: "/runner/run-pitbull.png", name: "Pitbull" },
] as const;

const RUN_DURATION = 22;
const SPRITE_W = 48;
const SPRITE_H = 44;

export function PackRunner() {
  return (
    <div
      className="pack-runner-track relative h-12 overflow-hidden border-t border-cyan-500/10 bg-navy-950/90"
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-2 flex justify-around px-2 opacity-40">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="h-px w-1 rounded-full bg-cyan-400/60"
            style={{ opacity: i % 2 === 0 ? 1 : 0.35 }}
          />
        ))}
      </div>

      {PACK_DOGS.map((dog, i) => (
        <div
          key={dog.name}
          className="pack-runner-dog absolute bottom-1"
          style={{
            animationDelay: `${i * (RUN_DURATION / PACK_DOGS.length)}s`,
            animationDuration: `${RUN_DURATION}s`,
          }}
        >
          <div
            className="run-sprite"
            style={{
              width: SPRITE_W,
              height: SPRITE_H,
              backgroundImage: `url(${dog.src})`,
              backgroundSize: `${SPRITE_W * 2}px ${SPRITE_H}px`,
            }}
            role="img"
            aria-label={dog.name}
          />
        </div>
      ))}
    </div>
  );
}
