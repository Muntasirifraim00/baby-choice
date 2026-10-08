import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CreditCard, HelpCircle, MessageCircle, Package, Phone, RotateCcw, Send, ShieldCheck, Truck, UserRound, Zap } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { Tile } from "@/components/live-ui";
import { useCart } from "@/lib/cart-store";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/support")({ head: () => liveHead("Customer Support", "We're here to help — call, WhatsApp or live chat with Baby Choice support."), component: Support });

const topics = [
  { i: Truck, t: "Delivery & Shipping", a: "We deliver across Bangladesh in 2–4 days. Inside Dhaka orders usually arrive within 1–2 days." },
  { i: Package, t: "Order Status", a: "Enter your order number above and tap Track Order to see the latest status." },
  { i: RotateCcw, t: "Returns & Refunds", a: "Unopened products can be returned within 7 days. Refunds are processed within 3–5 working days." },
  { i: CreditCard, t: "Payment Issues", a: "We accept Cash on Delivery, bKash, Nagad and cards. If a payment failed, no money is deducted." },
  { i: HelpCircle, t: "Product Information", a: "Every product is 100% original. Check the product page for sizes, ingredients and usage." },
  { i: UserRound, t: "Account Help", a: "You can update your profile, addresses and password from My Account." },
];

function Support() {
  const { lastOrder } = useCart();
  const [order, setOrder] = useState(""); const [status, setStatus] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [chat, setChat] = useState(false); const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Hi! 👋 How can we help you today?" }]);
  const track = (e: React.FormEvent) => { e.preventDefault(); const n = order.trim().toUpperCase(); if (!n) { setStatus("Please enter your order number."); return; } setStatus(n === lastOrder?.number || n === "BC-20261007-1234" ? `Order ${n} is confirmed and being packed. Estimated delivery: 2–4 days.` : `We couldn't find order ${n}. Please check the number.`); };
  const send = (e: React.FormEvent) => { e.preventDefault(); if (!msg.trim()) return; setMsgs(m => [...m, { me: true, t: msg.trim() }, { me: false, t: "Thanks! A support agent will reply within 5 minutes." }]); setMsg(""); };
  return <ShoppingShell crumb="Customer Support" className="lv">
    <h1 className="lv-title">Customer Support</h1><p className="lv-sub">We’re Here to Help</p>
    <div className="lv-grid3"><Tile icon={<Phone />} title="Call Us" text="+880 1712 345678" href="tel:+8801712345678" /><Tile icon={<MessageCircle />} title="WhatsApp" text="Mon–Sat 9AM–9PM" href="https://wa.me/8801712345678" /><Tile icon={<Zap />} title="Live Chat" text="Available Now" onClick={() => setChat(true)} /></div>
    <form className="lv-card" onSubmit={track}><h2><Package />Need help with an order?</h2><label className="lv-input"><input value={order} onChange={e => setOrder(e.target.value)} placeholder="Order number (e.g. BC-20261007-1234)" aria-label="Order number" /></label><button type="submit" className="lv-btn wide">Track Order</button>{status && <p className="lv-p" role="status">{status}</p>}</form>
    <h2 className="lv-h2">How can we help you?</h2>
    <div className="lv-grid3">{topics.map(({ i: Icon, t }) => <Tile key={t} icon={<Icon />} title={t} onClick={() => setOpen(t)} />)}</div>
    <h2 className="lv-h2">Frequently Asked Questions</h2>
    <div className="lv-card lv-faq">{topics.map(({ t, a }) => <details key={t} open={open === t} onToggle={e => { if ((e.target as HTMLDetailsElement).open) setOpen(t); }}><summary>{t}</summary><p>{a}</p></details>)}<Link to="/about" className="lv-link">View All Topics →</Link></div>
    <div className="lv-grid2"><div className="lv-card"><h2><Clock />Support Hours</h2><p className="lv-p">Mon–Sat: 9AM–9PM<br />Sunday: 10AM–6PM</p></div><div className="lv-card"><h2><Zap />Average Response</h2><p className="lv-p">Under 5 minutes on Live Chat</p></div></div>
    <div className="lv-card"><h2>Still need help?</h2>{!chat ? <button type="button" className="lv-btn wide" onClick={() => setChat(true)}><MessageCircle />Start Live Chat</button> : <div className="lv-chat"><div>{msgs.map((m, i) => <p key={i} className={m.me ? "me" : ""}>{m.t}</p>)}</div><form onSubmit={send}><input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your message..." aria-label="Chat message" /><button type="submit" className="lv-btn" aria-label="Send"><Send /></button></form></div>}</div>
    <div className="lv-card"><h2><ShieldCheck />Your Privacy Matters</h2><p className="lv-p">We never share your personal information with anyone.</p></div>
  </ShoppingShell>;
}
