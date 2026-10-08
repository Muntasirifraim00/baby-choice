import { createFileRoute } from "@tanstack/react-router";
import { HomeDesign } from "@/components/home-design/home-design";

export const Route = createFileRoute("/")({
  component: HomeDesign,
  head: () => ({
    meta: [
      { title: "Baby Choice — Everything for Your Little One" },
      {
        name: "description",
        content:
          "Shop baby clothing, feeding essentials, diapers, bath care, toys and gear from trusted brands at Baby Choice.",
      },
      { property: "og:title", content: "Baby Choice — Everything for Your Little One" },
      {
        property: "og:description",
        content:
          "Baby clothing, feeding essentials, diapers, bath care, toys and your favourite baby brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800;900&display=swap",
      },
    ],
  }),
});
