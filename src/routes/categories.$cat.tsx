import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { categoryMap, liveHead } from "@/lib/live-head";
import { catalogCategories } from "@/lib/catalog-demo";
import { slugify } from "@/lib/live-head";
import { products } from "@/lib/products";

export const Route = createFileRoute("/categories/$cat")({
  head: ({ params }) => { const c = catalogCategories.find(x => slugify(x.name) === params.cat); return liveHead(c?.name ?? "Category", `Shop ${c?.name ?? "baby products"} at Baby Choice.`); },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useParams();
  const c = catalogCategories.find(x => slugify(x.name) === cat);
  const cats = categoryMap[cat] ?? [];
  const items = products.filter(p => cats.includes(p.category));
  return <ShoppingShell crumb={`Categories › ${c?.name ?? "Category"}`} className="lv" active="Categories">
    {c && <img src={c.image.url} alt={c.name} className="lv-cat-hero" />}
    <h1 className="lv-title">{c?.name ?? "Category"}</h1><p className="lv-sub">{items.length} Products found · <Link to="/categories">All Categories</Link></p>
    <ProductGrid items={items.length ? items : products.slice(0, 6)} two />
  </ShoppingShell>;
}
