import { useState } from "react";
import { Crown, ChevronDown, Milk, Heart, Shirt, Baby, BriefcaseBusiness, UserRound, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingShell, ViewToggle } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { shoppingImage } from "@/lib/shopping-demo";
import { products } from "@/lib/products";

const catOf: Record<string, string[]> = { Diapers: ["Diapers"], Wipes: ["Diapers"], Feeding: ["Feeding"], "Bath & Skin": ["Bath & Skin"], Health: ["Health"], Toys: ["Toys"], Clothing: ["Clothing"], "Baby Care": ["Baby Care"], Moms: ["Health", "Feeding"] };
const sorts = ["Trending", "Most Popular", "Price: Low to High", "Price: High to Low", "Top Rated"];

export function TrendingReference() {
  const cats = ["All", "Diapers", "Feeding", "Bath & Skin", "Health", "Toys", "Clothing", "Baby Care", "Moms"];
  const icons = [LayoutGrid, Baby, Milk, BriefcaseBusiness, Heart, Baby, Shirt, BriefcaseBusiness, UserRound];
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Trending");
  const [two, setTwo] = useState(false);
  let items = products.filter(p => cat === "All" || (catOf[cat] ?? []).includes(p.category) && (cat !== "Wipes" || p.name.includes("Wipes")));
  if (sort === "Most Popular") items = [...items].sort((a, b) => b.reviews - a.reviews);
  if (sort === "Price: Low to High") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "Top Rated") items = [...items].sort((a, b) => b.rating - a.rating);
  return <ShoppingShell crumb="Trending Products" className="trending-main">
    <div className="sr-trending-title"><div><h1>Trending Products</h1><p>Most loved baby products right now</p></div><aside><Crown /><span><b>Popular Today</b><small>Trending among parents</small></span></aside></div>
    <div className="sr-tabs">{cats.map((c, i) => { const Icon = icons[i] ?? Baby; return <Button type="button" variant="ghost" key={c} aria-pressed={cat === c} className={`demo-button ${cat === c ? "selected" : ""}`} onClick={() => setCat(c)}><Icon />{c}</Button>; })}</div>
    <div className="sr-toolbar"><b>Sort by</b><label className="lv-select sr-sort"><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">{sorts.map(s => <option key={s}>{s}</option>)}</select><ChevronDown /></label><ViewToggle two={two} onChange={setTwo} /></div>
    <div className="sr-banner"><img src={shoppingImage("trend-banner")} alt="Trending Now. Most popular baby products chosen by parents like you. Loved by 10K+ Parents." /></div>
    <ProductGrid items={items} two={two} />
  </ShoppingShell>;
}
