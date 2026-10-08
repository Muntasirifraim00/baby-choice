import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { LvBanner, LvHead } from "@/components/live-ui";
import { liveHead, slugify } from "@/lib/live-head";
import { products } from "@/lib/products";

export const Route = createFileRoute("/brands/$brand")({
  head: ({ params }) => { const n = params.brand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); return liveHead(`${n} Products`, `Shop ${n} baby products at Baby Choice.`); },
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useParams();
  const items = products.filter(p => slugify(p.brand) === brand || slugify(p.brand).startsWith(brand.split("-")[0] ?? brand));
  const name = items[0]?.brand ?? brand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return <ShoppingShell crumb={`Brands › ${name}`} className="lv">
    <h1 className="lv-title">{name}</h1><p className="lv-sub">{items.length} Products Found · <Link to="/brands">All Brands</Link></p>
    <LvBanner title={name} text={`Trusted ${name} care for your little one.`} image={items[0]?.image ?? products[1]?.image} />
    {items.length ? <ProductGrid items={items} two /> : <><p className="lv-empty">New {name} products are arriving soon.</p><LvHead title="Popular Right Now" to="/trending" /><ProductGrid items={products.slice(0, 4)} two /></>}
  </ShoppingShell>;
}
