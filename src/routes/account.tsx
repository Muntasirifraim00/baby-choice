import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, CreditCard, Headphones, Heart, LogOut, MapPin, Package, Pencil, Settings, UserRound } from "lucide-react";
import { toast } from "sonner";
import { ShoppingShell } from "@/components/shopping-reference";
import { useCart } from "@/lib/cart-store";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/account")({ head: () => liveHead("My Account", "Manage your Baby Choice orders, wishlist, addresses and payment methods."), component: Account });

function Account() {
  const { wish } = useCart();
  const [notify, setNotify] = useState(true);
  const menu = [
    { i: Package, t: "My Orders", to: "/order-confirmed" }, { i: Heart, t: "My Wishlist", to: "/wishlist" }, { i: MapPin, t: "Address Book", to: "/checkout/address" },
    { i: CreditCard, t: "Payment Methods", to: "/checkout/payment" }, { i: Settings, t: "Account Settings", to: "/login" }, { i: Headphones, t: "Help & Support", to: "/support" },
  ];
  return <ShoppingShell crumb="My Account" className="lv" active="Account">
    <h1 className="lv-title">My Account</h1>
    <section className="lv-card lv-profile"><span className="lv-avatar"><UserRound /></span><div><h2>Sara Ahmed</h2><p>+880 1712 345678</p><p>saraahmed@gmail.com</p></div><button type="button" className="lv-btn ghost" onClick={() => toast("Profile editing is available after login.")}><Pencil />Edit Profile</button></section>
    <div className="lv-grid4 lv-stats">{[["5", "Total Orders", "/order-confirmed"], ["2", "In Progress", "/order-confirmed"], ["3", "Delivered", "/order-confirmed"], [String(wish.length), "Wishlist Items", "/wishlist"]].map(([n, t, to]) => <Link key={t} to={to as "/"} className="lv-tile"><b>{n}</b><small>{t}</small></Link>)}</div>
    <nav className="lv-card lv-list">
      {menu.map(({ i: Icon, t, to }) => <Link key={t} to={to as "/"}><i><Icon /></i><span>{t}</span><ChevronRight /></Link>)}
      <button type="button" onClick={() => { setNotify(v => !v); toast(notify ? "Notifications turned off" : "Notifications turned on"); }}><i><Bell /></i><span>Notifications</span><em className={`lv-switch ${notify ? "on" : ""}`} aria-label={notify ? "On" : "Off"} /></button>
    </nav>
    <Link to="/login" className="lv-btn ghost wide"><LogOut />Logout</Link>
  </ShoppingShell>;
}
