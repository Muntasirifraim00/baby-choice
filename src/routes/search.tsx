import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight, Grid2X2, Heart, List, RotateCcw, Search, ShoppingCart, SlidersHorizontal, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoControl, ShopBottomNav, ShopHeader } from "@/components/shop-navigation";
import { shampooProducts } from "@/lib/search-demo";
import hero from "@/assets/search-clean-hero.png.asset.json";

export const Route = createFileRoute("/search")({
  component: SearchResults,
  head: () => ({ meta: [
    { title: "Baby Shampoo Search Results — Baby Choice" },
    { name: "description", content: "Browse 128 baby shampoo results from trusted baby-care brands at Baby Choice." },
    { property: "og:title", content: "Baby Shampoo Search Results — Baby Choice" },
    { property: "og:description", content: "Compare gentle baby shampoos, sizes and prices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function Choice({ children, selected = false }: { children: React.ReactNode; selected?: boolean }) {
  return <DemoControl label={String(children)} className={`filter-choice ${selected ? "selected" : ""}`}>{children}</DemoControl>;
}

function FilterSection({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <section className="filter-section"><div className="filter-section-title"><span>{title}</span><ChevronDown className={open ? "open" : ""} /></div>{children}</section>;
}

function FilterDrawer({ close }: { close: () => void }) {
  return <div className="filter-overlay" role="dialog" aria-modal="true" aria-label="Filter and sort"><button className="filter-shade" onClick={close} aria-label="Close filters" /><aside className="filter-drawer">
    <header><h2>Filter &amp; Sort</h2><Button type="button" variant="ghost" onClick={close} aria-label="Close"><X /></Button></header>
    <div className="drawer-tabs"><DemoControl label="Filter" className="selected"><SlidersHorizontal />Filter</DemoControl><DemoControl label="Sort By"><ArrowDownUp />Sort By</DemoControl></div>
    <div className="filter-scroll">
      <FilterSection title="▦  Category" open><div className="choice-grid three"><Choice selected>All</Choice><Choice>Baby Shampoo</Choice><Choice>Baby Body Wash</Choice><Choice>Baby Lotion</Choice><Choice>Hair Care</Choice><Choice>Bath Accessories</Choice></div></FilterSection>
      <FilterSection title="◇  Brand" open><div className="brand-search">Search brands...<Search /></div><div className="choice-grid three"><Choice selected>Johnson&apos;s</Choice><Choice>Cetaphil</Choice><Choice>Himalaya</Choice><Choice>Aveeno</Choice><Choice>Sebamed</Choice><Choice>Dove</Choice></div><DemoControl label="Show More" className="show-more">Show More <ChevronDown /></DemoControl></FilterSection>
      <FilterSection title="⑧  Price Range"><div className="range-line"><i /><i /></div><div className="range-values"><span>৳ 200</span><span>৳ 2,500</span></div></FilterSection>
      <FilterSection title="♙  Age Group"><div className="choice-grid three"><Choice>0-6 Months</Choice><Choice>6-12 Months</Choice><Choice>1-2 Years</Choice><Choice>2-3 Years</Choice><Choice>3-5 Years</Choice><Choice>5+ Years</Choice></div></FilterSection>
      <FilterSection title="◇  Size / Volume"><div className="choice-grid four"><Choice>50ml</Choice><Choice>100ml</Choice><Choice selected>200ml</Choice><Choice>250ml</Choice><Choice>300ml</Choice><Choice>400ml</Choice><Choice>500ml</Choice><Choice>750ml</Choice></div></FilterSection>
      <FilterSection title="♧  Gender"><div className="choice-grid four"><Choice selected>All</Choice><Choice>Baby Boy</Choice><Choice>Baby Girl</Choice><Choice>Unisex</Choice></div></FilterSection>
      <FilterSection title="☆  Rating"><div className="choice-grid four"><Choice selected>All</Choice><Choice>4★ &amp; above</Choice><Choice>3★ &amp; above</Choice><Choice>2★ &amp; above</Choice></div></FilterSection>
      <FilterSection title="◉  Discount"><div className="choice-grid five"><Choice selected>All</Choice><Choice>10% OFF+</Choice><Choice>20% OFF+</Choice><Choice>30% OFF+</Choice><Choice>50% OFF+</Choice></div></FilterSection>
      <FilterSection title="◇  Availability"><div className="choice-grid three"><Choice selected>All</Choice><Choice>In Stock</Choice><Choice>Out of Stock</Choice></div></FilterSection>
    </div>
    <footer><DemoControl label="Clear All" className="drawer-clear"><RotateCcw />Clear All</DemoControl><Button type="button" className="drawer-apply" onClick={close}><SlidersHorizontal /><span>Apply Filters<small>128 Products Found</small></span></Button></footer>
  </aside></div>;
}

function SearchResults() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return <div className="mobile-frame"><main className="baby-screen search-screen">
    <ShopHeader />
    <div className="search-query"><Search /><strong>baby shampoo</strong><X /><span><Search /></span></div>
    <div className="search-back"><Button variant="ghost" asChild><Link to="/"><ChevronLeft />Search Results</Link></Button></div>
    <section className="search-hero"><img src={hero.url} alt="Search Results for baby shampoo. 128 Products Found." /></section>
    <div className="related-searches"><strong>Related Searches:</strong>{["baby soap", "baby body wash", "baby lotion", "baby oil", "baby skincare"].map(item => <DemoControl label={item} key={item}>{item}</DemoControl>)}<ChevronRight /></div>
    <div className="search-toolbar"><Button type="button" variant="ghost" onClick={() => setFiltersOpen(true)}><SlidersHorizontal />Filter</Button><DemoControl label="Sort By"><ArrowDownUp />Sort By</DemoControl><div className="view-toggle"><DemoControl label="Grid view" className="selected"><Grid2X2 /></DemoControl><DemoControl label="List view"><List /></DemoControl></div></div>
    <div className="active-filters"><strong>Active Filters:</strong><span>Brand: Johnson&apos;s <X /></span><span>Age: 0-2 Years <X /></span><DemoControl label="Clear All">Clear All <Trash2 /></DemoControl></div>
    <section className="search-product-grid">{shampooProducts.map(product => <article className="search-product-card" key={product.title} style={{position:"relative"}}>{product.brand==="Johnson's" && <Link to="/product/johnsons-baby-shampoo" aria-label="Johnson's Baby Shampoo details" style={{position:"absolute",inset:"0 0 25% 0",zIndex:2}} />}<div className="search-product-image"><img src={product.image.url} alt={product.title} /><span className="discount">{product.discount}% OFF</span>{product.badge && <span className="product-badge">{product.badge}</span>}<DemoControl label={`Add ${product.title} to wishlist`} className="wishlist-button"><Heart /></DemoControl></div><div className="search-product-info"><p>{product.brand}</p><h2>{product.title}</h2><div className="rating"><span className="stars">★★★★★</span><span>{product.rating}</span></div><div className="search-price"><strong>৳ {product.price}</strong><del>৳ {product.original}</del></div><div className="search-sizes">{product.sizes.map(size => <span key={size}>{size}</span>)}</div><DemoControl label={`Add ${product.title} to Cart`} className="search-add-cart"><ShoppingCart fill="currentColor" />Add to Cart</DemoControl></div></article>)}</section>
    <ShopBottomNav />{filtersOpen && <FilterDrawer close={() => setFiltersOpen(false)} />}
  </main></div>;
}