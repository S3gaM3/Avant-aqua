type Stat = { value: string; label: string };

export function StatsGrid({ items }: { items: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[var(--radius-sm)] border border-brand-border bg-white p-5"
        >
          <p className="text-4xl font-semibold text-brand-accent">{item.value}</p>
          <p className="mt-2 text-sm text-brand-muted">{item.label}</p>
        </article>
      ))}
    </div>
  );
}
