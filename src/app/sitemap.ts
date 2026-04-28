import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchPosts } from "@/lib/wordpress";
import { fetchProductCategories, fetchProducts } from "@/lib/woocommerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const [posts, categories, products] = await Promise.all([
    fetchPosts(50),
    fetchProductCategories({ hideEmpty: false }),
    fetchProducts({ perPage: 120 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/services",
    "/gallery",
    "/news",
    "/contacts",
    "/privacy",
    "/offer",
    "/cart",
    "/checkout",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/catalog/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/catalog/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const newsRoutes = posts.map((p) => ({
    url: `${base}/news/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...newsRoutes];
}
