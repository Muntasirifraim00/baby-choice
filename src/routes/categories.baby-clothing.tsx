import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/pages/category-page";

export const Route = createFileRoute("/categories/baby-clothing")({
  component: BabyClothing,
  head: () => ({ meta: [
    { title: "Baby Clothing — Baby Choice" },
    { name: "description", content: "Browse Baby Choice baby clothing: cotton bodysuits, party dresses, pajamas and cozy rompers." },
    { property: "og:title", content: "Baby Clothing — Baby Choice" },
    { property: "og:description", content: "Soft, stylish and comfortable clothing for every little moment." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function BabyClothing() {
  return <CategoryPage cat="baby-clothing" />;
}
