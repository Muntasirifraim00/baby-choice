import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/pages/category-page";
import { liveHead } from "@/lib/live-head";
import { getCategoryListing } from "@/lib/home-categories";

export const Route = createFileRoute("/categories/$cat")({
  head: ({ params }) => { const c = getCategoryListing(params.cat); return liveHead(c.name, `Shop ${c.name} at Baby Choice.`); },
  component: CategoryRoute,
});

function CategoryRoute() {
  const { cat } = Route.useParams();
  return <CategoryPage key={cat} cat={cat} />;
}
