import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoControl, ShopHeader, ShopBottomNav, ShopBreadcrumb } from "@/components/shop-navigation";
import { catalogCategories } from "@/lib/catalog-demo";
import hero from "@/assets/all-hero.png.asset.json";
import promo from "@/assets/all-promo.png.asset.json";

export const Route = createFileRoute("/categories")({
  component: AllCategories,
  head: () => ({ meta: [
    { title: "All Categories — Baby Choice" },
    { name: "description", content: "Explore everything your baby needs: clothing, feeding, toys, skin care and more at Baby Choice." },
    { property: "og:title", content: "All Categories — Baby Choice" },
    { property: "og:description", content: "Explore everything your baby needs in one place." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function AllCategories() {
  return <div className="mobile-frame"><main className="baby-screen catalog-screen all-categories-screen">
    <ShopHeader /><ShopBreadcrumb />
    <section className="catalog-banner"><img src={hero.url} alt="All Categories. Explore everything your baby needs in one place. Safe & Gentle, Premium Quality, Baby Friendly, Fast Delivery." /></section>
    <section className="all-category-grid" aria-label="All Categories">{catalogCategories.map((category, index) => {
      const contents = <><img src={category.image.url} alt={category.name} /><span className="all-category-caption"><span><strong>{category.name}</strong><small>{category.count} Items</small></span><ChevronRight /></span></>;
      return index === 0
        ? <Button key={category.name} variant="ghost" asChild className="demo-button all-category-card"><Link to="/categories/baby-clothing" aria-label="Baby Clothing">{contents}</Link></Button>
        : <DemoControl key={category.name} label={category.name} className="all-category-card">{contents}</DemoControl>;
    })}</section>
    <section className="catalog-promo"><img src={promo.url} alt="Find Everything Your Baby Needs. Top brands, best quality and great prices all in one place. Shop Now. Happy Babies Happier Tomorrows." /><Button variant="ghost" asChild className="demo-button catalog-promo-link"><Link to="/categories/baby-clothing" aria-label="Shop Now" /></Button></section>
    <ShopBottomNav />
  </main></div>;
}