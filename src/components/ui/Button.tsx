import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

export function Button({
  href,
  children,
  variant = "primary",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
}) {
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
