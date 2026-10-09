import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CartIco, GridIco, HomeIco, TagIco, UserIco } from "@/components/header-motion";
import { useCart } from "@/lib/cart-store";
import { HdGradients } from "@/components/home-design/art";
import { Announcement, Footer, Header } from "@/components/home-design/home-design";

/**
 * Shared chrome for the redesigned pages.
 * Desktop (>= 900px): the homepage header and footer.
 * Phone: the page draws its own app-style top bar and bottom bar (classes `pg-mob` / `pg-desk`).
 */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="hd pg-shell">
      <HdGradients />
      <div className="pg-desk">
        <Announcement />
      </div>
      <div className="pg-desk pg-sticky">
        <Header />
      </div>
      <main className={`pg-main ${className ?? ""}`}>{children}</main>
      <div className="pg-desk">
        <Footer />
      </div>
    </div>
  );
}

type Tab = "home" | "categories" | "offers" | "reorder" | "cart" | "account";

/** Phone-only bottom navigation used by browse pages (reference: public/design-ref/header-mobile.html). */
export function MobileTabBar({ active }: { active?: Tab }) {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const cls = (t: Tab) => `pg-tab ${active === t ? "on" : ""}`;
  return (
    <nav aria-label="App" className="pg-tabbar pg-mob">
      <Link to="/" className={cls("home")} aria-current={active === "home" ? "page" : undefined}>
        <HomeIco />
        Home
      </Link>
      <Link to="/categories" className={cls("categories")} aria-current={active === "categories" ? "page" : undefined}>
        <GridIco s={21} />
        Categories
      </Link>
      <Link to="/offers" className={`${cls("offers")} pg-tab-offers`} aria-current={active === "offers" ? "page" : undefined}>
        <TagIco s={21} />
        Offers<span className="pg-tbadge" aria-hidden="true">%</span>
      </Link>
      <Link to="/cart" className={cls("cart")} aria-current={active === "cart" ? "page" : undefined}>
        <CartIco s={21} />
        Cart{count > 0 ? ` (${count})` : ""}
      </Link>
      <Link to="/account" className={cls("account")} aria-current={active === "account" ? "page" : undefined}>
        <UserIco s={21} />
        Account
      </Link>
    </nav>
  );
}
