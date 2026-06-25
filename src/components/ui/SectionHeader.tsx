export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}: {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-12 max-w-3xl ${alignClass}`}>
      {badge && <span className="badge mb-4">{badge}</span>}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-lg leading-relaxed text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
