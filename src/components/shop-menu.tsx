import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, ChevronRight, Crown, FileText, Gift, Globe, Headphones, Heart, House, Info, LayoutGrid, Menu, Package, Settings, Truck, UserRound, CircleHelp, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import logo from "@/assets/logo.png.asset.json";
import baby from "@/assets/gen-teddy.jpg";

const MenuContext = createContext<(() => void) | null>(null);
const groups = [
  { title: "", items: [
    { name: "Home", icon: House, to: "/" }, { name: "Categories", icon: LayoutGrid, to: "/categories" },
    { name: "Offers", icon: BadgePercent, to: "/offers" }, { name: "New Arrivals", icon: Gift, to: "/trending" },
    { name: "Best Sellers", icon: Crown, to: "/trending/popular" },
  ] },
  { title: "MY ACCOUNT", items: [
    { name: "My Account", icon: UserRound, to: "/account" }, { name: "My Orders", icon: Package, to: "/order-confirmed" },
    { name: "Order Details", icon: FileText, to: "/order-confirmed" }, { name: "Track Order", icon: Truck, to: "/support", hash: "track-order" },
    { name: "Wishlist", icon: Heart, to: "/wishlist" }, { name: "Account Settings", icon: Settings, to: "/account" },
  ] },
  { title: "HELP & INFORMATION", items: [
    { name: "Customer Support", icon: Headphones, to: "/support" }, { name: "FAQ", icon: CircleHelp, to: "/support", hash: "faq" },
    { name: "About & Contact", icon: Info, to: "/about" },
  ] },
] as const;

export function MenuButton({ className = "" }: { className?: string }) {
  const open = useContext(MenuContext);
  return <Button type="button" variant="ghost" className={className} onClick={() => open?.()} aria-label="Menu"><Menu /></Button>;
}

export function ShopMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  return <MenuContext.Provider value={() => setOpen(true)}>{children}
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="bc-menu" aria-describedby={undefined}>
        <SheetTitle className="sr-only">Baby Choice menu</SheetTitle>
        <div className="bc-menu-scroll">
          <Link to="/" className="bc-menu-brand" onClick={() => setOpen(false)}><img src={logo.url} alt="Baby Choice — Everything for Your Little One" /></Link>
          <Link to="/account" className="bc-menu-profile" onClick={() => setOpen(false)}><span><UserRound /></span><div><b>Sara Ahmed</b><small>saraahmed@gmail.com</small></div><ChevronRight /></Link>
          <nav aria-label="Baby Choice menu">{groups.map(group => <section key={group.title} className="bc-menu-group">
            {group.title && <h2>{group.title}</h2>}
            {group.items.map(item => <Button asChild variant="ghost" key={item.name} className={`bc-menu-item ${pathname === item.to && !("hash" in item) ? "is-active" : ""}`}>
              <Link to={item.to} hash={"hash" in item ? item.hash : undefined} onClick={() => setOpen(false)}><item.icon /><span>{item.name}</span><ChevronRight /></Link>
            </Button>)}
          </section>)}</nav>
          <div className="bc-menu-preferences">
            <label><Globe /><span>Language</span><select aria-label="Language" defaultValue="en"><option value="en">English</option></select><ChevronRight /></label>
            <label><Coins /><span>Currency</span><select aria-label="Currency" defaultValue="BDT"><option value="BDT">BDT (৳)</option></select><ChevronRight /></label>
          </div>
          <section className="bc-menu-promo"><div><h2><span>Special Offers</span><br />Just for Your Little One</h2><p>Get the best deals on baby products</p><Button asChild><Link to="/offers" onClick={() => setOpen(false)}>Shop Now<ArrowRight /></Link></Button></div><img src={baby} alt="Soft teddy bear" /></section>
        </div>
      </SheetContent>
    </Sheet>
  </MenuContext.Provider>;
}