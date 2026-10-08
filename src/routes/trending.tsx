import { createFileRoute } from "@tanstack/react-router";
import { TrendingPage } from "@/components/pages/trending-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route = createFileRoute("/trending")({
  head: () => shoppingHead("Trending Products", "Most loved baby products, popular brands and today’s trending baby essentials."),
  component: () => <TrendingPage />,
});
