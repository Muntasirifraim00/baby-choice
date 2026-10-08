import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { categoryMap, liveHead } from "@/lib/live-head";
import { catalogCategories } from "@/lib/catalog-demo";
import { slugify } from "@/lib/live-head";
import { products } from "@/lib/products";
import { getCategoryListing } from "@/lib/home-categories";

export const Route = createFileRoute("/categories/$cat")({
  head: ({ params }) => { const c = getCategoryListing(params.cat); return liveHead(c.name, `Shop ${c.name} at Baby Choice.`); },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useParams();
  const c = getCategoryListing(cat);
  return <ShoppingShell crumb={`Categories › ${c.name}`} className="lv" active="Categories">
    {c.image && <img src={c.image} alt={c.name} className="lv-cat-hero" />}
    <h1 className="lv-title">{c.name}</h1><p className="lv-sub">{c.items.length} Products found · <Link to="/categories">All Categories</Link></p>
    <ProductGrid items={c.items} two />
  </ShoppingShell>;
}
