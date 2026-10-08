import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Camera, ChevronRight, ClipboardList, CreditCard, Headphones, Heart, LogOut, Mail, MapPin, Package, Pencil, Phone, Settings, CircleCheck, Truck } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { useCart } from "@/lib/cart-store";
import { liveHead } from "@/lib/live-head";
import avatar from "@/assets/account-avatar.jpg";

export const Route = createFileRoute("/account")({ head: () => liveHead("My Account", "Manage your Baby Choice orders, wishlist, addresses and payment methods."), component: Account });

const rows = [
  { i: ClipboardList, t: "My Orders", d: "View and track your orders", to: "/account/orders", c: "purple" },
  { i: Heart, t: "My Wishlist", d: "View your saved products", to: "/wishlist", c: "pink" },
  { i: MapPin, t: "Address Book", d: "Manage your delivery addresses", to: "/checkout/address", c: "blue" },
  { i: CreditCard, t: "Payment Methods", d: "Manage your payment options", to: "/checkout/payment", c: "green" },
  { i: Bell, t: "Notifications", d: "Manage your notification preferences", to: "/account/notifications", c: "yellow" },
  { i: Settings, t: "Account Settings", d: "Update your account details", to: "/account/settings", c: "purple" },
  { i: Headphones, t: "Help & Support", d: "Get help or contact us", to: "/support", c: "pink" },
] as const;

function Account() {
  const { wish } = useCart();
  const stats = [
    { i: Package, n: "5", t: "Total Orders", c: "pink" }, { i: Truck, n: "2", t: "In Progress", c: "green" },
    { i: CircleCheck, n: "3", t: "Delivered", c: "purple" }, { i: Heart, n: String(wish.length), t: "Wishlist Items", c: "pink", to: "/wishlist" },
  ];
  return <ShoppingShell crumb="My Account" title="My Account" className="ac" active="Account">
    <p className="ac-sub">Manage your profile, orders and preferences.</p>
    <section className="ac-profile">
      <div className="ac-avatar"><img src={avatar} alt="Sara Ahmed profile photo" width={816} height={816} /><Link to="/account/settings" aria-label="Change photo"><Camera /></Link></div>
      <div className="ac-info"><h2>Sara Ahmed</h2><p><Phone />+880 1712 345678</p><p><Mail />saraahmed@gmail.com</p></div>
      <Link to="/account/settings" className="ac-edit"><Pencil />Edit Profile</Link>
    </section>
    <section className="ac-stats">{stats.map(({ i: Icon, n, t, c, to }) => <Link key={t} to={(to ?? "/account/orders") as "/"} className="ac-stat"><i className={`ac-c-${c}`}><Icon /></i><b>{n}</b><small>{t}</small></Link>)}</section>
    <nav className="ac-rows" aria-label="Account menu">
      {rows.map(({ i: Icon, t, d, to, c }) => <Link key={t} to={to as "/"} className="ac-row"><i className={`ac-c-${c}`}><Icon /></i><span><b>{t}</b><small>{d}</small></span><ChevronRight /></Link>)}
      <Link to="/login" className="ac-row ac-logout"><i><LogOut /></i><span><b>Logout</b><small>Sign out from your account</small></span><ChevronRight /></Link>
    </nav>
  </ShoppingShell>;
}
