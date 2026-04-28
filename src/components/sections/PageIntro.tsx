import Link from "next/link";

export function PageIntro({
  title,
  description,
  current,
}: {
  title: string;
  description?: string;
  current: string;
}) {
  return (
    <header>
      <nav className="text-sm text-brand-muted">
        <Link href="/" className="hover:text-brand-primary">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text">{current}</span>
      </nav>
      <h1 className="ds-title mt-3">{title}</h1>
      {description ? <p className="ds-subtitle max-w-3xl">{description}</p> : null}
    </header>
  );
}
