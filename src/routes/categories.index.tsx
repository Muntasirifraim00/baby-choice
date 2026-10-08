import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader, ShopBottomNav, ShopBreadcrumb } from "@/components/shop-navigation";
import { DesktopCategories } from "@/components/desktop-shop";
import { catalogCategories } from "@/lib/catalog-demo";
import { slugify } from "@/lib/live-head";
import hero from "@/assets/all-hero.png.asset.json";
import promo from "@/assets/all-promo.png.asset.json";

export const Route = createFileRoute("/categories/")({
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
  return <><DesktopCategories /><div className="mobile-frame"><main className="baby-screen catalog-screen all-categories-screen">
    <ShopHeader /><ShopBreadcrumb />
    <section className="catalog-banner"><img src={hero.url} alt="All Categories. Explore everything your baby needs in one place. Safe & Gentle, Premium Quality, Baby Friendly, Fast Delivery." /></section>
    <section className="all-category-grid" aria-label="All Categories">{catalogCategories.map((category, index) => {
      const tones = ["pink", "lilac", "rose", "peach", "sky", "mint", "teal", "lemon"];
      const contents = <><span className="category-art"><img src={category.image.url} alt="" /></span><span className="category-name">{category.name}</span><small className="all-category-count">{category.count} Items</small><span className="category-explore">Shop Now<ChevronRight /></span></>;
      const cls = `demo-button all-category-card category-card tone-${tones[index % tones.length]}`;
      const style = { "--d": `${index * 60}ms` } as React.CSSProperties;
      return index === 0
        ? <Button key={category.name} variant="ghost" asChild className={cls} style={style}><Link to="/categories/baby-clothing" aria-label="Baby Clothing">{contents}</Link></Button>
        : <Button key={category.name} variant="ghost" asChild className={cls} style={style}><Link to="/categories/$cat" params={{ cat: slugify(category.name) }} aria-label={category.name}>{contents}</Link></Button>;
    })}</section>
    <section className="catalog-promo"><img src={promo.url} alt="Find Everything Your Baby Needs. Top brands, best quality and great prices all in one place. Shop Now. Happy Babies Happier Tomorrows." /><Button variant="ghost" asChild className="demo-button catalog-promo-link"><Link to="/categories/baby-clothing" aria-label="Shop Now" /></Button></section>
    <ShopBottomNav />
  </main></div></>;
}