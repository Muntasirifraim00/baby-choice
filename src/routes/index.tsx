import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, House, LayoutGrid, Menu, Phone, Search, ShoppingCart, UserRound, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import hero from "@/assets/hero.png.asset.json";
import bath from "@/assets/bath.png.asset.json";
import feeding from "@/assets/feeding.png.asset.json";
import category1 from "@/assets/category-1.png.asset.json";
import category2 from "@/assets/category-2.png.asset.json";
import category3 from "@/assets/category-3.png.asset.json";
import category4 from "@/assets/category-4.png.asset.json";
import category5 from "@/assets/category-5.png.asset.json";
import category6 from "@/assets/category-6.png.asset.json";
import category7 from "@/assets/category-7.png.asset.json";
import category8 from "@/assets/category-8.png.asset.json";
import product1 from "@/assets/product-1.png.asset.json";
import product2 from "@/assets/product-2.png.asset.json";
import product3 from "@/assets/product-3.png.asset.json";
import product4 from "@/assets/product-4.png.asset.json";
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
  { image: category1, lines: ["Onesies &", "Bodysuits"] },
  { image: category2, lines: ["Panjabi &", "Pajamas"] },
  { image: category3, lines: ["Girls Party", "Dresses"] },
  { image: category4, lines: ["Swaddle &", "Receiving"] },
  { image: category5, lines: ["Baby Formula", "& Milk"] },
  { image: category6, lines: ["Hair, Body", "& Skin Care"] },
  { image: category7, lines: ["Strollers &", "Prams"] },
  { image: category8, lines: ["High Chairs", "& Boosters"] },
];
const products = [
  { image: product1, title: "Sudocrem – Antiseptic Healing Nappy Rash Cream", discount: 12, rating: "4.8 (320)", code: "14004BG", price: "890" },
  { image: product2, title: "Carter's Honey Cotton Baby Wash Cloth Towel -...", discount: 20, rating: "4.7 (210)", code: "11882", price: "650" },
  { image: product3, title: "Aptamil Advance Follow On Milk Powder...", discount: 15, rating: "4.9 (425)", code: "10120", price: "2,450" },
  { image: product4, title: "Baby Hooded Towel for Newborns (Soft...", discount: 10, rating: "4.8 (198)", code: "11876", price: "790" },
];
const brands = [ [brand1, "Aptamil"], [brand2, "Nestlé"], [brand3, "Sudocrem"], [brand4, "Pampers"], [brand5, "Carter's"], [brand6, "Johnson's"], [brand7, "Philips Avent"] ] as const;
function PlaceholderButton({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={label} aria-disabled="true" tabIndex={-1}>{children}</Button>;
}
function SectionHeading({ title, action }: { title: string; action: string }) {
  return <div className="section-heading"><h2>{title}</h2><PlaceholderButton label={action} className="section-action">{action}<ArrowRight /></PlaceholderButton></div>;
}
function Index() {
  return (
    <div className="mobile-frame">
      <main className="baby-screen">
        <header className="shop-header">
          <PlaceholderButton label="Menu" className="menu-button"><Menu /></PlaceholderButton>
          <img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" />
          <div className="header-tools"><PlaceholderButton label="Call Baby Choice" className="header-circle"><Phone fill="currentColor" /></PlaceholderButton><PlaceholderButton label="Cart, 3 items" className="header-circle"><ShoppingCart fill="currentColor" /><span className="cart-count">3</span></PlaceholderButton></div>
        </header>
        <div className="search-bar"><Search /><span>Search for baby products, brands, or categories...</span><PlaceholderButton label="Search" className="search-submit"><Search /></PlaceholderButton></div>
        <section className="hero-banner" aria-label="Baby Choice — Happy Babies Happier Tomorrows"><img src={hero.url} alt="Baby Choice. Everything for Your Little One. Safe & Gentle, Premium Quality, Baby Friendly, Fast Delivery. Shop Now. Happy Babies Happier Tomorrows." /><PlaceholderButton label="Shop Now" className="hero-shop-hit" /></section>
        <section className="service-strip" aria-label="Shopping benefits">{[
          [service1, "Fast & Reliable", "Delivery"], [service2, "100% Original", "Products"], [service3, "Easy", "Returns"], [service4, "Dedicated", "Support"],
        ].map(([image, line1, line2], i) => <div className="service-item" key={i}><img src={typeof image === "object" ? image.url : ""} alt="" /><p>{String(line1)}<br />{String(line2)}</p></div>)}</section>
        <section className="categories-section"><SectionHeading title="Shop By Category" action="View All Categories" /><div className="category-grid">{categories.map(({ image, lines }) => <PlaceholderButton key={lines[0]} label={lines.join(" ")} className="category-card"><img src={image.url} alt={lines.join(" ")} /><span className="category-caption"><span>{lines[0]}<br />{lines[1]}</span><ChevronRight /></span></PlaceholderButton>)}</div></section>
        <section className="promo-grid" aria-label="Baby essentials"><div className="promo"><img src={bath.url} alt="Bath Time Essentials. Soft towels, washcloths and more. Shop Now." /><PlaceholderButton label="Shop bath time essentials" className="promo-hit" /></div><div className="promo"><img src={feeding.url} alt="Feeding Made Easy. Bottles, bibs, high chairs and more. Explore Now." /><PlaceholderButton label="Explore feeding essentials" className="promo-hit" /></div></section>
        <section className="products-section"><SectionHeading title="Trending Products" action="View More" /><div className="product-grid">{products.map(product => <article className="product-card" key={product.code}><div className="product-image"><img src={product.image.url} alt={product.title} /><span className="discount">{product.discount}% OFF</span><PlaceholderButton label={`Add ${product.title} to wishlist`} className="wishlist-button"><Heart /></PlaceholderButton></div><div className="product-details"><h3>{product.title}</h3><div className="rating"><span className="stars">★★★★★</span><span>{product.rating}</span></div><p className="product-code">{product.code}</p><div className="price-row"><strong>৳ {product.price}</strong><PlaceholderButton label={`Add ${product.title} to cart`} className="add-cart"><ShoppingCart /></PlaceholderButton></div></div></article>)}</div></section>
        <section className="brands-section"><SectionHeading title="Top Brands" action="View All Brands" /><div className="brand-row"><PlaceholderButton label="Previous brands" className="brand-prev"><ChevronLeft /></PlaceholderButton>{brands.map(([image, name]) => <PlaceholderButton key={name} label={name} className="brand-tile"><img src={image.url} alt={name} /></PlaceholderButton>)}<PlaceholderButton label="Next brands" className="brand-next"><ChevronRight /></PlaceholderButton></div></section>
        <nav className="bottom-nav" aria-label="Main navigation">{[ [House, "Home"], [LayoutGrid, "Categories"], [BadgePercent, "Offers"], [Heart, "Wishlist"], [UserRound, "Account"] ].map(([Icon, label], i) => { const NavIcon = Icon as typeof House; return <PlaceholderButton key={String(label)} label={String(label)} className={i === 0 ? "nav-item active" : "nav-item"}><NavIcon fill={i === 0 ? "currentColor" : "none"} /><span>{String(label)}</span></PlaceholderButton>; })}</nav>
      </main>
    </div>
  );
}
