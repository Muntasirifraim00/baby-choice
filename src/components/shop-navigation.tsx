import { Link } from "@tanstack/react-router";
import { BadgePercent, ChevronRight, Heart, House, LayoutGrid, Menu, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import type { ReactNode } from "react";

export function DemoControl({ children, label, className = "" }: { children?: ReactNode; label: string; className?: string }) {
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={label} aria-disabled="true" tabIndex={-1}>{children}</Button>;
}

export function ShopHeader() {
  return <><header className="shop-header">
    <DemoControl label="Menu" className="menu-button"><Menu /></DemoControl>
    <img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" />
    <div className="header-tools"><DemoControl label="Call Baby Choice" className="header-circle"><Phone fill="currentColor" /></DemoControl><DemoControl label="Cart, 3 items" className="header-circle"><ShoppingCart fill="currentColor" /><span className="cart-count">3</span></DemoControl></div>
  </header><div className="search-bar"><Search /><span>Search for baby products, brands, or categories...</span><DemoControl label="Search" className="search-submit"><Search /></DemoControl></div></>;
}

export function ShopBottomNav({ active = "Categories" }: { active?: "Home" | "Categories" }) {
  return <nav className="bottom-nav" aria-label="Main navigation">
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Home" ? "active" : ""}`}><Link to="/" aria-label="Home"><House fill={active === "Home" ? "currentColor" : "none"} /><span>Home</span></Link></Button>
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Categories" ? "active category-active" : ""}`}><Link to="/categories" aria-label="Categories"><LayoutGrid fill={active === "Categories" ? "currentColor" : "none"} /><span>Categories</span></Link></Button>
    <DemoControl label="Offers" className="nav-item"><BadgePercent /><span>Offers</span></DemoControl>
    <DemoControl label="Wishlist" className="nav-item"><Heart /><span>Wishlist</span></DemoControl>
    <DemoControl label="Account" className="nav-item"><UserRound /><span>Account</span></DemoControl>
  </nav>;
}

export function ShopBreadcrumb({ clothing = false }: { clothing?: boolean }) {
  return <nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><Link to="/categories">All Categories</Link>{clothing && <><ChevronRight /><span>Baby Clothing</span></>}</nav>;
}