import { Link } from "@tanstack/react-router";
import { BadgePercent, ChevronRight, Heart, House, LayoutGrid, Menu, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import type { ReactNode } from "react";
import { CartCount } from "@/components/live";
import { MenuButton } from "@/components/shop-menu";

export function DemoControl({ children, label, className = "" }: { children?: ReactNode; label: string; className?: string }) {
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={label} aria-disabled="true" tabIndex={-1}>{children}</Button>;
}

export function ShopHeader() {
  return <><header className="shop-header">
    <MenuButton className="demo-button menu-button" />
    <img src={logo.url} className="shop-logo" alt="Baby Choice — Everything for Your Little One" />
    <div className="header-tools"><Button asChild variant="ghost" className="demo-button header-circle"><a href="tel:+8801712345678" aria-label="Call Baby Choice"><Phone fill="currentColor" /></a></Button><Button asChild variant="ghost" className="demo-button header-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart fill="currentColor" /><CartCount className="cart-count" /></Link></Button></div>
  </header><Button variant="ghost" asChild className="search-bar search-link"><Link to="/search"><Search /><span>Search for baby products, brands, or categories...</span><span className="search-submit"><Search /></span></Link></Button></>;
}

export function ShopBottomNav({ active = "Categories" }: { active?: "Home" | "Categories" | "Offers" | "Wishlist" | "Account" | "none" }) {
  return <nav className="bottom-nav" aria-label="Main navigation">
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Home" ? "active" : ""}`}><Link to="/" aria-label="Home"><House fill={active === "Home" ? "currentColor" : "none"} /><span>Home</span></Link></Button>
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Categories" ? "active category-active" : ""}`}><Link to="/categories" aria-label="Categories"><LayoutGrid fill={active === "Categories" ? "currentColor" : "none"} /><span>Categories</span></Link></Button>
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Offers" ? "active" : ""}`}><Link to="/offers" aria-label="Offers"><BadgePercent /><span>Offers</span></Link></Button>
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Wishlist" ? "active category-active" : ""}`}><Link to="/wishlist" aria-label="Wishlist"><Heart fill={active === "Wishlist" ? "currentColor" : "none"} /><span>Wishlist</span></Link></Button>
    <Button variant="ghost" asChild className={`demo-button nav-item ${active === "Account" ? "active category-active" : ""}`}><Link to="/account" aria-label="Account"><UserRound fill={active === "Account" ? "currentColor" : "none"} /><span>Account</span></Link></Button>
  </nav>;
}

export function ShopBreadcrumb({ clothing = false }: { clothing?: boolean }) {
  return <nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><Link to="/categories">All Categories</Link>{clothing && <><ChevronRight /><span>Baby Clothing</span></>}</nav>;
}