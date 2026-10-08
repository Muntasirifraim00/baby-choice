import { HomeTrendingGrid } from "@/components/home-trending";
import { HomeCategorySection } from "@/components/home-categories";
import { HomeBrands } from "@/components/home-brands";
import { getProduct } from "@/lib/products";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopBottomNav } from "@/components/shop-navigation";
import { MenuButton } from "@/components/shop-menu";
import { homeCategories } from "@/lib/home-categories";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, House, LayoutGrid, Menu, Phone, Search, ShoppingCart, UserRound, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesktopHome } from "@/components/desktop-shop";
import { CartCount } from "@/components/live";
import { HomeBanners } from "@/components/home-banners";
import { slugify } from "@/lib/live-head";
import logo from "@/assets/logo.png.asset.json";
import bath from "@/assets/bath.png.asset.json";
import feeding from "@/assets/feeding.png.asset.json";
const category1 = { url: getProduct("carters-girl-bodysuit-set")!.image };
const category2 = { url: getProduct("girl-pajama-set")!.image };
const category3 = { url: getProduct("girl-party-dress-bow")!.image };
const category4 = { url: getProduct("baby-hooded-towel")!.image };
const category5 = { url: getProduct("aptamil-advance-follow-on-milk")!.image };
const category6 = { url: getProduct("johnsons-baby-lotion")!.image };
const category7 = { url: getProduct("baby-stroller")!.image };
const category8 = { url: getProduct("baby-high-chair")!.image };
import brand1 from "@/assets/brand-1.png.asset.json";
import brand2 from "@/assets/brand-2.png.asset.json";
import brand3 from "@/assets/brand-3.png.asset.json";
import brand4 from "@/assets/brand-4.png.asset.json";
import brand5 from "@/assets/brand-5.png.asset.json";
import brand6 from "@/assets/brand-6.png.asset.json";
import brand7 from "@/assets/brand-7.png.asset.json";
import service1 from "@/assets/service-1.png.asset.json";
import service2 from "@/assets/service-2.png.asset.json";
import service3 from "@/assets/service-3.png.asset.json";
import service4 from "@/assets/service-4.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "Baby Choice — Everything for Your Little One" },
    { name: "description", content: "Shop baby clothing, feeding essentials, skin care and your favorite baby brands at Baby Choice." },
    { property: "og:title", content: "Baby Choice — Everything for Your Little One" },
    { property: "og:description", content: "Baby clothing, feeding essentials, skin care and your favorite baby brands." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const categories = [
  { image: category1, cat: "baby-clothing", tone: "pink", lines: ["Onesies &", "Bodysuits"] },
  { image: category2, cat: "panjabi-and-pajamas", tone: "lilac", lines: ["Panjabi &", "Pajamas"] },
  { image: category3, cat: "baby-clothing", tone: "rose", lines: ["Girls Party", "Dresses"] },
  { image: category4, cat: "bedding-and-blankets", tone: "peach", lines: ["Swaddle &", "Receiving"] },
  { image: category5, cat: "feeding-and-nursing", tone: "sky", lines: ["Baby Formula", "& Milk"] },
  { image: category6, cat: "skin-care", tone: "mint", lines: ["Hair, Body", "& Skin Care"] },
  { image: category7, cat: "strollers-and-prams", tone: "teal", lines: ["Strollers &", "Prams"] },
  { image: category8, cat: "high-chairs-and-boosters", tone: "lemon", lines: ["High Chairs", "& Boosters"] },
];

const brands = [ [brand1, "Aptamil"], [brand2, "Nestlé"], [brand3, "Sudocrem"], [brand4, "Pampers"], [brand5, "Carter's"], [brand6, "Johnson's"], [brand7, "Philips Avent"] ] as const;
function PlaceholderButton({ children, className = "", label }: { children?: React.ReactNode; className?: string; label: string }) {
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={label} aria-disabled="true" tabIndex={-1}>{children}</Button>;
}
function SectionHeading({ title, action }: { title: string; action: string }) {
  return <div className="section-heading"><h2>{title}</h2>{action === "View More" ? <Button variant="ghost" asChild className="demo-button section-action"><Link to="/trending">{action}<ArrowRight /></Link></Button> : action === "View All Brands" ? <Button variant="ghost" asChild className="demo-button section-action"><Link to="/brands">{action}<ArrowRight /></Link></Button> : action === "View All Categories" ? <Button variant="ghost" asChild className="demo-button section-action"><Link to="/categories">{action}<ArrowRight /></Link></Button> : <PlaceholderButton label={action} className="section-action">{action}<ArrowRight /></PlaceholderButton>}</div>;
}
function Index() {
  return (<><DesktopHome />
    <div className="mobile-frame">
      <main className="baby-screen">
        <header className="shop-header">
          <MenuButton className="demo-button menu-button" />
          <Link to="/" aria-label="Baby Choice home" className="shop-logo-link"><img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" /></Link>
          <div className="header-tools"><Button asChild variant="ghost" className="demo-button header-circle"><a href="tel:+8801712345678" aria-label="Call Baby Choice"><Phone fill="currentColor" /></a></Button><Button asChild variant="ghost" className="demo-button header-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart fill="currentColor" /><CartCount className="cart-count" /></Link></Button></div>
        </header>
        <Button variant="ghost" asChild className="search-bar search-link"><Link to="/search"><Search /><span>Search for baby products, brands, or categories...</span><span className="search-submit"><Search /></span></Link></Button>
        <HomeBanners />
        <section className="service-strip" aria-label="Shopping benefits">{[
          [service1, "Fast & Reliable", "Delivery"], [service2, "100% Original", "Products"], [service3, "Easy", "Returns"], [service4, "Dedicated", "Support"],
        ].map(([image, line1, line2], i) => <div className="service-item" key={i}><img src={typeof image === "object" ? image.url : ""} alt="" /><p>{String(line1)}<br />{String(line2)}</p></div>)}</section>
        <HomeCategorySection />
        <section className="promo-grid" aria-label="Baby essentials"><div className="promo"><img src={bath.url} alt="Bath Time Essentials. Soft towels, washcloths and more. Shop Now." /><Link to="/categories/$cat" params={{ cat: "bath-and-hygiene" }} aria-label="Shop bath time essentials" className="demo-button promo-hit" /></div><div className="promo"><img src={feeding.url} alt="Feeding Made Easy. Bottles, bibs, high chairs and more. Explore Now." /><Link to="/categories/$cat" params={{ cat: "feeding-and-nursing" }} aria-label="Explore feeding essentials" className="demo-button promo-hit" /></div></section>
        <section className="products-section"><SectionHeading title="Trending Products" action="View More" /><HomeTrendingGrid /></section>
        <HomeBrands />
        <ShopBottomNav active="Home" />
      </main>
    </div></>
  );
}
