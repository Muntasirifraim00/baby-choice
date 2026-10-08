import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight, Grid2X2, List, RotateCcw, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopBottomNav, ShopHeader } from "@/components/shop-navigation";
import { AddToCartButton, ProductLink, WishButton } from "@/components/live";
import { off, products, tk, type Product } from "@/lib/products";

export const Route = createFileRoute("/search")({
  component: SearchResults,
  head: () => ({ meta: [
    { title: "Search Baby Products — Baby Choice" },
    { name: "description", content: "Search baby shampoo, diapers, feeding and clothing from trusted baby-care brands at Baby Choice." },
    { property: "og:title", content: "Search Baby Products — Baby Choice" },
    { property: "og:description", content: "Compare gentle baby products, sizes and prices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

type Filters = { brands: string[]; minRating: number; minOff: number; category: string };
const empty: Filters = { brands: [], minRating: 0, minOff: 0, category: "All" };
const sorts = ["Relevance", "Price: Low to High", "Price: High to Low", "Top Rated", "Biggest Discount"] as const;
const brandList = Array.from(new Set(products.map(p => p.brand)));
const catList = ["All", ...Array.from(new Set(products.map(p => p.category)))];

function Choice({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return <Button type="button" variant="ghost" className={`demo-button filter-choice ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={onClick}>{children}</Button>;
}
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="filter-section"><div className="filter-section-title"><span>{title}</span><ChevronDown className="open" /></div>{children}</section>;
}

function FilterDrawer({ initial, apply, close, sort, setSort, count }: { initial: Filters; apply: (f: Filters) => void; close: () => void; sort: string; setSort: (s: (typeof sorts)[number]) => void; count: (f: Filters) => number }) {
  const [f, setF] = useState(initial);
  const [tab, setTab] = useState<"filter" | "sort">("filter");
  const [brandQ, setBrandQ] = useState("");
  const [more, setMore] = useState(false);
  const brands = brandList.filter(b => b.toLowerCase().includes(brandQ.toLowerCase()));
  return <div className="filter-overlay" role="dialog" aria-modal="true" aria-label="Filter and sort"><button className="filter-shade" onClick={close} aria-label="Close filters" /><aside className="filter-drawer">
    <header><h2>Filter &amp; Sort</h2><Button type="button" variant="ghost" onClick={close} aria-label="Close"><X /></Button></header>
    <div className="drawer-tabs"><Choice selected={tab === "filter"} onClick={() => setTab("filter")}><SlidersHorizontal />Filter</Choice><Choice selected={tab === "sort"} onClick={() => setTab("sort")}><ArrowDownUp />Sort By</Choice></div>
    <div className="filter-scroll">
      {tab === "sort" ? <FilterSection title="Sort By"><div className="choice-grid three">{sorts.map(s => <Choice key={s} selected={sort === s} onClick={() => setSort(s)}>{s}</Choice>)}</div></FilterSection> : <>
        <FilterSection title="▦  Category"><div className="choice-grid three">{catList.map(c => <Choice key={c} selected={f.category === c} onClick={() => setF({ ...f, category: c })}>{c}</Choice>)}</div></FilterSection>
        <FilterSection title="◇  Brand"><label className="brand-search"><input value={brandQ} onChange={e => setBrandQ(e.target.value)} placeholder="Search brands..." aria-label="Search brands" /><Search /></label><div className="choice-grid three">{(more ? brands : brands.slice(0, 6)).map(b => <Choice key={b} selected={f.brands.includes(b)} onClick={() => setF({ ...f, brands: f.brands.includes(b) ? f.brands.filter(x => x !== b) : [...f.brands, b] })}>{b}</Choice>)}</div><Button type="button" variant="ghost" className="demo-button show-more" onClick={() => setMore(m => !m)}>{more ? "Show Less" : "Show More"} <ChevronDown /></Button></FilterSection>
        <FilterSection title="☆  Rating"><div className="choice-grid four">{[0, 4.8, 4.7, 4.5].map(r => <Choice key={r} selected={f.minRating === r} onClick={() => setF({ ...f, minRating: r })}>{r === 0 ? "All" : `${r}★ & above`}</Choice>)}</div></FilterSection>
        <FilterSection title="◉  Discount"><div className="choice-grid five">{[0, 10, 20, 30].map(d => <Choice key={d} selected={f.minOff === d} onClick={() => setF({ ...f, minOff: d })}>{d === 0 ? "All" : `${d}% OFF+`}</Choice>)}</div></FilterSection>
      </>}
    </div>
    <footer><Button type="button" variant="ghost" className="demo-button drawer-clear" onClick={() => setF(empty)}><RotateCcw />Clear All</Button><Button type="button" className="drawer-apply" onClick={() => { apply(f); close(); }}><SlidersHorizontal /><span>Apply Filters<small>{count(f)} Products Found</small></span></Button></footer>
  </aside></div>;
}

function matches(p: Product, q: string) {
  const words = q.toLowerCase().replace(/baby/g, "").split(/\s+/).filter(Boolean);
  const hay = `${p.name} ${p.brand} ${p.category} ${p.sub} ${p.type ?? ""}`.toLowerCase();
  return words.every(w => hay.includes(w.replace(/s$/, "")));
}

function SearchResults() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>(empty);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Relevance");
  const [list, setList] = useState(false);
  const filterFn = (f: Filters) => (p: Product) => matches(p, q) && (f.category === "All" || p.category === f.category) && (!f.brands.length || f.brands.includes(p.brand)) && p.rating >= f.minRating && off(p) >= f.minOff;
  const results = useMemo(() => {
    const r = products.filter(filterFn(filters));
    if (sort === "Price: Low to High") r.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") r.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") r.sort((a, b) => b.rating - a.rating);
    if (sort === "Biggest Discount") r.sort((a, b) => off(b) - off(a));
    return r;
  }, [q, filters, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const run = (v: string) => { setInput(v); setQ(v); };
  const typing = input !== q;
  const suggestions = useMemo(() => {
    const v = input.trim();
    if (v.length < 2) return [];
    return products.filter(p => matches(p, v)).slice(0, 8);
  }, [input]);
  const popular = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), []);
  const chips = [...filters.brands.map(b => ({ label: `Brand: ${b}`, clear: () => setFilters({ ...filters, brands: filters.brands.filter(x => x !== b) }) })),
    ...(filters.category !== "All" ? [{ label: `Category: ${filters.category}`, clear: () => setFilters({ ...filters, category: "All" }) }] : []),
    ...(filters.minRating ? [{ label: `Rating: ${filters.minRating}★+`, clear: () => setFilters({ ...filters, minRating: 0 }) }] : []),
    ...(filters.minOff ? [{ label: `Discount: ${filters.minOff}%+`, clear: () => setFilters({ ...filters, minOff: 0 }) }] : [])];
  return <div className="mobile-frame"><main className="baby-screen search-screen">
    <ShopHeader />
    <form className="search-query" onSubmit={e => { e.preventDefault(); setQ(input); }}><Search /><input className="lv-search-input" value={input} onChange={e => setInput(e.target.value)} aria-label="Search products" placeholder="Search for baby products..." autoFocus /><button type="button" aria-label="Clear search" className="lv-plain" onClick={() => run("")}><X /></button><button type="submit" aria-label="Search" className="lv-plain"><span><Search /></span></button></form>
    <div className="search-back"><Button variant="ghost" asChild><Link to="/"><ChevronLeft />Search</Link></Button></div>
    {typing ? <section className="search-suggestions" aria-label="Product suggestions">
      {input.trim().length < 2 ? <p className="lv-empty">Type at least 2 letters to see matching products.</p>
        : suggestions.length === 0 ? <p className="lv-empty">No products match “{input}”.</p>
        : <ul>{suggestions.map(p => <li key={p.slug}><button type="button" className="suggestion-row" onClick={() => run(p.name)}><img src={p.image} alt="" /><span className="suggestion-text"><strong>{p.name}</strong><small>{p.brand} · {p.category}</small></span><span className="suggestion-price">৳ {tk(p.price)}</span></button></li>)}</ul>}
    </section> : q === "" ? <section className="search-suggestions" aria-label="Popular products">
      <h2 className="suggestion-title">Popular Products</h2>
      <ul>{popular.map(p => <li key={p.slug}><button type="button" className="suggestion-row" onClick={() => run(p.name)}><img src={p.image} alt="" /><span className="suggestion-text"><strong>{p.name}</strong><small>{p.brand} · {p.category}</small></span><span className="suggestion-price">৳ {tk(p.price)}</span></button></li>)}</ul>
    </section> : <>
    <section className="search-hero lv-search-hero"><div><p>Search Results for</p><h1>“{q}”</h1><b>{results.length} Products Found</b></div></section>
    <div className="related-searches"><strong>Related Searches:</strong>{["baby soap", "body wash", "lotion", "oil", "diapers", "feeding"].map(item => <Button type="button" variant="ghost" className="demo-button" key={item} onClick={() => run(item)}>{item}</Button>)}<ChevronRight /></div>
    <div className="search-toolbar"><Button type="button" variant="ghost" onClick={() => setFiltersOpen(true)}><SlidersHorizontal />Filter</Button><Button type="button" variant="ghost" className="demo-button" onClick={() => setSort(sorts[(sorts.indexOf(sort) + 1) % sorts.length] ?? "Relevance")}><ArrowDownUp />{sort === "Relevance" ? "Sort By" : sort}</Button><div className="view-toggle"><Button type="button" variant="ghost" aria-label="Grid view" className={`demo-button ${!list ? "selected" : ""}`} onClick={() => setList(false)}><Grid2X2 /></Button><Button type="button" variant="ghost" aria-label="List view" className={`demo-button ${list ? "selected" : ""}`} onClick={() => setList(true)}><List /></Button></div></div>
    {chips.length > 0 && <div className="active-filters"><strong>Active Filters:</strong>{chips.map(c => <button type="button" className="lv-chipx" key={c.label} onClick={c.clear}>{c.label} <X /></button>)}<Button type="button" variant="ghost" className="demo-button" onClick={() => setFilters(empty)}>Clear All <Trash2 /></Button></div>}
    {results.length === 0 && <p className="lv-empty">No products found for “{q}”. Try another search.</p>}
    <section className={`search-product-grid ${list ? "lv-list-view" : ""}`}>{results.map(p => <article className="search-product-card lv-search-card" key={p.slug}><div className="search-product-image"><ProductLink slug={p.slug} label={p.name}><img src={p.image} alt={p.name} /></ProductLink><span className="discount">{off(p)}% OFF</span>{p.badge && <span className="product-badge">{p.badge}</span>}<WishButton slug={p.slug} className="wishlist-button" /></div><div className="search-product-info"><p>{p.brand}</p><h2><ProductLink slug={p.slug}>{p.name}</ProductLink></h2><div className="rating"><span className="stars">★★★★★</span><span>{p.rating} ({p.reviews})</span></div><div className="search-price"><strong>৳ {tk(p.price)}</strong><del>৳ {tk(p.old)}</del></div><div className="search-sizes">{p.sizes.map(size => <span key={size}>{size}</span>)}</div><AddToCartButton product={p} className="search-add-cart" /></div></article>)}</section>
    </>}
    <ShopBottomNav />{filtersOpen && <FilterDrawer initial={filters} apply={setFilters} close={() => setFiltersOpen(false)} sort={sort} setSort={setSort} count={f => products.filter(filterFn(f)).length} />}
  </main></div>;
}
