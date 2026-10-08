import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleCheck, Copy, MapPin, ReceiptText, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { ShoppingShell } from "@/components/shopping-reference";
import { ItemRows, Panel, Summary, addresses } from "@/components/checkout-reference";
import { useCart, type CartLine } from "@/lib/cart-store";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/order-confirmed")({ head: () => liveHead("Order Confirmed", "Your Baby Choice order is confirmed. Track delivery and review your items."), component: Page });

const sample: CartLine[] = [{ slug: "johnsons-baby-shampoo", size: "500ml", qty: 1 }, { slug: "pampers-new-baby-diapers", size: "M", qty: 2 }, { slug: "johnsons-baby-wipes", size: "120 pcs", qty: 1 }];

function Page() {
  const { lastOrder, address } = useCart();
  const number = lastOrder?.number ?? "BC-20261007-1234";
  const lines = lastOrder?.lines ?? sample;
  const a = addresses.find(x => x.name === address) ?? addresses[0]!;
  return <ShoppingShell crumb="Order Confirmed" className="lv co-screen">
    <section className="lv-confirm"><CircleCheck /><h1>Your Order is Confirmed!</h1><p>Thank you for shopping with Baby Choice. We’ll deliver your order soon.</p></section>
    <div className="lv-card"><div className="lv-row"><span>Order Number</span><button type="button" className="lv-copy" onClick={() => { navigator.clipboard?.writeText(number); toast.success("Order number copied"); }}><b>{number}</b><Copy /></button></div><div className="lv-row"><span>Placed on</span><b>{lastOrder?.placed ?? "7 Oct 2026, 01:15 PM"}</b></div><div className="lv-row"><span>Payment</span><b>{lastOrder?.payment ?? "Cash on Delivery"}</b></div></div>
    <Panel title="Delivery Address" icon={<MapPin />}><p className="lv-p"><b>{a.name}</b><br />{a.line1} {a.line2}<br />+880 1712 345678</p></Panel>
    <Panel title={`Ordered Items (${lines.length})`} icon={<ShoppingCart />}><ItemRows lines={lines} review /></Panel>
    <Summary lines={lines} />
    <div className="lv-card"><h2><Truck />Estimated Delivery</h2><p className="lv-p">2–4 days across Bangladesh</p><Link to="/support" className="lv-btn">Track Order<ArrowRight /></Link></div>
    <div className="lv-grid2"><Link to="/account" className="lv-btn ghost"><ReceiptText />My Orders</Link><Link to="/" className="lv-btn">Continue Shopping</Link></div>
  </ShoppingShell>;
}
