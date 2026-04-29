import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchPostBySlug } from "@/lib/wordpress";
import type { Metadata } from "next";
import { applyRussianNbsp } from "@/lib/ru-typography";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: "Материал не найден" };
  const title = post.title.rendered.replace(/<[^>]+>/g, "");
  return { title };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const title = post.title.rendered.replace(/<[^>]+>/g, "");

  return (
    <Container className="py-12 md:max-w-3xl md:py-16">
      <nav className="text-sm text-brand-muted">
        <Link href="/news" className="hover:text-brand-primary">
          Новости
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text">Материал</span>
      </nav>
      <Card className="mt-6 p-8">
        <time dateTime={post.date} className="text-xs uppercase tracking-[0.08em] text-brand-muted">
          {new Date(post.date).toLocaleDateString("ru-RU")}
        </time>
        <h1 className="mt-4 font-heading text-4xl font-bold text-brand-primary">{title}</h1>
        <div
          className="mt-10 space-y-6 text-lg leading-relaxed text-brand-text [&_a]:text-brand-accent [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </Card>

      <Card className="mt-8 bg-brand-surface p-6">
        <h2 className="font-heading text-xl font-semibold text-brand-primary">
          Нужна консультация по вашему объекту?
        </h2>
        <p className="mt-3 text-sm text-brand-muted">
          {applyRussianNbsp(
            "Свяжитесь с инженером «Авант» — поможем применить решения из статьи к вашему проекту и подберём подходящее оборудование.",
          )}
        </p>
        <div className="mt-4">
          <Button href="/contacts" size="sm">
            Обсудить проект
          </Button>
        </div>
      </Card>
    </Container>
  );
}
