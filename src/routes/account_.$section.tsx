import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Package, Truck, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { ShoppingShell } from "@/components/shopping-reference";
import { liveHead } from "@/lib/live-head";

const titles: Record<string, [string, string]> = {
  orders: ["My Orders", "View and track your Baby Choice orders."],
  notifications: ["Notifications", "Manage your Baby Choice notification preferences."],
  settings: ["Account Settings", "Update your Baby Choice account details."],
};

export const Route = createFileRoute("/account_/$section")({
  beforeLoad: ({ params }) => { if (!titles[params.section]) throw notFound(); },
  head: ({ params }) => liveHead(titles[params.section]?.[0] ?? "Account", titles[params.section]?.[1] ?? ""),
  component: Section,
});

const orders = [
  { id: "BC-20261007-1234", date: "7 Oct 2026", total: "৳2,790", s: "Processing", i: Truck, c: "green" },
  { id: "BC-20261002-1180", date: "2 Oct 2026", total: "৳1,350", s: "Shipped", i: Truck, c: "green" },
  { id: "BC-20260921-0942", date: "21 Sep 2026", total: "৳940", s: "Delivered", i: CircleCheck, c: "purple" },
  { id: "BC-20260910-0815", date: "10 Sep 2026", total: "৳620", s: "Delivered", i: CircleCheck, c: "purple" },
  { id: "BC-20260828-0703", date: "28 Aug 2026", total: "৳1,890", s: "Delivered", i: CircleCheck, c: "purple" },
];

function Section() {
  const { section } = Route.useParams();
  const [title, sub] = titles[section];
  const [prefs, setPrefs] = useState({ "Order updates": true, "Offers & deals": true, "New arrivals": false, "SMS alerts": true, "Email newsletter": false });
  return <ShoppingShell crumb={`My Account › ${title}`} title={title} className="ac" active="Account">
    <p className="ac-sub">{sub}</p>
    {section === "orders" && <nav className="ac-rows">{orders.map(o => <Link key={o.id} to="/order-confirmed" className="ac-row"><i className={`ac-c-${o.c}`}>{o.s === "Delivered" ? <o.i /> : <Package />}</i><span><b>{o.id}</b><small>{o.date} · {o.total} · {o.s}</small></span><ChevronRight /></Link>)}</nav>}
    {section === "notifications" && <div className="ac-rows">{Object.entries(prefs).map(([k, v]) => <button type="button" key={k} className="ac-row" onClick={() => setPrefs(p => ({ ...p, [k]: !v }))}><span><b>{k}</b><small>{v ? "On" : "Off"}</small></span><em className={`lv-switch ${v ? "on" : ""}`} aria-label={v ? "On" : "Off"} /></button>)}</div>}
    {section === "settings" && <form className="ac-form" onSubmit={e => { e.preventDefault(); toast("Account details saved (demo)"); }}>
      {[["Full Name", "Sara Ahmed"], ["Phone Number", "+880 1712 345678"], ["Email Address", "saraahmed@gmail.com"]].map(([l, v]) => <label key={l}>{l}<input defaultValue={v} /></label>)}
      <label>New Password<input type="password" placeholder="Enter new password" /></label>
      <button type="submit" className="ac-save">Save Changes</button>
    </form>}
  </ShoppingShell>;
}
