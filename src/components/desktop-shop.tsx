import { getProduct } from "@/lib/products";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Heart, House, Phone, Search, ShoppingCart, Star, Truck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton, CartCount, WishButton } from "@/components/live";
import { slugify } from "@/lib/live-head";
import { catalogCategories } from "@/lib/catalog-demo";
import { homeCategories } from "@/lib/home-categories";
import { MenuButton } from "@/components/shop-menu";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";
import { HomeBanners } from "@/components/home-banners";
import allHero from "@/assets/all-hero.png.asset.json";
import allPromo from "@/assets/all-promo.png.asset.json";
import bath from "@/assets/bath.png.asset.json";
import feeding from "@/assets/feeding.png.asset.json";
const c1 = { url: getProduct("carters-girl-bodysuit-set")!.image };
const c2 = { url: getProduct("girl-pajama-set")!.image };
const c3 = { url: getProduct("girl-party-dress-bow")!.image };
const c4 = { url: getProduct("baby-hooded-towel")!.image };
const c5 = { url: getProduct("aptamil-advance-follow-on-milk")!.image };
const c6 = { url: getProduct("johnsons-baby-lotion")!.image };
const c7 = { url: getProduct("baby-stroller")!.image };
const c8 = { url: getProduct("baby-high-chair")!.image };
const p1 = { url: getProduct("sudocrem-nappy-rash-cream")!.image };
const p2 = { url: getProduct("carters-honey-cotton-wash-cloth")!.image };
const p3 = { url: getProduct("aptamil-advance-follow-on-milk")!.image };
const p4 = { url: getProduct("baby-hooded-towel")!.image };
import b1 from "@/assets/brand-1.png.asset.json";
import b2 from "@/assets/brand-2.png.asset.json";
import b3 from "@/assets/brand-3.png.asset.json";
import b4 from "@/assets/brand-4.png.asset.json";
import b5 from "@/assets/brand-5.png.asset.json";
import b6 from "@/assets/brand-6.png.asset.json";
import b7 from "@/assets/brand-7.png.asset.json";
import s1 from "@/assets/service-1.png.asset.json";
import s2 from "@/assets/service-2.png.asset.json";
import s3 from "@/assets/service-3.png.asset.json";
import s4 from "@/assets/service-4.png.asset.json";

const homeCats = [[c1, "Onesies & Bodysuits"], [c2, "Panjabi & Pajamas"], [c3, "Girls Party Dresses"], [c4, "Swaddle & Receiving"], [c5, "Baby Formula & Milk"], [c6, "Hair, Body & Skin Care"], [c7, "Strollers & Prams"], [c8, "High Chairs & Boosters"]] as const;
const products = [
  { slug: "sudocrem-nappy-rash-cream", image: p1, title: "Sudocrem – Antiseptic Healing Nappy Rash Cream", discount: 12, rating: "4.8 (320)", code: "14004BG", price: "890" },
  { slug: "carters-honey-cotton-wash-cloth", image: p2, title: "Carter's Honey Cotton Baby Wash Cloth Towel", discount: 20, rating: "4.7 (210)", code: "11882", price: "650" },
  { slug: "aptamil-advance-follow-on-milk", image: p3, title: "Aptamil Advance Follow On Milk Powder", discount: 15, rating: "4.9 (425)", code: "10120", price: "2,450" },
  { slug: "baby-hooded-towel", image: p4, title: "Baby Hooded Towel for Newborns (Soft)", discount: 10, rating: "4.8 (198)", code: "11876", price: "790" },
];
const brands = [[b1, "Aptamil"], [b2, "Nestlé"], [b3, "Sudocrem"], [b4, "Pampers"], [b5, "Carter's"], [b6, "Johnson's"], [b7, "Philips Avent"]] as const;
const services = [[s1, "Fast & Reliable Delivery"], [s2, "100% Original Products"], [s3, "Easy Returns"], [s4, "Dedicated Support"]] as const;

function DeskHeader({ active }: { active: "home" | "categories" }) {
  return <header className="dk-header">
    <div className="dk-topbar"><div className="dk-wrap"><span><Truck />Free delivery on orders over ৳3,000</span><span><Phone />+880 1712 345678</span></div></div>
    <div className="dk-wrap dk-main">
      <Link to="/" aria-label="Baby Choice home"><img src={logo.url} alt="Baby Choice — Everything for Your Little One" className="dk-logo" /></Link>
      <Link to="/search" className="dk-search"><Search /><span>Search for baby products, brands, or categories...</span><b>Search</b></Link>
      <div className="dk-icons">
        <Link to="/wishlist" aria-label="Wishlist"><Heart /><span>Wishlist</span></Link>
        <Link to="/account" aria-label="Account"><UserRound /><span>Account</span></Link>
        <Link to="/cart" aria-label="Shopping Cart" className="dk-cart"><ShoppingCart /><CartCount /><span>Cart</span></Link>
      </div>
    </div>
    <nav className="dk-nav"><div className="dk-wrap">
      <MenuButton />
      <Link to="/" className={active === "home" ? "on" : ""}>Home</Link>
      <Link to="/categories" className={active === "categories" ? "on" : ""}>All Categories</Link>
      <Link to="/categories/baby-clothing">Baby Clothing</Link>
      <Link to="/trending">Trending</Link>
      <Link to="/brands">Brands</Link>
      <Link to="/offers">Offers</Link>
      <Link to="/about">About & Contact</Link>
    </div></nav>
  </header>;
}

function DeskFooter() {
  return <footer className="dk-footer"><div className="dk-wrap">
    <div><img src={logo.url} alt="Baby Choice" className="dk-logo" /><p>Safe, gentle and premium-quality products for every little one, delivered across Bangladesh.</p></div>
    <div><h4>Shop</h4><Link to="/categories">All Categories</Link><Link to="/trending">Trending</Link><Link to="/brands">Brands</Link><Link to="/offers">Offers</Link></div>
    <div><h4>Account</h4><Link to="/account">My Account</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link><Link to="/support">Support</Link></div>
    <div><h4>Contact</h4><p>House 25, Road 10, Dhanmondi, Dhaka 1209</p><p>support@babychoice.com</p><p>+880 1712 345678</p></div>
  </div><p className="dk-copy">© 2026 Baby Choice. All rights reserved.</p></footer>;
}

function Heading({ title, to, action }: { title: string; to: "/categories" | "/trending" | "/brands"; action: string }) {
  return <div className="dk-heading"><h2>{title}</h2><Link to={to}>{action}<ArrowRight /></Link></div>;
}

function Shell({ active, children }: { active: "home" | "categories"; children: ReactNode }) {
  return <div className="desktop-view"><DeskHeader active={active} /><main className="dk-wrap dk-body">{children}</main><DeskFooter /></div>;
}

export function DesktopHome() {
  return <Shell active="home">
    <HomeBanners />
    <section className="dk-services">{services.map(([img, t]) => <div key={t}><img src={img.url} alt="" /><p>{t}</p></div>)}</section>
    <Heading title="Shop By Category" to="/categories" action="View All Categories" />
    <section className="dk-cats">{homeCats.map(([img, n], index) => <Link key={n} to="/categories/$cat" params={{ cat: homeCategories[index]?.slug ?? "baby-clothing" }} className="demo-button dk-cat"><img src={img.url} alt={n} /><span>{n}<ChevronRight /></span></Link>)}</section>
    <section className="dk-promos"><img src={bath.url} alt="Bath Time Essentials. Shop Now." /><img src={feeding.url} alt="Feeding Made Easy. Explore Now." /></section>
    <Heading title="Trending Products" to="/trending" action="View More" />
    <section className="dk-products">{products.map(p => <article key={p.code} className="dk-product">
      <div className="dk-pimg"><img src={p.image.url} alt={p.title} /><em>{p.discount}% OFF</em><WishButton slug={p.slug} className="dk-heart" /></div>
      <h3>{p.title}</h3><div className="dk-rating"><Star />{p.rating}</div><small>{p.code}</small>
      <div className="dk-price"><strong>৳ {p.price}</strong><AddToCartButton slug={p.slug} className="dk-add"><ShoppingCart />Add</AddToCartButton></div>
    </article>)}</section>
    <Heading title="Top Brands" to="/brands" action="View All Brands" />
    <section className="dk-brands">{brands.map(([img, n]) => <Link key={n} to="/brands" aria-label={n}><img src={img.url} alt={n} /></Link>)}</section>
  </Shell>;
}

export function DesktopCategories() {
  return <Shell active="categories">
    <nav className="dk-crumb" aria-label="Breadcrumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><span>All Categories</span></nav>
    <section className="dk-cat-hero"><img src={allHero.url} alt="All Categories. Explore everything your baby needs in one place." /></section>
    <div className="dk-heading"><h2>All Categories <small>{catalogCategories.length} categories</small></h2></div>
    <section className="dk-allcats">{catalogCategories.map((c, i) => {
      const inner = <><img src={c.image.url} alt={c.name} /><span><span><strong>{c.name}</strong><small>{c.count} Items</small></span><ChevronRight /></span></>;
      return i === 0
        ? <Button key={c.name} asChild variant="ghost" className="demo-button dk-allcat"><Link to="/categories/baby-clothing">{inner}</Link></Button>
        : <Button key={c.name} asChild variant="ghost" className="demo-button dk-allcat"><Link to="/categories/$cat" params={{ cat: slugify(c.name) }}>{inner}</Link></Button>;
    })}</section>
    <section className="dk-cat-promo"><Link to="/categories/baby-clothing" aria-label="Shop Now"><img src={allPromo.url} alt="Find Everything Your Baby Needs. Shop Now." /></Link></section>
  </Shell>;
}
