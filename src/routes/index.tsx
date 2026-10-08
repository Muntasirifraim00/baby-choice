import { getProduct } from "@/lib/products";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopBottomNav } from "@/components/shop-navigation";
import { MenuButton } from "@/components/shop-menu";
import { homeCategories } from "@/lib/home-categories";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, House, LayoutGrid, Menu, Phone, Search, ShoppingCart, UserRound, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesktopHome } from "@/components/desktop-shop";
import { AddToCartButton, CartCount, ProductLink, WishButton } from "@/components/live";
import { slugify } from "@/lib/live-head";
import logo from "@/assets/logo.png.asset.json";
import hero from "@/assets/hero.png.asset.json";
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
const product1 = { url: getProduct("sudocrem-nappy-rash-cream")!.image };
const product2 = { url: getProduct("carters-honey-cotton-wash-cloth")!.image };
const product3 = { url: getProduct("aptamil-advance-follow-on-milk")!.image };
const product4 = { url: getProduct("baby-hooded-towel")!.image };
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
  { image: category1, cat: "baby-clothing", lines: ["Onesies &", "Bodysuits"] },
  { image: category2, cat: "panjabi-and-pajamas", lines: ["Panjabi &", "Pajamas"] },
  { image: category3, cat: "baby-clothing", lines: ["Girls Party", "Dresses"] },
  { image: category4, cat: "bedding-and-blankets", lines: ["Swaddle &", "Receiving"] },
  { image: category5, cat: "feeding-and-nursing", lines: ["Baby Formula", "& Milk"] },
  { image: category6, cat: "skin-care", lines: ["Hair, Body", "& Skin Care"] },
  { image: category7, cat: "strollers-and-prams", lines: ["Strollers &", "Prams"] },
  { image: category8, cat: "high-chairs-and-boosters", lines: ["High Chairs", "& Boosters"] },
];
const products = [
  { slug: "sudocrem-nappy-rash-cream", image: product1, title: "Sudocrem – Antiseptic Healing Nappy Rash Cream", discount: 12, rating: "4.8 (320)", code: "14004BG", price: "890" },
  { slug: "carters-honey-cotton-wash-cloth", image: product2, title: "Carter's Honey Cotton Baby Wash Cloth Towel -...", discount: 20, rating: "4.7 (210)", code: "11882", price: "650" },
  { slug: "aptamil-advance-follow-on-milk", image: product3, title: "Aptamil Advance Follow On Milk Powder...", discount: 15, rating: "4.9 (425)", code: "10120", price: "2,450" },
  { slug: "baby-hooded-towel", image: product4, title: "Baby Hooded Towel for Newborns (Soft...", discount: 10, rating: "4.8 (198)", code: "11876", price: "790" },
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
          <img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" />
          <div className="header-tools"><Button asChild variant="ghost" className="demo-button header-circle"><a href="tel:+8801712345678" aria-label="Call Baby Choice"><Phone fill="currentColor" /></a></Button><Button asChild variant="ghost" className="demo-button header-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart fill="currentColor" /><CartCount className="cart-count" /></Link></Button></div>
        </header>
        <Button variant="ghost" asChild className="search-bar search-link"><Link to="/search"><Search /><span>Search for baby products, brands, or categories...</span><span className="search-submit"><Search /></span></Link></Button>
        <section className="hero-banner" aria-label="Baby Choice — Happy Babies Happier Tomorrows"><img src={hero.url} alt="Baby Choice. Everything for Your Little One. Safe & Gentle, Premium Quality, Baby Friendly, Fast Delivery. Shop Now. Happy Babies Happier Tomorrows." /><Link to="/trending" aria-label="Shop Now" className="demo-button hero-shop-hit" /></section>
        <section className="service-strip" aria-label="Shopping benefits">{[
          [service1, "Fast & Reliable", "Delivery"], [service2, "100% Original", "Products"], [service3, "Easy", "Returns"], [service4, "Dedicated", "Support"],
        ].map(([image, line1, line2], i) => <div className="service-item" key={i}><img src={typeof image === "object" ? image.url : ""} alt="" /><p>{String(line1)}<br />{String(line2)}</p></div>)}</section>
        <section className="categories-section"><SectionHeading title="Shop By Category" action="View All Categories" /><div className="category-grid">{categories.map(({ image, lines }, index) => <Button key={lines[0]} asChild variant="ghost" className="demo-button category-card"><Link to="/categories/$cat" params={{ cat: homeCategories[index]?.slug ?? "baby-clothing" }} aria-label={lines.join(" ")}><img src={image.url} alt={lines.join(" ")} /><span className="category-caption"><span>{lines[0]}<br />{lines[1]}</span><ChevronRight /></span></Link></Button>)}</div></section>
        <section className="promo-grid" aria-label="Baby essentials"><div className="promo"><img src={bath.url} alt="Bath Time Essentials. Soft towels, washcloths and more. Shop Now." /><Link to="/categories/$cat" params={{ cat: "bath-and-hygiene" }} aria-label="Shop bath time essentials" className="demo-button promo-hit" /></div><div className="promo"><img src={feeding.url} alt="Feeding Made Easy. Bottles, bibs, high chairs and more. Explore Now." /><Link to="/categories/$cat" params={{ cat: "feeding-and-nursing" }} aria-label="Explore feeding essentials" className="demo-button promo-hit" /></div></section>
        <section className="products-section"><SectionHeading title="Trending Products" action="View More" /><div className="product-grid">{products.map(product => <article className="product-card" key={product.code}><div className="product-image"><ProductLink slug={product.slug} label={product.title}><img src={product.image.url} alt={product.title} /></ProductLink><span className="discount">{product.discount}% OFF</span><WishButton slug={product.slug} className="wishlist-button" /></div><div className="product-details"><h3><ProductLink slug={product.slug}>{product.title}</ProductLink></h3><div className="rating"><span className="stars">★★★★★</span><span>{product.rating}</span></div><p className="product-code">{product.code}</p><div className="price-row"><strong>৳ {product.price}</strong><AddToCartButton slug={product.slug} className="add-cart"><ShoppingCart /></AddToCartButton></div></div></article>)}</div></section>
        <section className="brands-section"><SectionHeading title="Top Brands" action="View All Brands" /><div className="brand-row"><Button type="button" variant="ghost" aria-label="Previous brands" className="demo-button brand-prev" onClick={e => e.currentTarget.parentElement?.scrollBy({ left: -200, behavior: "smooth" })}><ChevronLeft /></Button>{brands.map(([image, name]) => <Button key={name} asChild variant="ghost" className="demo-button brand-tile">{name === "Johnson's" ? <Link to="/brands/johnsons" aria-label={name}><img src={image.url} alt={name} /></Link> : <Link to="/brands/$brand" params={{ brand: slugify(name) }} aria-label={name}><img src={image.url} alt={name} /></Link>}</Button>)}<Button type="button" variant="ghost" aria-label="Next brands" className="demo-button brand-next" onClick={e => e.currentTarget.parentElement?.scrollBy({ left: 200, behavior: "smooth" })}><ChevronRight /></Button></div></section>
        <ShopBottomNav active="Home" />
      </main>
    </div></>
  );
}
