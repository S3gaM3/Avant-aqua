import type { NextConfig } from "next";

function wordpressImageHosts(): {
  protocol: "http" | "https";
  hostname: string;
}[] {
  const raw = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!raw) return [];
  try {
    const u = new URL(raw);
    const protocol = u.protocol === "http:" ? "http" : "https";
    return [{ protocol, hostname: u.hostname }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.118"],
  images: {
    // Для локальной связки Next.js (localhost:3000) + WordPress (localhost)
    // разрешаем загрузку изображений с private IP в dev-среде.
    dangerouslyAllowLocalIP: true,
    remotePatterns: wordpressImageHosts().map((h) => ({
      protocol: h.protocol,
      hostname: h.hostname,
      pathname: "/**",
    })),
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
