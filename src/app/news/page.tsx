import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { fetchPosts } from "@/lib/wordpress";
import type { Metadata } from "next";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости и информационные материалы.",
};

export default async function NewsIndexPage() {
  const posts = await fetchPosts(24);

  return (
    <Section className="bg-brand-surface">
      <PageIntro
        title="Новости"
        current="Новости"
        description="Уведомления, графики работы, отраслевые публикации и практические материалы."
      />

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Card className="p-4">
              <div className="allpools-placeholder rounded-[6px] border border-brand-border p-2">
                <div className="h-[140px] rounded-[4px] border border-dashed border-brand-border bg-white/75" />
              </div>
              <time
                dateTime={post.date}
                className="mt-3 block text-xs uppercase tracking-[0.08em] text-brand-muted"
              >
                {new Date(post.date).toLocaleDateString("ru-RU")}
              </time>
              <h2 className="mt-2 text-lg font-semibold text-brand-primary">
                <Link href={`/news/${post.slug}`} className="hover:text-brand-accent">
                  {post.title.rendered.replace(/<[^>]+>/g, "")}
                </Link>
              </h2>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
