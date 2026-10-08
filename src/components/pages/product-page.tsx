import { brandSlug } from "@/lib/brands";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/pages/page-shell";
import { useCart, totals, FREE_DELIVERY } from "@/lib/cart-store";
import { categoryMap, slugify } from "@/lib/live-head";
import { getCategoryListing } from "@/lib/home-categories";
import { off, products, tk, type Product } from "@/lib/products";

/* ---------------- data helpers (everything derived from the real catalog) ---------------- */

const money = (n: number) => `৳ ${tk(Math.round(n))}`;

/** Age-style sizes ("0-3M", "6+ Months") -> readable labels + age-bar segments. */
const AGE_SEGMENTS = [
  { id: "nb", label: "0–3m" },
  { id: "m6", label: "3–6m" },
  { id: "m12", label: "6–12m" },
  { id: "y2", label: "1–2y" },
  { id: "y3", label: "2–3y" },
] as const;
type AgeId = (typeof AGE_SEGMENTS)[number]["id"];
const SIZE_AGES: Record<string, AgeId[]> = {
  "0-3M": ["nb"], "3-6M": ["m6"], "6-12M": ["m12"], "1-2Y": ["y2"], "2-3Y": ["y3"],
  "6+ Months": ["m12", "y2", "y3"], "12+ Months": ["y2", "y3"],
};
const SIZE_HINT: Record<string, string> = {
  "0-3M": "0–3 months", "3-6M": "3–6 months", "6-12M": "6–12 months", "1-2Y": "1–2 years", "2-3Y": "2–3 years",
  "6+ Months": "from 6 months", "12+ Months": "from 12 months",
};
const isLetterSize = (s: string) => /^(NB|XS|S|M|L|XL|XXL)$/i.test(s);

/** Best-matching category listing slug for a product category. */
function categorySlug(category: string) {
  const entries = Object.entries(categoryMap);
  return (entries.find(([, cats]) => cats.length === 1 && cats[0] === category) ?? entries.find(([, cats]) => cats.includes(category)))?.[0] ?? slugify(category);
}

/** A rough "kind" (Diapers, Wipes, Shampoo…) so suggestions don't repeat the same thing. */
const kindOf = (p: Product) => (p.type ?? p.name.split(/\s+/).slice(-1)[0] ?? p.category).toLowerCase().replace(/s$/, "");

const TINTS = ["#efe8ff", "#ffe6ef", "#fff1c4"];
const CARD_TINTS = ["#e6f2ff", "#ffeef4", "#e2f8ee", "#f1eaff", "#fff4d1", "#fff1f1"];
const tintOf = (slug: string): string => CARD_TINTS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % CARD_TINTS.length] ?? "#f1eaff";

const VIEWS = [
  { label: "Product photo", cls: "v0" },
  { label: "Close-up", cls: "v1" },
  { label: "Detail", cls: "v2" },
];
const TABS = ["Details", "Specs", "Reviews", "Questions"] as const;

/* ---------------- icons ---------------- */

const IcBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>;
const IcShare = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>;
const IcHeart = ({ on, s = 20 }: { on: boolean; s?: number }) => on
  ? <svg className="pd-pop" width={s} height={s} viewBox="0 0 24 24" fill="#f0457a" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" /></svg>
  : <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" /></svg>;
const IcZoom = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" /></svg>;
const IcRuler = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" /></svg>;
const IcCart = ({ s = 21 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.3" fill="#fff" /><circle cx="17" cy="19.5" r="1.3" fill="#fff" /></svg>;
const IcMinus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>;
const IcPlus = ({ c = "currentColor" }: { c?: string }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
const IcCheck = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>;
const IcClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
const IcStar = ({ className, s = 18 }: { className?: string; s?: number }) => <svg className={className} width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="url(#hdYellow)" /></svg>;
const IcTruck = () => <svg className="pd-float-sm" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" fill="url(#hdPurple)" /><circle cx="6" cy="18" r="2" fill="#2a1650" /><circle cx="17" cy="18" r="2" fill="#2a1650" /></svg>;
const Teddy = ({ w = 64, className }: { w?: number; className?: string }) => (
  <svg className={className} width={w} height={w * 56 / 60} viewBox="0 0 60 56" aria-hidden="true">
    <circle cx="16" cy="14" r="9" fill="url(#hdBrown)" /><circle cx="44" cy="14" r="9" fill="url(#hdBrown)" /><circle cx="30" cy="30" r="22" fill="url(#hdBrown)" />
    <ellipse cx="30" cy="38" rx="10" ry="7" fill="#f6dcc0" /><circle cx="22" cy="27" r="2.6" fill="#2b1d18" /><circle cx="38" cy="27" r="2.6" fill="#2b1d18" />
    <path d="M26 40q4 3 8 0" stroke="#2b1d18" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

function Stars({ rating }: { rating: number }) {
  return (
    <span className="pd-stars" aria-hidden="true">
      <span>★★★★★</span>
      <span className="pd-stars-on" style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
    </span>
  );
}

/** /categories/baby-clothing is a static route; link to it directly to avoid a route-match clash. */
function CatLink({ cat, children, ...rest }: { cat: string; children: ReactNode; className?: string | undefined; "aria-label"?: string | undefined }) {
  return cat === "baby-clothing"
    ? <Link to="/categories/baby-clothing" {...rest}>{children}</Link>
    : <Link to="/categories/$cat" params={{ cat }} {...rest}>{children}</Link>;
}

/* ---------------- page ---------------- */

export function ProductPage({ product: x }: { product: Product }) {
  const { lines, wish, add, toggleWish } = useCart();
  const [view, setView] = useState(0);
  const [size, setSize] = useState(x.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [added, setAdded] = useState(false);
  const [dialog, setDialog] = useState<null | "zoom" | "size">(null);
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);

  const wished = wish.includes(x.slug);
  const pct = off(x);
  const save = x.old - x.price;
  const cartCount = lines.reduce((n, l) => n + l.qty, 0);
  const catSlug = categorySlug(x.category);
  const catName = getCategoryListing(catSlug).name;
  const subIsCode = /^code\s/i.test(x.sub);
  const sku = x.sub.match(/Code\s+(\w+)/i)?.[1] ?? `BC-${String(products.findIndex(p => p.slug === x.slug) + 1).padStart(5, "0")}`;
  const optionWord = x.sizes.every(s => isLetterSize(s) || s in SIZE_HINT) ? "Size" : "Option";
  const hasAges = x.sizes.some(s => s in SIZE_AGES);
  const selectedAges = SIZE_AGES[size] ?? [];

  /* suggestions */
  const goesWith = useMemo(() => {
    const k = kindOf(x);
    const seen = new Set([k]);
    const pool = [
      ...products.filter(p => p.category === x.category),
      ...products.filter(p => p.brand === x.brand && p.category !== x.category),
      ...products.filter(p => p.category !== x.category && p.brand !== x.brand).sort((a, b) => b.reviews - a.reviews),
    ].filter(p => p.slug !== x.slug);
    const out: Product[] = [];
    for (const p of pool) {
      const pk = kindOf(p);
      if (seen.has(pk)) continue;
      seen.add(pk); out.push(p);
      if (out.length === 2) break;
    }
    return out;
  }, [x]);
  const alsoLike = useMemo(() => products
    .filter(p => p.slug !== x.slug && (p.category === x.category || p.brand === x.brand))
    .sort((a, b) => Number(b.category === x.category) - Number(a.category === x.category) || b.reviews - a.reviews)
    .slice(0, 8), [x]);
  const [fbtOn, setFbtOn] = useState<Record<string, boolean>>(() => Object.fromEntries(goesWith.map(p => [p.slug, true])));
  const fbtPicked = goesWith.filter(p => fbtOn[p.slug]);
  const fbtCount = 1 + fbtPicked.length;
  const fbtTotal = x.price + fbtPicked.reduce((n, p) => n + p.price, 0);

  /* free-delivery progress, from the real cart */
  const net = totals(lines).net;
  const after = net + x.price * qty;
  const deliveryNote: ReactNode = net >= FREE_DELIVERY
    ? <>Your cart already has <b>free delivery</b></>
    : after >= FREE_DELIVERY
      ? <>Adding this unlocks <b>free delivery</b> on your order</>
      : <>Add <b>{money(FREE_DELIVERY - after)}</b> more after this for free delivery</>;

  /* toast */
  const toastTimer = useRef<number | undefined>(undefined);
  const showToast = (text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(t => ({ text, key: (t?.key ?? 0) + 1 }));
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  };
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* dialogs: escape, scroll lock, focus */
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openDialog = (d: "zoom" | "size") => (e: { currentTarget: HTMLElement }) => { opener.current = e.currentTarget; setDialog(d); };
  useEffect(() => {
    if (!dialog) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDialog(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); opener.current?.focus(); };
  }, [dialog]);

  /* actions */
  const onWish = () => { toggleWish(x.slug); showToast(wished ? "Removed from wishlist" : "Saved to your wishlist"); };
  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: x.name, url }); return; }
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch { /* user cancelled */ }
  };
  const addToCart = (el: HTMLElement) => {
    add(x, size, qty, el);
    setAdded(true);
    showToast(`Added to cart · ${optionWord} ${size}`);
  };
  const addAll = (el: HTMLElement) => {
    add(x, size, 1, el);
    for (const p of fbtPicked) add(p, p.sizes[0], 1);
    setAdded(true);
    showToast(`${fbtCount} ${fbtCount === 1 ? "item" : "items"} added to cart`);
  };
  const pickSize = (s: string) => setSize(s);
  const onRadioKeys = (list: string[], cur: string, set: (s: string) => void) => (e: ReactKeyboardEvent<HTMLElement>) => {
    const i = list.indexOf(cur);
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const v = list[(next + list.length) % list.length];
    if (v === undefined) return;
    set(v);
    (e.currentTarget.querySelector(`[data-v="${CSS.escape(v)}"]`) as HTMLElement | null)?.focus();
  };
  const onTabKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (tab + d + TABS.length) % TABS.length;
    setTab(n);
    (e.currentTarget.querySelectorAll<HTMLElement>("[role=tab]")[n])?.focus();
  };
  const goReviews = () => {
    setTab(2);
    document.getElementById("pd-infotabs")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const stepper = (cls: string) => (
    <div className={`pd-stepper ${cls}`} role="group" aria-label="Quantity">
      <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}><IcMinus /></button>
      <output aria-live="polite">{qty}</output>
      <button type="button" aria-label="Increase quantity" disabled={qty >= 10} onClick={() => setQty(q => Math.min(10, q + 1))}><IcPlus /></button>
    </div>
  );
  const buyNow = (cls: string) => (
    <Link to="/checkout" className={`pd-buynow ${cls}`} onClick={() => add(x, size, qty)}>Buy now</Link>
  );
  const ctaLabel = added ? "Add more" : "Add to cart";

  return (
    <PageShell className="pd">
      <div className="pd-page">
        <div className="pd-wrap">
          <nav aria-label="Breadcrumb" className="pd-crumbs">
            <Link to="/">Home</Link><span aria-hidden="true">›</span>
            <CatLink cat={catSlug}>{catName}</CatLink><span aria-hidden="true">›</span>
            <span aria-current="page">{x.name}</span>
          </nav>

          <div className="pd-layout">
            {/* ---------- gallery ---------- */}
            <section aria-label="Product photos" className="pd-gallery" style={{ background: TINTS[view] }}>
              <span className="pd-blob a" aria-hidden="true" />
              <span className="pd-blob b" aria-hidden="true" />
              <IcStar className="pd-float-sm pd-deco-star" s={26} />
              <svg className="pd-float pd-deco-dot" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff" opacity="0.8" /></svg>

              <div className="pd-stage">
                <button type="button" className="pd-stage-btn" aria-label={`Zoom: ${x.name}`} onClick={openDialog("zoom")}>
                  <span key={view} className={`pd-photo pd-fade ${VIEWS[view]?.cls ?? "v0"}`} style={{ background: TINTS[view] }}>
                    <img src={x.image} alt={`${x.name}, ${VIEWS[view]?.label.toLowerCase() ?? "photo"}`} className="pd-float" />
                  </span>
                </button>
              </div>

              <div className="pd-ctrls">
                <CatLink cat={catSlug} aria-label={`Back to ${catName}`} className="pd-ibtn pd-backbtn"><IcBack /></CatLink>
                <span className="pd-sp" />
                <button type="button" className="pd-ibtn" aria-label="Share product" onClick={onShare}><IcShare /></button>
                <button type="button" className="pd-ibtn" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished} onClick={onWish}><IcHeart on={wished} /></button>
              </div>

              <button type="button" className="pd-zoompill" onClick={openDialog("zoom")}><IcZoom />Zoom</button>
              <span className="pd-counter" aria-hidden="true">{view + 1} / {VIEWS.length}</span>

              <div className="pd-thumbrow" role="group" aria-label="Choose photo">
                {VIEWS.map((v, i) => (
                  <button key={v.label} type="button" aria-label={v.label} aria-pressed={view === i} className={`pd-thumb ${view === i ? "on" : ""}`} onClick={() => setView(i)}>
                    <span className={`pd-photo ${v.cls}`}><img src={x.image} alt="" /></span>
                  </button>
                ))}
              </div>
            </section>

            {/* ---------- info ---------- */}
            <div className="pd-details">
              <section className="pd-title">
                <div className="pd-chips">
                  <Link to="/brands/$brand" params={{ brand: brandSlug(x.brand) }} className="pd-brandlink">{x.brand}</Link>
                  {!subIsCode && x.sub && <span className="pd-chip mint">{x.sub}</span>}
                  {x.badge && <span className="pd-chip green">{x.badge}</span>}
                </div>
                <h1>{x.name}</h1>
                <div className="pd-rate">
                  <Stars rating={x.rating} />
                  <a href="#pd-infotabs" onClick={e => { e.preventDefault(); goReviews(); }}>{x.rating.toFixed(1)} · {tk(x.reviews)} reviews</a>
                </div>
                <div className="pd-pricerow">
                  <div>
                    <div className="pd-prices">
                      <span className="pd-amount">{money(x.price)}</span>
                      {x.old > x.price && <s><span className="sr-only">Regular price </span>{money(x.old)}</s>}
                    </div>
                    <div className="pd-per">{pct > 0 ? `${pct}% off · ` : ""}SKU {sku}</div>
                  </div>
                  {save > 0 && <span className="pd-save pd-pop">You save {money(save)}</span>}
                </div>
                <div className="pd-note"><IcStar className="pd-float-sm" />
                  <span>{deliveryNote}</span>
                </div>
              </section>

              {/* size */}
              <section className="pd-sec" aria-labelledby="pd-size-h">
                <div className="pd-sec-row">
                  <h2 id="pd-size-h" className="pd-h">{optionWord}: <span>{size}{SIZE_HINT[size] ? ` · ${SIZE_HINT[size]}` : ""}</span></h2>
                  {x.sizes.length > 1 && <button type="button" className="pd-linkbtn" onClick={openDialog("size")} aria-haspopup="dialog"><IcRuler />Size guide</button>}
                </div>
                <div role="radiogroup" aria-labelledby="pd-size-h" className={`pd-sizegrid n${Math.min(x.sizes.length, 5)}`} onKeyDown={onRadioKeys(x.sizes, size, pickSize)}>
                  {x.sizes.map(s => {
                    const on = s === size;
                    return (
                      <button key={s} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} data-v={s} className={`pd-size ${on ? "on" : ""} ${s.length > 4 ? "long" : ""}`} onClick={() => pickSize(s)}>
                        <b>{s}</b>
                        {SIZE_HINT[s] && <span>{SIZE_HINT[s]}</span>}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* buy box: desktop has full controls, phone uses the sticky bar + this Buy now */}
              <section className="pd-buybox" aria-label="Buy">
                {stepper("pd-desk-only")}
                <button type="button" className={`pd-cta pd-desk-only ${added ? "done" : ""}`} onClick={e => addToCart(e.currentTarget)}>
                  <b>{ctaLabel}</b><span>{money(x.price * qty)}</span>
                </button>
                {buyNow("")}
              </section>

              {/* delivery */}
              <section className="pd-card pd-delivery" aria-label="Delivery and returns">
                <div className="pd-del-row">
                  <span className="pd-del-ic"><IcTruck /></span>
                  <div>
                    <b>Home delivery across Bangladesh</b>
                    <span>৳80 delivery · free on orders over {money(FREE_DELIVERY)}</span>
                  </div>
                </div>
                <div className="pd-del-grid">
                  <div><b>Cash on delivery</b><span>Available</span></div>
                  <div><b>Easy returns</b><span>Unopened, 7 days</span></div>
                  <Link to="/support"><b>Need help?</b><span>Ask support</span></Link>
                </div>
              </section>

              {/* ages */}
              {hasAges && (
                <section className="pd-sec" aria-labelledby="pd-age-h">
                  <h2 id="pd-age-h" className="pd-h">Right for these ages</h2>
                  <ul className="pd-agebar">
                    {AGE_SEGMENTS.map(a => {
                      const on = selectedAges.includes(a.id);
                      return <li key={a.id} className={on ? "on" : ""}><span aria-hidden="true" /><span>{a.label}<span className="sr-only">{on ? " (fits selected size)" : ""}</span></span></li>;
                    })}
                  </ul>
                </section>
              )}

              {/* highlights (facts from the catalog) */}
              <section className="pd-sec" aria-label="At a glance">
                <div className="pd-hl">
                  <Link to="/brands/$brand" params={{ brand: brandSlug(x.brand) }} className="pd-hl-i mint">
                    <svg className="pd-float-sm" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C6 17 4 12 5 5c4 0 7 2 7 6 0-4 3-6 7-6 1 7-1 12-7 16z" fill="url(#hdMint)" /></svg>
                    <span><small>Brand</small>{x.brand}</span>
                  </Link>
                  <CatLink cat={catSlug} className="pd-hl-i blue">
                    <svg className="pd-float-sm" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2.5" fill="url(#hdBlue)" /><rect x="13" y="3" width="8" height="8" rx="2.5" fill="url(#hdPurple)" /><rect x="3" y="13" width="8" height="8" rx="2.5" fill="url(#hdYellow)" /><rect x="13" y="13" width="8" height="8" rx="2.5" fill="url(#hdPink)" /></svg>
                    <span><small>Category</small>{x.category}</span>
                  </CatLink>
                  <div className="pd-hl-i purple">
                    <IcStar className="pd-float-sm" s={30} />
                    <span><small>Rated</small>{x.rating.toFixed(1)} / 5</span>
                  </div>
                  <div className="pd-hl-i pink">
                    <svg className="pd-float-sm" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" fill="url(#hdPink)" /></svg>
                    <span><small>{x.sizes.length > 1 ? "Options" : optionWord}</small>{x.sizes.length > 1 ? `${x.sizes.length} to choose` : x.sizes[0]}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="pd-more">
            {/* ---------- tabs ---------- */}
            <section id="pd-infotabs" className="pd-infotabs" aria-label="Product information">
              <div role="tablist" aria-label="Product information" className="pd-tablist" onKeyDown={onTabKeys}>
                {TABS.map((t, i) => (
                  <button key={t} type="button" role="tab" id={`pd-tab-${i}`} aria-selected={tab === i} aria-controls={`pd-panel-${i}`} tabIndex={tab === i ? 0 : -1} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>
                ))}
              </div>
              <div role="tabpanel" id={`pd-panel-${tab}`} aria-labelledby={`pd-tab-${tab}`} tabIndex={0} key={tab} className="pd-panel pd-fade">
                {tab === 0 && (
                  <>
                    <p><b>{x.name}</b>{x.sub && !subIsCode ? ` — ${x.sub}.` : "."} Choose the {optionWord.toLowerCase()} that suits your little one. Please check the product packaging for full care instructions, ingredients and age guidance.</p>
                    <ul>
                      <li>Brand: {x.brand}</li>
                      <li>Available {x.sizes.length > 1 ? `${optionWord.toLowerCase()}s` : optionWord.toLowerCase()}: {x.sizes.join(", ")}</li>
                      {x.type && <li>Type: {x.type}</li>}
                    </ul>
                  </>
                )}
                {tab === 1 && (
                  <dl className="pd-specs">
                    <dt>Brand</dt><dd>{x.brand}</dd>
                    <dt>Category</dt><dd>{x.category}</dd>
                    {x.type && <><dt>Type</dt><dd>{x.type}</dd></>}
                    <dt>SKU</dt><dd>{sku}</dd>
                    <dt>{optionWord}s</dt><dd>{x.sizes.join(", ")}</dd>
                    <dt>Selected</dt><dd>{size}</dd>
                  </dl>
                )}
                {tab === 2 && (
                  <div className="pd-reviews">
                    <div className="pd-rv-score">
                      <b>{x.rating.toFixed(1)}</b>
                      <div><Stars rating={x.rating} /><span>{tk(x.reviews)} ratings</span></div>
                    </div>
                    <Teddy className="pd-float" />
                    <b className="pd-rv-ph">[Customer reviews appear here]</b>
                    <span>Written reviews aren't available yet.</span>
                  </div>
                )}
                {tab === 3 && (
                  <div className="pd-qa">
                    <p>Have a question about {x.name}? Our support team can help with sizes, ingredients and delivery.</p>
                    <Link to="/support" className="pd-darkbtn">Ask support</Link>
                  </div>
                )}
              </div>
            </section>

            {/* ---------- goes well with ---------- */}
            {goesWith.length > 0 && (
              <section className="pd-card pd-fbt" aria-labelledby="pd-fbt-h">
                <h2 id="pd-fbt-h" className="pd-h2">Goes well with</h2>
                <div className="pd-fbt-art" aria-hidden="true">
                  {[x, ...goesWith].map((p, i) => (
                    <span key={p.slug} className="pd-fbt-cell">
                      {i > 0 && <span className="pd-fbt-plus">+</span>}
                      <span className="pd-fbt-img" style={{ background: tintOf(p.slug), opacity: i === 0 || fbtOn[p.slug] ? 1 : 0.4 }}><img src={p.image} alt="" loading="lazy" /></span>
                    </span>
                  ))}
                </div>
                <div className="pd-fbt-list">
                  <div className="pd-fbt-row locked">
                    <span className="pd-box on locked" aria-hidden="true"><IcCheck /></span>
                    <span className="pd-fbt-name">This item: {x.name} · {size}</span>
                    <b>{money(x.price)}</b>
                  </div>
                  {goesWith.map(p => {
                    const on = !!fbtOn[p.slug];
                    return (
                      <div key={p.slug} className="pd-fbt-row">
                        <button type="button" role="checkbox" aria-checked={on} aria-label={`Include ${p.name}`} className={`pd-box ${on ? "on" : ""}`} onClick={() => setFbtOn(o => ({ ...o, [p.slug]: !o[p.slug] }))}>{on && <IcCheck />}</button>
                        <Link to="/product/$slug" params={{ slug: p.slug }} className="pd-fbt-name">{p.name}{p.sizes[0] ? ` · ${p.sizes[0]}` : ""}</Link>
                        <b>{money(p.price)}</b>
                      </div>
                    );
                  })}
                </div>
                <div className="pd-fbt-foot">
                  <div><span>Total for {fbtCount} {fbtCount === 1 ? "item" : "items"}</span><b>{money(fbtTotal)}</b></div>
                  <button type="button" className="pd-darkbtn" onClick={e => addAll(e.currentTarget)}>{fbtCount === 1 ? "Add 1 item" : `Add all ${fbtCount}`}</button>
                </div>
              </section>
            )}
          </div>

          {/* ---------- also like ---------- */}
          {alsoLike.length > 0 && (
            <section className="pd-also" aria-labelledby="pd-also-h">
              <div className="pd-also-head">
                <h2 id="pd-also-h" className="pd-h2">You may also like</h2>
                <CatLink cat={catSlug} className="pd-seeall">See all</CatLink>
              </div>
              <ul className="pd-also-track">
                {alsoLike.map(p => (
                  <li key={p.slug} className="pd-also-card">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="pd-also-link">
                      <span className="pd-also-img" style={{ background: tintOf(p.slug) }}><img src={p.image} alt="" loading="lazy" /></span>
                      <b>{p.name}</b>
                    </Link>
                    <div className="pd-also-foot">
                      <span className="pd-also-price">{money(p.price)}</span>
                      <button type="button" className="pd-also-add" aria-label={`Add ${p.name} to cart`} onClick={e => { add(p, p.sizes[0], 1, e.currentTarget); showToast(`Added ${p.name}`); }}><IcPlus c="#fff" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ---------- toast ---------- */}
        <div className="pd-toastwrap" role="status" aria-live="polite">
          {toast && (
            <div key={toast.key} className="pd-toast">
              <span className="pd-toast-ic"><IcCheck /></span>
              <span>{toast.text}</span>
            </div>
          )}
        </div>

        {/* ---------- phone sticky buy bar ---------- */}
        <div className="pd-bar" aria-label="Add to cart">
          {stepper("")}
          <button type="button" className={`pd-cta ${added ? "done" : "pd-pulse"}`} onClick={e => addToCart(e.currentTarget)}>
            <b>{ctaLabel}</b><span>{money(x.price * qty)}</span>
          </button>
          <Link to="/cart" aria-label={`Cart, ${cartCount} items`} className="pd-cartbtn">
            <IcCart />
            {cartCount > 0 && <span key={cartCount} className="pd-badge pd-pop">{cartCount}</span>}
          </Link>
        </div>

        {/* ---------- dialogs ---------- */}
        {dialog === "size" && (
          <div className="pd-sheetwrap">
            <button type="button" aria-label="Close size guide" className="pd-scrim" tabIndex={-1} onClick={() => setDialog(null)} />
            <div role="dialog" aria-modal="true" aria-labelledby="pd-guide-h" className="pd-sheet" ref={dialogRef} tabIndex={-1}>
              <div className="pd-grab" aria-hidden="true" />
              <div className="pd-sheet-head">
                <h2 id="pd-guide-h" className="pd-h2">Size guide</h2>
                <button type="button" className="pd-x" aria-label="Close" onClick={() => setDialog(null)}><IcClose /></button>
              </div>
              <p className="pd-sheet-sub">{x.name} comes in {x.sizes.length} {optionWord.toLowerCase()}s. For exact fit, weight or age guidance, check the chart on the product packaging.</p>
              <div role="radiogroup" aria-label={`Choose ${optionWord.toLowerCase()}`} className={`pd-sizegrid n${Math.min(x.sizes.length, 5)}`} onKeyDown={onRadioKeys(x.sizes, size, pickSize)}>
                {x.sizes.map(s => {
                  const on = s === size;
                  return (
                    <button key={s} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} data-v={s} className={`pd-size ${on ? "on" : ""} ${s.length > 4 ? "long" : ""}`} onClick={() => pickSize(s)}>
                      <b>{s}</b>{SIZE_HINT[s] && <span>{SIZE_HINT[s]}</span>}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="pd-bigbtn" onClick={() => { setDialog(null); showToast(`${optionWord} ${size} selected`); }}>Choose {optionWord.toLowerCase()} {size}</button>
            </div>
          </div>
        )}
        {dialog === "zoom" && (
          <div className="pd-sheetwrap pd-zoomwrap">
            <button type="button" aria-label="Close photo" className="pd-scrim" tabIndex={-1} onClick={() => setDialog(null)} />
            <div role="dialog" aria-modal="true" aria-label={`${x.name} photo`} className="pd-zoom" ref={dialogRef} tabIndex={-1}>
              <button type="button" className="pd-x" aria-label="Close" onClick={() => setDialog(null)}><IcClose /></button>
              <img src={x.image} alt={x.name} />
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
