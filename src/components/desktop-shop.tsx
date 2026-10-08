import { HomeTrendingGrid } from "@/components/home-trending";
import { DesktopHeader } from "@/components/desktop-header";
import { HomeCategorySection } from "@/components/home-categories";
import { HomeBrands } from "@/components/home-brands";
import { getProduct } from "@/lib/products";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Heart, House, Phone, Search, ShoppingCart, Star, Truck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartCount } from "@/components/live";
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

const brands = [[b1, "Aptamil"], [b2, "Nestlé"], [b3, "Sudocrem"], [b4, "Pampers"], [b5, "Carter's"], [b6, "Johnson's"], [b7, "Philips Avent"]] as const;
const services = [[s1, "Fast & Reliable Delivery"], [s2, "100% Original Products"], [s3, "Easy Returns"], [s4, "Dedicated Support"]] as const;

export function DeskHeader({ active }: { active?: "home" | "categories" }) {
  return <DesktopHeader />;
}

export function DeskFooter() {
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
    <HomeCategorySection />
    <section className="dk-promos"><img src={bath.url} alt="Bath Time Essentials. Shop Now." /><img src={feeding.url} alt="Feeding Made Easy. Explore Now." /></section>
    <Heading title="Trending Products" to="/trending" action="View More" />
    <HomeTrendingGrid />
    <HomeBrands />
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
