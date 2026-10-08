import { Link, useRouterState } from "@tanstack/react-router";
import { BadgePercent, ChevronRight, House, Info, LayoutGrid, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import type { ReactNode } from "react";
import { CartCount } from "@/components/live";
import { MenuButton } from "@/components/shop-menu";

export function DemoControl({ children, label, className = "" }: { children?: ReactNode; label: string; className?: string }) {
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={label} aria-disabled="true" tabIndex={-1}>{children}</Button>;
}

export function ShopHeader() {
  return <div className="mobile-shop-masthead"><header className="shop-header">
    <MenuButton className="demo-button menu-button" />
    <Link to="/" aria-label="Baby Choice home" className="shop-logo-link"><img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" /></Link>
    <div className="header-tools"><Button asChild variant="ghost" className="demo-button header-circle"><a href="tel:+8801712345678" aria-label="Call Baby Choice"><Phone fill="currentColor" /></a></Button><Button asChild variant="ghost" className="demo-button header-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart fill="currentColor" /><CartCount className="cart-count" /></Link></Button></div>
  </header><Button variant="ghost" asChild className="search-bar search-link"><Link to="/search" aria-label="Search baby products"><Search /><span>Search products, brands & more…</span><span className="search-submit"><Search /></span></Link></Button></div>;
}

export function ShopBottomNav({ active = "Categories" }: { active?: "Home" | "Categories" | "Offers" | "Wishlist" | "Account" | "none" }) {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const items = [
    { label: "Home", to: "/", icon: House },
    { label: "Categories", to: "/categories", icon: LayoutGrid },
    { label: "Offers", to: "/offers", icon: BadgePercent },
    { label: "About", to: "/about", icon: Info },
    { label: "Account", to: "/account", icon: UserRound },
  ] as const;
  const selected = pathname === "/" || pathname === "/index" ? "Home"
    : pathname.startsWith("/categories") || pathname.startsWith("/brands") ? "Categories"
    : pathname.startsWith("/offers") ? "Offers"
    : pathname.startsWith("/about") ? "About"
    : pathname.startsWith("/account") ? "Account"
    : active === "none" ? "none" : "none";
  return <nav className="bottom-nav" aria-label="Main navigation">
    {items.map(({ label, to, icon: Icon }) => <Button key={label} variant="ghost" asChild className={`demo-button nav-item ${selected === label ? "active" : ""}`}><Link to={to} aria-label={label} aria-current={selected === label ? "page" : undefined}><span className="nav-icon"><Icon aria-hidden="true" /></span><span>{label}</span></Link></Button>)}
  </nav>;
}

export function ShopBreadcrumb({ clothing = false }: { clothing?: boolean }) {
  return <nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><Link to="/categories">All Categories</Link>{clothing && <><ChevronRight /><span>Baby Clothing</span></>}</nav>;
}