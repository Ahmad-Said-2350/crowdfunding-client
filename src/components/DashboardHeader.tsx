export function DashboardHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      <p className="pk-kicker">{eyebrow}</p>
      <h1 className="pk-title mt-2">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
    </header>
  );
}
