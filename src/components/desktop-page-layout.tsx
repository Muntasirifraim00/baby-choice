import { useRouterState, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DeskHeader, DeskFooter } from "@/components/desktop-shop";
import { Heart, MapPin, CreditCard, Bell, Settings, Package, Headphones } from "lucide-react";

const accountLinks = [
  { to: "/account", label: "My Account", icon: Settings },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/checkout/address", label: "Address Book", icon: MapPin },
  { to: "/checkout/payment", label: "Payment Methods", icon: CreditCard },
  { to: "/account/notifications", label: "Notifications", icon: Bell },
  { to: "/account/settings", label: "Account Settings", icon: Settings },
  { to: "/support", label: "Help & Support", icon: Headphones },
] as const;

/** Redesigned pages render their own responsive header/footer (PageShell). */
const ownsChrome = (path: string) =>
  path.startsWith("/categories/") || path.startsWith("/product/") || path === "/cart" ||
  path === "/checkout" || path.startsWith("/checkout/") || path === "/order-confirmed";

/** One rendered page and one cart state serve both screen sizes. */
export function DesktopPageLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/" || path === "/categories" || ownsChrome(path)) return children;
  const account = path === "/account" || path.startsWith("/account/");
  return <div className="desktop-page" data-page={path}>
    <div className="desktop-chrome"><DeskHeader /></div>
    <div className={`desktop-page-body ${account ? "desktop-account-layout" : ""}`}>
      {account && <aside className="desktop-account-sidebar desktop-chrome" aria-label="Account navigation">
        <h2>My Account</h2>
        {accountLinks.map(({ to, label, icon: Icon }) => to.startsWith("/account/")
          ? <Link key={to} to="/account/$section" params={{ section: to.slice("/account/".length) }} className={path === to ? "selected" : ""}><Icon />{label}</Link>
          : <Link key={to} to={to === "/account/orders" || to === "/account/notifications" || to === "/account/settings" ? "/account" : to} className={path === to ? "selected" : ""}><Icon />{label}</Link>)}
      </aside>}
      {children}
    </div>
    <div className="desktop-chrome"><DeskFooter /></div>
  </div>;
}