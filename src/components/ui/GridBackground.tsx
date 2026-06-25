export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
    </div>
  );
}
