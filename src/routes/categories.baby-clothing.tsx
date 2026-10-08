import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ChevronDown, Funnel, ShoppingCart } from "lucide-react";
import { DemoControl, ShopHeader, ShopBottomNav, ShopBreadcrumb } from "@/components/shop-navigation";
import { clothingProducts, clothingTabs } from "@/lib/catalog-demo";
import { AddToCartButton, ProductLink, WishButton } from "@/components/live";
import { products as catalog } from "@/lib/products";
import hero from "@/assets/clothing-hero.png.asset.json";

export const Route = createFileRoute("/categories/baby-clothing")({
  component: BabyClothing,
  head: () => ({ meta: [
    { title: "Baby Clothing — Baby Choice" },
    { name: "description", content: "Browse Baby Choice baby clothing: cotton bodysuits, party dresses, pajamas and cozy rompers." },
    { property: "og:title", content: "Baby Clothing — Baby Choice" },
    { property: "og:description", content: "Soft, stylish and comfortable clothing for every little moment." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function BabyClothing() {
  const [tab, setTab] = useState("All"); const [sort, setSort] = useState(false);
  const slugOf = (t: string) => catalog.find(p => p.name === t)?.slug ?? "carters-girl-bodysuit-set";
  const typeOf = (t: string) => catalog.find(p => p.name === t)?.type;
  let list = clothingProducts.filter(p => tab === "All" || typeOf(p.title) === tab || (tab === "T-Shirts" && typeOf(p.title) === "Sets"));
  if (sort) list = [...list].sort((a, b) => Number(a.price.replace(",", "")) - Number(b.price.replace(",", "")));
  return <div className="mobile-frame"><main className="baby-screen catalog-screen clothing-screen">
    <ShopHeader /><ShopBreadcrumb clothing />
    <section className="catalog-banner"><img src={hero.url} alt="Baby Clothing. Soft, Stylish & Comfortable for Every Little Moment. Premium Fabric, Skin Friendly, Safe for Baby, Easy to Wash." /></section>
    <section className="clothing-tabs" aria-label="Clothing types">{clothingTabs.map(t => <Button type="button" variant="ghost" key={t.name} aria-pressed={tab === t.name} onClick={() => setTab(t.name)} className={`demo-button clothing-tab ${tab === t.name ? "selected" : ""}`}><img src={t.image.url} alt="" /><span>{t.name}</span></Button>)}</section>
    <section className="clothing-listing">
      <div className="clothing-list-heading"><div><h1>Baby Clothing</h1><p>{list.length} Products found</p></div><div className="listing-tools"><Button type="button" variant="ghost" onClick={() => setSort(v => !v)} className="demo-button sort-control"><ArrowDownUp /><span>{sort ? "Price ↑" : "Sort By"}</span><ChevronDown /></Button><Button type="button" variant="ghost" onClick={() => { setTab("All"); setSort(false); }} className="demo-button filter-control"><Funnel /><span>Reset</span></Button></div></div>
      <div className="clothing-filters">{["Age", "Size", "Brand", "Gender", "Price", "Discount"].map(label => <DemoControl key={label} label={label} className="clothing-filter">{label}<ChevronDown /></DemoControl>)}</div>
      <div className="clothing-product-grid">{list.map(product => <article className="clothing-product-card" key={product.title}>
        <div className="clothing-product-image"><ProductLink slug={slugOf(product.title)} label={product.title}><img src={product.image.url} alt={product.title} /></ProductLink><span className="discount">{product.discount}% OFF</span><WishButton slug={slugOf(product.title)} className="wishlist-button" /></div>
        <div className="clothing-product-details"><p className="clothing-brand">{product.brand}</p><h2><ProductLink slug={slugOf(product.title)}>{product.title}</ProductLink></h2><div className="rating"><span className="stars">★★★★★</span><span>{product.rating}</span></div><div className="clothing-price"><strong>৳ {product.price}</strong><del>৳ {product.original}</del></div><div className="clothing-sizes">{product.sizes.map(size => <DemoControl key={size} label={size} className="clothing-size">{size}</DemoControl>)}</div><AddToCartButton slug={slugOf(product.title)} className="clothing-add-cart"><ShoppingCart fill="currentColor" />Add to Cart</AddToCartButton></div>
      </article>)}</div>
    </section><ShopBottomNav />
  </main></div>;
}