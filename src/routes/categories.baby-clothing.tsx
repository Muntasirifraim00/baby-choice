import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownUp, ChevronDown, Funnel, Heart, ShoppingCart } from "lucide-react";
import { DemoControl, ShopHeader, ShopBottomNav, ShopBreadcrumb } from "@/components/shop-navigation";
import { clothingProducts, clothingTabs } from "@/lib/catalog-demo";
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
  return <div className="mobile-frame"><main className="baby-screen catalog-screen clothing-screen">
    <ShopHeader /><ShopBreadcrumb clothing />
    <section className="catalog-banner"><img src={hero.url} alt="Baby Clothing. Soft, Stylish & Comfortable for Every Little Moment. Premium Fabric, Skin Friendly, Safe for Baby, Easy to Wash." /></section>
    <section className="clothing-tabs" aria-label="Clothing types">{clothingTabs.map((tab, index) => <DemoControl key={tab.name} label={tab.name} className={`clothing-tab ${index === 0 ? "selected" : ""}`}><img src={tab.image.url} alt="" /><span>{tab.name}</span></DemoControl>)}</section>
    <section className="clothing-listing">
      <div className="clothing-list-heading"><div><h1>Baby Clothing</h1><p>500+ Products found</p></div><div className="listing-tools"><DemoControl label="Sort By" className="sort-control"><ArrowDownUp /><span>Sort By</span><ChevronDown /></DemoControl><DemoControl label="Filter" className="filter-control"><Funnel /><span>Filter</span></DemoControl></div></div>
      <div className="clothing-filters">{["Age", "Size", "Brand", "Gender", "Price", "Discount"].map(label => <DemoControl key={label} label={label} className="clothing-filter">{label}<ChevronDown /></DemoControl>)}</div>
      <div className="clothing-product-grid">{clothingProducts.map(product => <article className="clothing-product-card" key={product.title}>
        <div className="clothing-product-image"><img src={product.image.url} alt={product.title} /><span className="discount">{product.discount}% OFF</span><DemoControl label={`Add ${product.title} to wishlist`} className="wishlist-button"><Heart /></DemoControl></div>
        <div className="clothing-product-details"><p className="clothing-brand">{product.brand}</p><h2>{product.title}</h2><div className="rating"><span className="stars">★★★★★</span><span>{product.rating}</span></div><div className="clothing-price"><strong>৳ {product.price}</strong><del>৳ {product.original}</del></div><div className="clothing-sizes">{product.sizes.map(size => <DemoControl key={size} label={size} className="clothing-size">{size}</DemoControl>)}</div><DemoControl label={`Add ${product.title} to Cart`} className="clothing-add-cart"><ShoppingCart fill="currentColor" />Add to Cart</DemoControl></div>
      </article>)}</div>
    </section><ShopBottomNav />
  </main></div>;
}