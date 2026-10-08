import { createFileRoute } from "@tanstack/react-router";
import { AllCategoriesPage } from "@/components/pages/all-categories-page";

export const Route = createFileRoute("/categories/")({
  component: AllCategoriesPage,
  head: () => ({ meta: [
    { title: "All Categories — Baby Choice" },
    { name: "description", content: "Explore everything your baby needs: clothing, feeding, toys, skin care and more at Baby Choice." },
    { property: "og:title", content: "All Categories — Baby Choice" },
    { property: "og:description", content: "Explore everything your baby needs in one place." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
