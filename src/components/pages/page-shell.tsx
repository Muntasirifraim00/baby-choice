import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { House, LayoutGrid, RefreshCw, ShoppingCart, UserRound } from "lucide-react";
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

type Tab = "home" | "categories" | "reorder" | "cart" | "account";

/** Phone-only bottom navigation used by browse pages. */
export function MobileTabBar({ active }: { active?: Tab }) {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const cls = (t: Tab) => `pg-tab ${active === t ? "on" : ""}`;
  return (
    <nav aria-label="App" className="pg-tabbar pg-mob">
      <Link to="/" className={cls("home")}>
        <House aria-hidden="true" />
        Home
      </Link>
      <Link to="/categories" className={cls("categories")}>
        <LayoutGrid aria-hidden="true" />
        Categories
      </Link>
      <Link to="/account/$section" params={{ section: "orders" }} className={cls("reorder")}>
        <RefreshCw aria-hidden="true" />
        Reorder
      </Link>
      <Link to="/cart" className={cls("cart")}>
        <ShoppingCart aria-hidden="true" />
        Cart{count > 0 ? ` (${count})` : ""}
      </Link>
      <Link to="/account" className={cls("account")}>
        <UserRound aria-hidden="true" />
        Account
      </Link>
    </nav>
  );
}
