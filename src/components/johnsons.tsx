import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownUp, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/live";
import { johnsons, type Product } from "@/lib/products";

export const jTypes = ["Shampoo", "Lotion", "Body Wash", "Powder", "Oil", "Wipes"];
const sorts = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"] as const;
export const jCounts: Record<string, number> = Object.fromEntries(["All", ...jTypes].map(t=>[t,johnsons.filter(p=>t==="All"||p.type===t).length]));

export function JohnsonsCatalog({ withCounts = false, initial = "All" }: { withCounts?: boolean; initial?: string }) {
  const [type, setType] = useState(initial);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [one, setOne] = useState(false);
  const [inStock, setInStock] = useState(false);
  let items: Product[] = johnsons.filter(p => type === "All" || p.type === type);
  if (sort === "Price: Low to High") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "Top Rated") items = [...items].sort((a, b) => b.rating - a.rating);
  return <>
    <div className="lv-chips">{["All", ...jTypes].map(t => <button type="button" key={t} className={`lv-chip ${type === t ? "on" : ""}`} onClick={() => setType(t)}>{t === "All" ? "All Products" : t}{withCounts && ` (${jCounts[t]})`}</button>)}</div>
    <div className="lv-toolbar">
      <button type="button" className={`lv-chip ${inStock ? "on" : ""}`} onClick={() => setInStock(v => !v)}><SlidersHorizontal />{inStock ? "In Stock" : "Filter"}</button>
      <label className="lv-select"><ArrowDownUp /><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value as (typeof sorts)[number])} aria-label="Sort products">{sorts.map(s => <option key={s}>{s}</option>)}</select></label>
      <div className="lv-view"><button type="button" aria-label="Grid view" className={!one ? "on" : ""} onClick={() => setOne(false)}><LayoutGrid /></button><button type="button" aria-label="List view" className={one ? "on" : ""} onClick={() => setOne(true)}><List /></button></div>
    </div>
    <p className="lv-sub">{items.length} of {jCounts[type] ?? items.length} products shown</p>
    <div className={one ? "lv-one" : ""}><ProductGrid items={items} two /></div>
  </>;
}

export function JohnsonsHeaderLinks() {
  return <div className="lv-chips"><Link to="/brands/johnsons" className="lv-chip" activeProps={{ className: "lv-chip on" }} activeOptions={{ exact: true }}>Products</Link><Link to="/brands/johnsons/story" className="lv-chip" activeProps={{ className: "lv-chip on" }}>Brand Story</Link><Link to="/brands/johnsons/products" search={{type:"All",sort:"Popular"}} className="lv-chip" activeProps={{ className: "lv-chip on" }}>All Products</Link></div>;
}
