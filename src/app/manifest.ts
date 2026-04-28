import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Avant Aqua Store",
    short_name: "Avant Aqua",
    description: "Оборудование для бассейнов и водоподготовки",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#023a7f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
