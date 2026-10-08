import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { PageShell, MobileTabBar } from "@/components/pages/page-shell";
import { useCart, totals, FREE_DELIVERY, type CartLine } from "@/lib/cart-store";
import { getProduct, products, tk, type Product } from "@/lib/products";

/* ---------------- helpers ---------------- */

const money = (n: number) => `৳ ${tk(Math.round(n))}`;
const MAX_QTY = 10;
const CARD_TINTS = ["#e6f2ff", "#ffeef4", "#e2f8ee", "#f1eaff", "#fff4d1", "#fff1f1"];
const tintOf = (slug: string): string => CARD_TINTS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % CARD_TINTS.length] ?? "#f1eaff";
const kindOf = (p: Product) => (p.type ?? p.name.split(/\s+/).slice(-1)[0] ?? p.category).toLowerCase().replace(/s$/, "");
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Row = { line: CartLine; product: Product };
type Undo = { text: string; line: CartLine; unwish: boolean; key: number };

/* ---------------- icons ---------------- */

const IcBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>;
const IcHeart = ({ s = 19 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#f0457a" strokeWidth="2.3" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" /></svg>;
const IcTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c21e55" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
const IcMinus = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>;
const IcPlus = ({ c = "currentColor" }: { c?: string }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
const IcCheck = ({ s = 10 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>;
const IcArrow = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const IcTruck = () => <svg className="ct-float-sm" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" fill="url(#hdPurple)" /><circle cx="6" cy="18" r="2" fill="#2a1650" /><circle cx="17" cy="18" r="2" fill="#2a1650" /></svg>;
const IcTicket = () => <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z" fill="url(#hdPink)" /><path d="M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>;
const IcStar = () => <svg className="ct-float-sm" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="#fff" /></svg>;
const IcLock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
const Teddy = ({ w = 150 }: { w?: number }) => (
  <svg className="ct-float" width={w} height={w * 56 / 60} viewBox="0 0 60 56" aria-hidden="true">
    <circle cx="16" cy="14" r="9" fill="url(#hdBrown)" /><circle cx="44" cy="14" r="9" fill="url(#hdBrown)" /><circle cx="30" cy="30" r="22" fill="url(#hdBrown)" />
    <ellipse cx="30" cy="38" rx="10" ry="7" fill="#f6dcc0" /><circle cx="22" cy="27" r="2.6" fill="#2b1d18" /><circle cx="38" cy="27" r="2.6" fill="#2b1d18" />
    <path d="M26 41q4-3 8 0" stroke="#2b1d18" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------------- page ---------------- */

export function CartPage() {
  const router = useRouter();
  const { lines, wish, add, setQty, remove, toggleWish } = useCart();
  const t = totals(lines);

  const rows: Row[] = useMemo(() => lines.flatMap(line => {
    const product = getProduct(line.slug);
    return product ? [{ line, product }] : [];
  }), [lines]);

  /* "Did you forget?" — real catalog items not already in the cart, favouring the cart's categories, one per kind */
  const forgot = useMemo(() => {
    const inCart = new Set(lines.map(l => l.slug));
    const cats = new Set(rows.map(r => r.product.category));
    const seen = new Set(rows.map(r => kindOf(r.product)));
    const pool = products
      .filter(p => !inCart.has(p.slug))
      .sort((a, b) => Number(cats.has(b.category)) - Number(cats.has(a.category)) || a.price - b.price || b.reviews - a.reviews);
    const out: Product[] = [];
    for (const p of pool) {
      const k = kindOf(p);
      if (seen.has(k)) continue;
      seen.add(k); out.push(p);
      if (out.length === 8) break;
    }
    return out;
  }, [lines, rows]);

  const wishItems = useMemo(() => wish.map(getProduct).filter((p): p is Product => !!p && !lines.some(l => l.slug === p.slug)).slice(0, 3), [wish, lines]);

  /* free-delivery progress + one-shot celebration when crossing the threshold */
  const freeShip = t.net >= FREE_DELIVERY;
  const pct = Math.min(100, (t.net / FREE_DELIVERY) * 100);
  const [celebrate, setCelebrate] = useState(false);
  const prevNet = useRef(t.net);
  useEffect(() => {
    const before = prevNet.current;
    prevNet.current = t.net;
    if (before > 0 && before < FREE_DELIVERY && t.net >= FREE_DELIVERY && !reduceMotion()) {
      setCelebrate(true);
      const id = window.setTimeout(() => setCelebrate(false), 1800);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [t.net]);

  /* undo snackbar */
  const [undo, setUndo] = useState<Undo | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);
  const offerUndo = (u: Omit<Undo, "key">) => {
    window.clearTimeout(undoTimer.current);
    setUndo(prev => ({ ...u, key: (prev?.key ?? 0) + 1 }));
    undoTimer.current = window.setTimeout(() => setUndo(null), 5000);
  };
  const doUndo = () => {
    if (!undo) return;
    const p = getProduct(undo.line.slug);
    if (p) add(p, undo.line.size, undo.line.qty);
    if (undo.unwish) toggleWish(undo.line.slug);
    window.clearTimeout(undoTimer.current);
    setUndo(null);
  };

  const removeRow = ({ line, product }: Row) => {
    remove(line.slug, line.size);
    offerUndo({ text: `${product.name} removed`, line, unwish: false });
  };
  const saveRow = ({ line, product }: Row) => {
    const already = wish.includes(line.slug);
    if (!already) toggleWish(line.slug);
    remove(line.slug, line.size);
    offerUndo({ text: `${product.name} moved to wishlist`, line, unwish: !already });
  };
  const dec = (r: Row) => (r.line.qty <= 1 ? removeRow(r) : setQty(r.line.slug, r.line.size, r.line.qty - 1));
  const inc = (r: Row) => setQty(r.line.slug, r.line.size, Math.min(MAX_QTY, r.line.qty + 1));

  /* coupon: the shop has no active codes, so every code is honestly reported as invalid */
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const onCoupon = (e: FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    setCouponMsg(c ? `“${c}” isn't a valid code.` : "Please enter a coupon code.");
    setShaking(false);
    requestAnimationFrame(() => setShaking(!reduceMotion()));
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else void router.navigate({ to: "/" });
  };

  const empty = rows.length === 0;
  const itemsLabel = empty ? "No items yet" : `${t.count} ${t.count === 1 ? "item" : "items"} · ${money(t.net)}`;
  const savings = t.discount + (freeShip ? 80 : 0);

  /* ---------- pieces ---------- */

  const progress = (
    <section className={`ct-ship ${freeShip ? "done" : ""}`} aria-labelledby="ct-ship-h">
      {celebrate && (
        <span aria-hidden="true">
          {["#f0457a", "#ffd166", "#6d3bea", "#1fae73", "#2f7de0"].map((c, i) => (
            <span key={c} className={`ct-confetti ${i % 2 ? "dot" : ""}`} style={{ left: `${12 + i * 19}%`, background: c, animationDelay: `${(i % 3) * 0.12}s` }} />
          ))}
        </span>
      )}
      <div className="ct-ship-row">
        <span className="ct-ship-ic"><IcTruck /></span>
        <div className="ct-ship-txt">
          <b id="ct-ship-h">{freeShip ? "Free delivery unlocked!" : `Add ${money(FREE_DELIVERY - t.net)} for free delivery`}</b>
          <span>{freeShip ? "Your order ships free anywhere in Bangladesh" : `Delivery is ৳80 on orders under ${money(FREE_DELIVERY)}`}</span>
        </div>
      </div>
      <div className="ct-track" role="progressbar" aria-label="Progress to free delivery" aria-valuemin={0} aria-valuemax={FREE_DELIVERY} aria-valuenow={Math.min(t.net, FREE_DELIVERY)} aria-valuetext={`${money(Math.min(t.net, FREE_DELIVERY))} of ${money(FREE_DELIVERY)}`}>
        <div className="ct-fill" style={{ width: `${pct}%` }} />
        <span className={`ct-goal ${freeShip ? "on" : ""}`} aria-hidden="true"><IcCheck /></span>
      </div>
      <div className="ct-ship-scale" aria-hidden="true"><span>{money(0)}</span><span>Free delivery at {money(FREE_DELIVERY)}</span></div>
    </section>
  );

  const items = (
    <section className="ct-items" aria-label="Items in your cart">
      <h2 className="ct-desk-h">Items <span>({t.count})</span></h2>
      <ul>
        {rows.map(r => {
          const { line, product: p } = r;
          const onSale = p.old > p.price;
          return (
            <li key={`${line.slug}|${line.size}`} className="ct-item ct-fade">
              <Link to="/product/$slug" params={{ slug: p.slug }} className="ct-thumb" style={{ background: tintOf(p.slug) }} tabIndex={-1} aria-hidden="true">
                <img src={p.image} alt="" loading="lazy" />
              </Link>
              <div className="ct-body">
                <div className="ct-head">
                  <div className="ct-names">
                    <span className="ct-brand">{p.brand}</span>
                    <h3><Link to="/product/$slug" params={{ slug: p.slug }}>{p.name}</Link></h3>
                  </div>
                  <button type="button" className="ct-del" aria-label={`Remove ${p.name}`} onClick={() => removeRow(r)}><IcTrash /></button>
                </div>
                {line.size && <span className="ct-variant">{line.size}</span>}
                <div className="ct-foot">
                  <div className="ct-price">
                    <b>{money(p.price * line.qty)}</b>
                    {onSale && <s><span className="sr-only">Regular price </span>{money(p.old * line.qty)}</s>}
                    {line.qty > 1 && <small>{money(p.price)} each</small>}
                  </div>
                  <div className="ct-stepper" role="group" aria-label={`Quantity of ${p.name}`}>
                    <button type="button" aria-label={line.qty <= 1 ? `Remove ${p.name}` : `Decrease quantity of ${p.name}`} onClick={() => dec(r)}>{line.qty <= 1 ? <IcTrash /> : <IcMinus />}</button>
                    <output aria-live="polite">{line.qty}</output>
                    <button type="button" aria-label={`Increase quantity of ${p.name}`} disabled={line.qty >= MAX_QTY} onClick={() => inc(r)}><IcPlus /></button>
                  </div>
                </div>
                <button type="button" className="ct-later" onClick={() => saveRow(r)}>Save to wishlist</button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );

  const forgotSec = forgot.length > 0 && (
    <section className="ct-forgot" aria-labelledby="ct-forgot-h">
      <div className="ct-forgot-head">
        <h2 id="ct-forgot-h" className="ct-h2">{empty ? "Popular picks" : "Did you forget?"}</h2>
        <Link to="/trending" className="ct-seeall">See all</Link>
      </div>
      <ul className="ct-forgot-track">
        {forgot.map(p => (
          <li key={p.slug} className="ct-fcard">
            <Link to="/product/$slug" params={{ slug: p.slug }} className="ct-flink">
              <span className="ct-fimg" style={{ background: tintOf(p.slug) }}><img src={p.image} alt="" loading="lazy" /></span>
              <b>{p.name}</b>
            </Link>
            <div className="ct-ffoot">
              <span className="ct-fprice">{money(p.price)}</span>
              <button type="button" className="ct-fadd" aria-label={`Add ${p.name} to cart`} onClick={e => add(p, p.sizes[0], 1, e.currentTarget)}><IcPlus c="#fff" /></button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  const coupon = (
    <section className="ct-card ct-coupon" aria-labelledby="ct-coupon-h">
      <div className="ct-card-h"><IcTicket /><h2 id="ct-coupon-h">Coupon code</h2></div>
      <form onSubmit={onCoupon} className={`ct-coupon-row ${shaking ? "ct-shake" : ""}`} onAnimationEnd={() => setShaking(false)} noValidate>
        <label htmlFor="ct-code" className="sr-only">Coupon code</label>
        <input id="ct-code" type="text" value={code} autoComplete="off" placeholder="Enter code" aria-invalid={!!couponMsg} aria-describedby={couponMsg ? "ct-coupon-msg" : undefined}
          className={couponMsg ? "bad" : ""} onChange={e => { setCode(e.target.value); setCouponMsg(null); }} />
        <button type="submit">Apply</button>
      </form>
      <p id="ct-coupon-msg" className="ct-coupon-msg" role="status">{couponMsg ?? ""}</p>
    </section>
  );

  const summary = (
    <section className="ct-sum" aria-labelledby="ct-sum-h">
      <span className="ct-sum-blob" aria-hidden="true" />
      <h2 id="ct-sum-h">Order summary</h2>
      <dl>
        <div><dt>Items ({t.count})</dt><dd>{money(t.subtotal)}</dd></div>
        {t.discount > 0 && <div><dt>Product discounts</dt><dd className="good">− {money(t.discount)}</dd></div>}
        <div><dt>Delivery</dt><dd className={t.delivery ? "" : "good"}>{t.delivery ? money(t.delivery) : "FREE"}</dd></div>
        <div className="ct-total"><dt>Total</dt><dd>{money(t.total)}</dd></div>
      </dl>
      {savings > 0 && <div className="ct-yay ct-pop"><IcStar />You're saving {money(savings)} on this order</div>}
      <Link to="/checkout" className="ct-checkout ct-desk-only">Proceed to checkout <IcArrow /></Link>
    </section>
  );

  const payments = <p className="ct-pay"><IcLock /><span>Cash on delivery</span><span>bKash · Nagad</span><span>Cards</span></p>;

  return (
    <PageShell className="ct">
      <div className={`ct-page ${empty ? "is-empty" : ""}`}>
        {/* ---------- phone top bar ---------- */}
        <header className="ct-top">
          <button type="button" className="ct-ibtn" aria-label="Go back" onClick={goBack}><IcBack /></button>
          <div className="ct-top-title">
            <h1>My Cart</h1>
            <p aria-live="polite">{itemsLabel}</p>
          </div>
          <Link to="/wishlist" className="ct-ibtn" aria-label="Wishlist"><IcHeart /></Link>
        </header>

        <div className="ct-wrap">
          <nav aria-label="Breadcrumb" className="ct-crumbs">
            <Link to="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Cart</span>
          </nav>
          <div className="ct-desk-title">
            <h1>My Cart</h1>
            <p>{itemsLabel}</p>
          </div>

          {empty ? (
            <div className="ct-empty ct-fade">
              <Teddy />
              <h2>Your cart is feeling empty</h2>
              <p>Let's find something lovely for your little one.</p>
              <Link to="/" className="ct-start">Start shopping</Link>
              {wish.length > 0 && <Link to="/wishlist" className="ct-empty-wish"><IcHeart s={15} />You have {wish.length} {wish.length === 1 ? "item" : "items"} in your wishlist</Link>}
            </div>
          ) : (
            <div className="ct-layout">
              <div className="ct-main">
                {progress}
                {items}
                {wishItems.length > 0 && (
                  <section className="ct-saved" aria-labelledby="ct-saved-h">
                    <div className="ct-forgot-head">
                      <h2 id="ct-saved-h" className="ct-h3">From your wishlist</h2>
                      <Link to="/wishlist" className="ct-seeall">View all</Link>
                    </div>
                    <ul>
                      {wishItems.map(p => (
                        <li key={p.slug}>
                          <span className="ct-dot" aria-hidden="true" />
                          <Link to="/product/$slug" params={{ slug: p.slug }} className="ct-saved-name">{p.name}</Link>
                          <span className="ct-saved-price">{money(p.price)}</span>
                          <button type="button" aria-label={`Move ${p.name} to cart`} onClick={e => { add(p, p.sizes[0], 1, e.currentTarget); toggleWish(p.slug); }}>Move to cart</button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
              <aside className="ct-side" aria-label="Order summary and checkout">
                <div className="ct-side-in">
                  {coupon}
                  {summary}
                  {payments}
                </div>
              </aside>
            </div>
          )}

          {forgotSec}
        </div>

        {/* ---------- undo snackbar ---------- */}
        <div className="ct-snackwrap" role="status" aria-live="polite">
          {undo && (
            <div key={undo.key} className="ct-snack">
              <span>{undo.text}</span>
              <button type="button" onClick={doUndo}>Undo</button>
            </div>
          )}
        </div>

        {/* ---------- phone checkout bar / tab bar ---------- */}
        {empty ? <MobileTabBar active="cart" /> : (
          <div className="ct-bar">
            <div className="ct-bar-total">
              <span>Total</span>
              <b>{money(t.total)}</b>
              {t.delivery > 0 ? <small>incl. ৳{t.delivery} delivery</small> : <small className="good">Free delivery</small>}
            </div>
            <Link to="/checkout" className="ct-checkout ct-pulse">Checkout <IcArrow /></Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
