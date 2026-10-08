import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/pages/page-shell";
import { totals, useCart } from "@/lib/cart-store";
import { getProduct } from "@/lib/products";
import { IcTruck, money, paymentLabel, resolveAddress, useCheckoutDraft, useMounted } from "@/components/pages/checkout-page";

const CONFETTI = [
  { l: "8%", c: "#ffd166", r: false, d: 0 }, { l: "22%", c: "#f0457a", r: true, d: .2 }, { l: "36%", c: "#7ee2b3", r: false, d: .5 },
  { l: "50%", c: "#ffffff", r: true, d: .1 }, { l: "64%", c: "#ffd166", r: false, d: .35 }, { l: "78%", c: "#8fd0ff", r: true, d: .6 }, { l: "90%", c: "#f0457a", r: false, d: .25 },
];
const STAGES = ["Confirmed", "Packed", "On the way", "Delivered"];

const IcCopy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>;

export function OrderConfirmedPage() {
  const { lastOrder, address } = useCart();
  const d = useCheckoutDraft();
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);

  let body;
  if (!mounted) {
    body = <div className="ck-done-in"><p className="ck-done-lead" aria-busy="true">Loading your order…</p></div>;
  } else if (!lastOrder) {
    body = (
      <div className="ck-done-in">
        <h1 className="ck-done-h">No recent order</h1>
        <p className="ck-done-lead">We couldn't find an order placed on this device. Fill your cart and check out, and your confirmation will show up here.</p>
        <div className="ck-done-actions">
          <Link to="/" className="ck-btn sun">Start shopping</Link>
          <Link to="/cart" className="ck-btn glass">Go to cart</Link>
        </div>
      </div>
    );
  } else {
    const t = totals(lastOrder.lines);
    const addr = resolveAddress(address, d);
    const cod = lastOrder.payment === "Cash on Delivery";
    const copy = () => {
      void navigator.clipboard?.writeText(lastOrder.number).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => undefined);
    };
    body = (
      <div className="ck-done-in">
        <div className="ck-badge" aria-hidden="true">
          <span className="ck-ring" />
          <span className="ck-pop"><svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#1fae73" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path className="ck-draw" d="m5 12 5 5L20 7" /></svg></span>
        </div>
        <h1 className="ck-done-h ck-fadeup">Order placed!</h1>
        <p className="ck-done-lead ck-fadeup">Thank you! Your little one's goodies are being packed with love.</p>

        <section className="ck-done-card ck-fadeup" aria-label="Order details">
          <div className="ck-done-top">
            <div>
              <span className="ck-k">Order number</span>
              <div className="ck-ordno">{lastOrder.number}
                <button type="button" className="ck-copy" onClick={copy} aria-label={copied ? "Order number copied" : "Copy order number"}><IcCopy /></button>
              </div>
              <span className="ck-k">Placed {lastOrder.placed}</span>
            </div>
            <span className="ck-pill mint">Confirmed</span>
          </div>
          <div className="ck-eta">
            <IcTruck w={36} className="ck-float-sm" />
            <div><b>Estimated delivery in 2–4 days</b><span>{addr ? `${addr.label} · ${addr.line}` : "To the address you chose at checkout"}</span></div>
          </div>
          <ol className="ck-track4" aria-label="Order status: confirmed">
            {STAGES.map((s, i) => <li key={s} className={i === 0 ? "on" : ""}><span aria-hidden="true" />{s}</li>)}
          </ol>
          <details className="ck-done-items">
            <summary>Your items ({t.count})</summary>
            <ul>
              {lastOrder.lines.map(l => { const p = getProduct(l.slug); return p ? <li key={l.slug + l.size}><span>{l.qty} × {p.name}{l.size ? ` · ${l.size}` : ""}</span><b>{money(p.price * l.qty)}</b></li> : null; })}
              <li><span>Delivery</span><b>{t.delivery ? money(t.delivery) : "FREE"}</b></li>
            </ul>
          </details>
          <div className="ck-done-pay">
            <span>{cod ? "Pay on delivery · Cash" : `${paymentLabel(lastOrder.payment)} (demo, not charged)`}</span>
            <b>{money(t.total)}</b>
          </div>
        </section>

        <div className="ck-done-actions ck-fadeup">
          <Link to="/account/$section" params={{ section: "orders" }} className="ck-btn sun">Track my order</Link>
          <Link to="/" className="ck-btn glass">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <PageShell className="ck">
      <div className="ck-done">
        {mounted && lastOrder && CONFETTI.map((c, i) => <span key={i} className={`ck-confetti ${c.r ? "round" : ""}`} style={{ left: c.l, background: c.c, animationDelay: `${c.d}s` }} aria-hidden="true" />)}
        <span className="ck-done-blob" aria-hidden="true" />
        {body}
      </div>
    </PageShell>
  );
}
