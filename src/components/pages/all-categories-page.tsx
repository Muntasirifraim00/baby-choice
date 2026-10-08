import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Minus, Phone, Plus, Search, ShoppingCart, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, MobileTabBar } from "@/components/pages/page-shell";
import { catalogCategories } from "@/lib/catalog-demo";
import { getCategoryListing } from "@/lib/home-categories";
import { slugify } from "@/lib/live-head";
import { getProduct, off, products, tk, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

const groups = [
  { id: "clothing", name: "Clothing & sleep", names: ["Baby Clothing", "Panjabi & Pajamas", "Bedding & Blankets", "Baby Accessories"] },
  { id: "care", name: "Feeding & everyday care", names: ["Feeding & Nursing", "Diapers & Wipes", "Bath & Hygiene", "Skin Care", "Health & Safety"] },
  { id: "play", name: "Play & gear", names: ["Toys & Learning", "Strollers & Prams", "High Chairs & Boosters", "Outdoor & Travel", "School & Activity"] },
  { id: "mum", name: "Mum & gifts", names: ["Mother & Maternity", "Gifts & Hampers"] },
].map(group => ({ ...group, categories: group.names.flatMap(name => {
  const category = catalogCategories.find(c => c.name === name);
  if (!category) return [];
  const slug = slugify(name);
  return [{ ...category, slug, realCount: getCategoryListing(slug).items.length }];
}) }));
const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
const heroProducts = ["pampers-new-baby-diapers", "johnsons-baby-shampoo", "baby-rattle-set"].flatMap(slug => {
  const product = getProduct(slug);
  return product ? [product] : [];
});
const countText = (n: number) => n === 0 ? "Coming soon" : `${n} ${n === 1 ? "product" : "products"}`;

function CategorySearch({ query, onChange, id }: { query: string; onChange: (value: string) => void; id: string }) {
  return <div className="alc-searchbox">
    <label htmlFor={id}>Find a category</label>
    <div className="alc-searchfield"><Search aria-hidden="true" /><input id={id} type="search" placeholder="Try clothing, feeding or toys…" value={query} onChange={e => onChange(e.target.value)} autoComplete="off" />
      {query && <Button type="button" variant="ghost" className="alc-clear" aria-label="Clear category search" onClick={() => onChange("")}><X /></Button>}
    </div>
  </div>;
}

function TrendingCard({ product, index }: { product: Product; index: number }) {
  const { lines, wish, add, setQty, toggleWish } = useCart();
  const line = lines.find(l => l.slug === product.slug);
  const qty = line?.qty ?? 0;
  const wished = wish.includes(product.slug);
  return <article className={`alc-product alc-product-tone-${index % 4}`}>
    <div className="alc-product-art">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="alc-product-photo" tabIndex={-1} aria-hidden="true"><img src={product.image} alt="" loading="lazy" /></Link>
      {off(product) > 0 && <span className="alc-discount">-{off(product)}%</span>}
      <Button type="button" variant="ghost" className="alc-wish" aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${wished ? "from" : "to"} wishlist`} aria-pressed={wished} onClick={() => toggleWish(product.slug)}><Heart className={wished ? "alc-heart-on" : "alc-heart"} /></Button>
    </div>
    <div className="alc-product-info"><span className="alc-brand">{product.brand}</span><h3><Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link></h3>
      <div className="alc-product-meta"><span className="alc-size">{product.sizes.join(" · ")}</span><span className="alc-rating" aria-label={`${product.rating} stars from ${product.reviews} reviews`}><Star aria-hidden="true" />{product.rating.toFixed(1)} <span>({product.reviews})</span></span></div>
      <div className="alc-product-foot"><div className="alc-price"><strong>৳ {tk(product.price)}</strong>{product.old > product.price && <s>৳ {tk(product.old)}</s>}</div>
        {qty > 0 ? <div className="alc-stepper"><Button type="button" variant="ghost" aria-label={`Remove one ${product.name}`} onClick={() => { if (line) setQty(line.slug, line.size, qty - 1); }}><Minus /></Button><span aria-live="polite" aria-label={`${qty} in cart`}>{qty}</span><Button type="button" variant="ghost" aria-label={`Add one more ${product.name}`} onClick={e => add(product, line?.size, 1, e.currentTarget)}><Plus /></Button></div>
          : <Button type="button" variant="ghost" className="alc-add" aria-label={`Add ${product.name} to cart`} onClick={e => add(product, undefined, 1, e.currentTarget)}><Plus /></Button>}
      </div>
    </div>
  </article>;
}

export function AllCategoriesPage() {
  const navigate = useNavigate();
  const { lines } = useCart();
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("clothing");
  const itemCount = lines.reduce((n, line) => n + line.qty, 0);
  const filteredGroups = useMemo(() => groups.map(group => ({ ...group, categories: group.categories.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase())) })).filter(group => group.categories.length > 0), [query]);
  useEffect(() => {
    if (!filteredGroups.length) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const first = visible[0];
      if (first) setActiveGroup(first.target.id.replace("alc-group-", ""));
    }, { rootMargin: "-140px 0px -45% 0px", threshold: 0 });
    filteredGroups.forEach(group => { const element = document.getElementById(`alc-group-${group.id}`); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [filteredGroups]);
  const back = () => {
    if (window.history.length > 1) window.history.back();
    else void navigate({ to: "/" });
  };
  const summary = `${catalogCategories.length} categories · ${products.length} products`;
  return <PageShell className="alc-page">
    <header className="alc-topbar"><Button type="button" variant="ghost" className="alc-icon" aria-label="Go back" onClick={back}><ArrowLeft /></Button><div className="alc-top-title"><h1>All categories</h1><p>{summary}</p></div><Button variant="ghost" asChild className="alc-icon"><Link to="/search" aria-label="Search products"><Search /></Link></Button><Button variant="ghost" asChild className="alc-icon alc-cart"><Link to="/cart" aria-label={`Cart, ${itemCount} items`}><ShoppingCart /><span className="alc-cart-count" aria-live="polite">{itemCount}</span></Link></Button></header>
    <div className="alc-wrap">
      <div className="alc-desktop-title"><nav className="alc-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Categories</span></nav><div className="alc-titleline"><h1>All categories</h1><p>{summary}</p></div></div>
      <div className="alc-phone-search"><CategorySearch id="alc-phone-search" query={query} onChange={setQuery} /></div>
      <nav className="alc-jumps" aria-label="Category groups">{filteredGroups.map(group => <a key={group.id} href={`#alc-group-${group.id}`} className={`alc-chip alc-tone-${group.id}`} onClick={() => setActiveGroup(group.id)}>{group.name}</a>)}</nav>
      <section className="alc-hero" aria-label="Everything for your little one"><div className="alc-hero-copy"><span className="alc-hero-eyebrow">EVERYTHING FOR YOUR LITTLE ONE</span><h2>16 categories,<br />one happy basket</h2><p>Original brands · Cash on delivery all over Bangladesh</p><div className="alc-desktop-search"><CategorySearch id="alc-desktop-search" query={query} onChange={setQuery} /></div></div><div className="alc-hero-art" aria-hidden="true">{heroProducts.map((product, index) => <div key={product.slug} className={`alc-photo alc-photo-${index}`}><img src={product.image} alt="" /></div>)}</div></section>
      <div className="alc-body"><aside className="alc-sidebar"><h2>Jump to</h2><nav aria-label="Jump to category group">{filteredGroups.map(group => <a href={`#alc-group-${group.id}`} key={group.id} className={`alc-side-link alc-tone-${group.id} ${activeGroup === group.id ? "alc-current" : ""}`} aria-current={activeGroup === group.id ? "location" : undefined} onClick={() => setActiveGroup(group.id)}><span className="alc-dot" /><span>{group.name}</span><small>{group.categories.length}</small></a>)}</nav><div className="alc-side-help"><Phone aria-hidden="true" /><a href="tel:+8801712345678">Call +880 1712 345678</a><Link to="/support">Visit our help centre <ArrowRight /></Link></div></aside>
        <div className="alc-groups" aria-live="polite">{filteredGroups.length === 0 ? <section className="alc-empty"><Search aria-hidden="true" /><h2>No categories found</h2><p>Try another name, or look for “{query}” in all products.</p><Button variant="ghost" asChild className="alc-empty-link"><Link to="/search" search={{ q: query }}>Search all products <ArrowRight /></Link></Button></section> : filteredGroups.map(group => <section id={`alc-group-${group.id}`} key={group.id} className={`alc-group alc-tone-${group.id}`}><div className="alc-group-head"><div><span className="alc-eyebrow">{group.name.toUpperCase()}</span><h2>{group.name}</h2></div><span className="alc-group-count">{group.categories.length} {group.categories.length === 1 ? "category" : "categories"}</span></div><div className="alc-tile-grid">{group.categories.map(category => {
          const content = <><span className="alc-tile-art"><img src={category.image.url} alt="" loading="lazy" /></span><span className="alc-tile-info"><strong>{category.name}</strong><small>{countText(category.realCount)}</small><span className="alc-shop"><span className="alc-phone-label">Shop</span><span className="alc-desktop-label">Shop now</span><ArrowRight aria-hidden="true" /></span></span></>;
          return category.name === "Baby Clothing" ? <Link className="alc-tile" to="/categories/baby-clothing" key={category.slug}>{content}</Link> : <Link className="alc-tile" to="/categories/$cat" params={{ cat: category.slug }} key={category.slug}>{content}</Link>;
        })}</div></section>)}</div>
      </div>
      <section className="alc-trending"><div className="alc-section-head"><div><span className="alc-eyebrow">LITTLE FAVOURITES</span><h2>Trending right now</h2></div><Sparkles aria-hidden="true" /></div><div className="alc-trending-grid">{trending.map((product, index) => <TrendingCard key={product.slug} product={product} index={index} />)}</div></section>
      <section className="alc-help"><span className="alc-eyebrow">CAN'T FIND IT?</span><h2>Ask a real person</h2><div className="alc-help-actions"><Button variant="ghost" asChild className="alc-call"><a href="tel:+8801712345678"><Phone />Call us</a></Button><Button variant="ghost" asChild className="alc-support"><Link to="/support">Help centre <ArrowRight /></Link></Button></div></section>
    </div>
    <MobileTabBar active="categories" />
  </PageShell>;
}
