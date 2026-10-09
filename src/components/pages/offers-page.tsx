import { useState, type MouseEvent, type CSSProperties, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { PageShell, MobileTabBar } from "./page-shell";
import { products, off, tk, getProduct, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

/* /offers — 1:1 translation of public/design-ref/offers-{phone,desktop}.html, wired to the catalogue. */

const deals = products.filter(p => p.old > p.price);
const saved = (p: Product) => p.old - p.price;
const ratio = (p: Product) => (p.old - p.price) / p.old;
const maxOff = Math.max(...deals.map(off));
const biggestSave = [...deals].sort((a, b) => saved(b) - saved(a))[0]!;
const spotlight = [...deals].sort((a, b) => off(b) - off(a))[0]!;

const SHORT: Record<string, string> = {
  "winter-romper-panda": "Baby Winter Romper (Panda)",
  "aveeno-baby-shampoo": "Aveeno Baby Shampoo",
  "himalaya-baby-shampoo": "Himalaya Baby Shampoo",
  "carters-girl-bodysuit-set": "Baby Girl 3-Pack Bodysuit Set",
  "carters-boy-bodysuit-pack": "Baby Boy Bodysuit Pack (3 pcs)",
  "aptamil-advance-follow-on-milk": "Aptamil Advance Follow On Milk",
};
const nameOf = (p: Product) => SHORT[p.slug] ?? p.name;

const TINT: Record<string, string> = {
  "nestle-cerelac-wheat-apple": "#fff0e4", "winter-romper-panda": "#f1eaff", "johnsons-baby-oil": "#fff4d1", "pampers-new-baby-diapers": "#e9f2ff",
  "aveeno-baby-shampoo": "#e2f8ee", "johnsons-baby-wipes": "#e2f8ee", "huggies-baby-wipes": "#fff4d1", "baby-rattle-set": "#ffeef4",
  "baby-nail-care-set": "#e6f2ff", "digital-baby-thermometer": "#e2f8ee", "stacking-rings-toy": "#fff4d1", "himalaya-baby-shampoo": "#e2f8ee",
  "baby-feeding-set": "#fff0e4", "philips-avent-bottle-set": "#e6f2ff", "carters-girl-bodysuit-set": "#ffeef4", "baby-clothing-set": "#e6f2ff",
  "johnsons-baby-care-gift-set": "#ffe6ef", "carters-boy-bodysuit-pack": "#e9f2ff", "baby-stroller": "#e2f8ee", "electric-breast-pump": "#f1eaff",
  "baby-high-chair": "#fff4d1", "baby-activity-walker": "#ffeef4", "aptamil-advance-follow-on-milk": "#fff4d1",
};
const ROTATE = ["#e9f2ff", "#fff4d1", "#ffeef4", "#e2f8ee", "#f1eaff"];
const tintOf = (p: Product) => TINT[p.slug] ?? ROTATE[products.indexOf(p) % ROTATE.length]!;

const bySlugs = (s: string[]) => s.map(x => deals.find(p => p.slug === x)!).filter(Boolean);
/** Pinned first-8 (approved order) + a rule for the rest. */
function build(pinned: string[], pool: Product[], rest: (a: Product, b: Product) => number) {
  const head = bySlugs(pinned);
  const tail = pool.filter(p => !pinned.includes(p.slug)).map((p, i) => ({ p, i })).sort((a, b) => rest(a.p, b.p) || a.i - b.i).map(x => x.p);
  return [...head, ...tail];
}
type TabId = "all" | "under" | "sets" | "big";
const TABS: { id: TabId; label: string; caption: string; items: Product[] }[] = [
  { id: "all", label: "All deals", caption: "Sorted by biggest discount",
    items: build(["nestle-cerelac-wheat-apple", "winter-romper-panda", "johnsons-baby-oil", "pampers-new-baby-diapers", "aveeno-baby-shampoo", "johnsons-baby-wipes", "huggies-baby-wipes", "baby-rattle-set"], deals, (a, b) => ratio(b) - ratio(a)) },
  { id: "under", label: "Under ৳500", caption: "Everyday essentials under ৳500",
    items: build(["nestle-cerelac-wheat-apple", "johnsons-baby-wipes", "huggies-baby-wipes", "baby-rattle-set", "baby-nail-care-set", "digital-baby-thermometer", "stacking-rings-toy", "himalaya-baby-shampoo"], deals.filter(p => p.price < 500), (a, b) => ratio(b) - ratio(a)) },
  { id: "sets", label: "Sets & packs", caption: "Gift sets and multi-packs",
    items: build(["baby-rattle-set", "baby-nail-care-set", "baby-feeding-set", "philips-avent-bottle-set", "carters-girl-bodysuit-set", "baby-clothing-set", "johnsons-baby-care-gift-set", "carters-boy-bodysuit-pack"], bySlugs(["girl-pajama-set"]), () => 0) },
  { id: "big", label: "Save ৳400+", caption: "Sorted by taka saved",
    items: build(["baby-stroller", "electric-breast-pump", "baby-high-chair", "philips-avent-bottle-set", "winter-romper-panda", "baby-activity-walker", "pampers-new-baby-diapers", "aptamil-advance-follow-on-milk"], deals.filter(p => saved(p) >= 400), (a, b) => saved(b) - saved(a)) },
];
if (import.meta.env.DEV) {
  const got = TABS.map(t => t.items.length).join("/");
  if (got !== "49/8/9/11") console.warn(`[offers] tab counts ${got}, expected 49/8/9/11`);
}

const CATS = [
  { label: "Feeding", cat: "Feeding", slug: "feeding-and-nursing", img: "baby-feeding-set", bg: "#fff3d1", ink: "#b06d00" },
  { label: "Bath & skin", cat: "Bath & Skin", slug: "bath-and-hygiene", img: "baby-hooded-towel", bg: "#e3f4ff", ink: "#2f5bd3" },
  { label: "Clothing", cat: "Clothing", slug: "baby-clothing", img: "baby-clothing-set", bg: "#ffe6ef", ink: "#c21e55" },
  { label: "Diapers & wipes", cat: "Diapers", slug: "diapers-and-wipes", img: "pampers-new-baby-diapers", bg: "#e9f2ff", ink: "#2f5bd3" },
  { label: "Health", cat: "Health", slug: "health-and-safety", img: "digital-baby-thermometer", bg: "#e2f8ee", ink: "#136b40" },
  { label: "Toys", cat: "Toys", slug: "toys-and-learning", img: "baby-rattle-set", bg: "#ffeef4", ink: "#c21e55" },
  { label: "Baby gear", cat: "Baby Care", slug: "strollers-and-prams", img: "baby-stroller", bg: "#efe8ff", ink: "#4c22b8" },
].map(c => { const items = deals.filter(p => p.category === c.cat); return { ...c, n: items.length, max: Math.max(0, ...items.map(off)), image: getProduct(c.img)?.image ?? "" }; });
const feature = [...CATS].sort((a, b) => b.max - a.max)[0]!;
const others = CATS.filter(c => c !== feature);

const img = (slug: string) => getProduct(slug)!;
const price = (n: number) => `৳ ${tk(n)}`;

function Plus({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}
function PLink({ p, className, style, children }: { p: Product; className?: string; style?: CSSProperties; children: ReactNode }) {
  return <Link to="/product/$slug" params={{ slug: p.slug }} className={className} style={style}>{children}</Link>;
}
function CatLink({ c, className, style, children }: { c: (typeof CATS)[number]; className: string; style?: CSSProperties; children: ReactNode }) {
  return c.slug === "baby-clothing"
    ? <Link to="/categories/baby-clothing" className={className} style={style}>{children}</Link>
    : <Link to="/categories/$cat" params={{ cat: c.slug }} className={className} style={style}>{children}</Link>;
}
function Float({ p, cls }: { p: Product; cls: string }) {
  return <PLink p={p} className={`ofr-float ${cls}`}><img src={p.image} alt="" /></PLink>;
}

export function OffersPage() {
  const [tabId, setTabId] = useState<TabId>("all");
  const [all, setAll] = useState(false);
  const { lines, add } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const router = useRouter();
  const tab = TABS.find(t => t.id === tabId)!;
  const items = all ? tab.items : tab.items.slice(0, 8);
  const pick = (id: TabId) => { setTabId(id); setAll(false); };
  const onAdd = (p: Product) => (e: MouseEvent<HTMLButtonElement>) => add(p, p.sizes[0], 1, e.currentTarget);
  const back = () => { if (window.history.length > 1) router.history.back(); else router.navigate({ to: "/" }); };
  const toDeals = () => document.getElementById("ofr-deals-dk")?.scrollIntoView({ behavior: "smooth" });
  const more = tab.items.length > 8;
  const moreLabel = more ? (all ? "Show top 8" : `Show more deals · 8 of ${tab.items.length}`) : `Showing all ${tab.items.length} deals`;
  const sub = spotlight.slug === "nestle-cerelac-wheat-apple" ? "First foods" : spotlight.sub;

  const tabs = (dk: boolean) => <div role="tablist" aria-label="Deal type" className={dk ? "ofr-dk-tabs" : "ofr-ph-tabs"}>
    {TABS.map(t => <button key={t.id} type="button" role="tab" aria-selected={tabId === t.id} className={`ofr-tab${tabId === t.id ? " ofr-on" : ""}`} onClick={() => pick(t.id)}>{t.label} <span>{t.items.length}</span></button>)}
  </div>;
  const moreBtn = <button type="button" className={`ofr-more${more ? "" : " ofr-more-off"}`} disabled={!more} onClick={() => setAll(a => !a)}>{moreLabel}</button>;

  return <PageShell className="ofr-page">
    {/* ---------- PHONE ---------- */}
    <div className="ofr-ph">
      <header className="ofr-ph-top">
        <button type="button" className="ofr-ib" aria-label="Back" onClick={back}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg></button>
        <div className="ofr-ph-title"><h1 className="ofr-bl">Offers</h1><p>{deals.length} products on sale right now</p></div>
        <Link to="/search" className="ofr-ib" aria-label="Search"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
        <Link to="/cart" className="ofr-ib ofr-cart" aria-label={`Cart, ${count} items`} data-cart-target="">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></svg>
          {count > 0 && <span className="ofr-badge">{count}</span>}
        </Link>
      </header>
      <div className="ofr-ph-body">
        <section className="ofr-ph-hero">
          <span className="ofr-blob" />
          <div className="ofr-ph-hero-copy">
            <span className="ofr-pill">EVERYDAY SAVINGS</span>
            <h2 className="ofr-bl">Save up to {maxOff}% on baby favourites</h2>
            <p>Biggest single saving: ৳{tk(saved(biggestSave))} on the {nameOf(biggestSave)}.</p>
            <a href="#deals" className="ofr-dark-btn">See all deals →</a>
          </div>
          <div className="ofr-ph-floats">
            <Float p={img("nestle-cerelac-wheat-apple")} cls="ofr-f1" />
            <Float p={img("winter-romper-panda")} cls="ofr-f2" />
            <Float p={img("johnsons-baby-oil")} cls="ofr-f3" />
          </div>
        </section>
        <section className="ofr-ph-spot">
          <span className="ofr-blob" />
          <PLink p={spotlight} className="ofr-spot-art"><img src={spotlight.image} alt={spotlight.name} /></PLink>
          <div className="ofr-ph-spot-copy">
            <span className="ofr-eb ofr-gold">BIGGEST DISCOUNT RIGHT NOW</span>
            <h3><PLink p={spotlight}>{nameOf(spotlight)}</PLink></h3>
            <div className="ofr-spot-price"><b className="ofr-bl">{price(spotlight.price)}</b><s>{price(spotlight.old)}</s><span>-{off(spotlight)}%</span></div>
          </div>
          <button type="button" className="ofr-add ofr-rel" aria-label={`Add ${spotlight.name} to cart`} onClick={onAdd(spotlight)}><Plus size={18} /></button>
        </section>
        <section id="deals">
          {tabs(false)}
          <p className="ofr-caption">{tab.caption}</p>
          <div className="ofr-ph-grid">
            {items.map(p => <article key={p.slug} className="ofr-pc">
              <PLink p={p} className="ofr-pc-art" style={{ background: tintOf(p) }}><img src={p.image} alt={nameOf(p)} /><span className="ofr-off">-{off(p)}%</span></PLink>
              <span className="ofr-save">Save {price(saved(p))}</span>
              <h3><PLink p={p}>{nameOf(p)}</PLink></h3>
              <div className="ofr-pc-foot">
                <div><b className="ofr-bl">{price(p.price)}</b><s>{price(p.old)}</s></div>
                <button type="button" className="ofr-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={16} /></button>
              </div>
            </article>)}
          </div>
          {moreBtn}
        </section>
        <section>
          <span className="ofr-eb ofr-amber">EVERY PRODUCT COUNTED ONCE</span>
          <h2 className="ofr-bl ofr-ph-h2">Deals by category</h2>
          <CatLink c={feature} className="ofr-tile ofr-ph-feature" style={{ background: feature.bg }}>
            <span className="ofr-eb" style={{ color: feature.ink }}>TOP DISCOUNT</span>
            <b className="ofr-bl">{feature.label}</b>
            <small>{feature.n} deals · up to {feature.max}% off</small>
            <img src={feature.image} alt="" />
          </CatLink>
          <div className="ofr-ph-tiles">
            {others.map(c => <CatLink key={c.slug} c={c} className="ofr-tile" style={{ background: c.bg }}>
              <b>{c.label}</b><small>{c.n} deals</small><small className="ofr-upto" style={{ color: c.ink }}>up to {c.max}%</small>
              <img src={c.image} alt="" />
            </CatLink>)}
          </div>
        </section>
        <section className="ofr-ph-strip">
          <span className="ofr-truck"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg></span>
          <span><b>Free delivery over ৳3,000</b><small>Cash on delivery all over Bangladesh</small></span>
        </section>
        <div style={{ height: 8 }} />
      </div>
      <MobileTabBar />
    </div>

    {/* ---------- DESKTOP ---------- */}
    <div className="ofr-dk">
      <section>
        <nav aria-label="Breadcrumb" className="ofr-crumb"><Link to="/">Home</Link> › <span>Offers</span></nav>
        <div className="ofr-dk-title"><h1 className="ofr-bl">Offers</h1><span>{deals.length} products on sale · save up to {maxOff}%</span></div>
      </section>
      <section className="ofr-dk-top">
        <div className="ofr-dk-hero">
          <span className="ofr-blob" />
          <div className="ofr-dk-hero-copy">
            <span className="ofr-pill">EVERYDAY SAVINGS</span>
            <h2 className="ofr-bl">Save up to {maxOff}% on baby favourites</h2>
            <p>Real discounts on original brands. Biggest single saving: ৳{tk(saved(biggestSave))} on the {nameOf(biggestSave)}.</p>
            <div className="ofr-dk-btns">
              <button type="button" className="ofr-dark-btn" onClick={() => { pick("all"); toDeals(); }}>Browse all {deals.length} deals →</button>
              <button type="button" className="ofr-white-btn" onClick={() => { pick("under"); toDeals(); }}>Under ৳500</button>
            </div>
          </div>
          <div className="ofr-dk-floats">
            <Float p={img("winter-romper-panda")} cls="ofr-g1" />
            <Float p={img("johnsons-baby-oil")} cls="ofr-g2" />
            <Float p={img("pampers-new-baby-diapers")} cls="ofr-g3" />
          </div>
        </div>
        <article className="ofr-dk-spot">
          <span className="ofr-blob" />
          <PLink p={spotlight} className="ofr-spot-art"><img src={spotlight.image} alt={spotlight.name} /></PLink>
          <div className="ofr-dk-spot-copy">
            <span className="ofr-eb ofr-gold">BIGGEST DISCOUNT RIGHT NOW</span>
            <h3 className="ofr-bl"><PLink p={spotlight}>{nameOf(spotlight)}</PLink></h3>
            <span className="ofr-spot-meta">★ {spotlight.rating.toFixed(1)} · {spotlight.reviews} reviews · {sub}</span>
            <div className="ofr-spot-price"><b className="ofr-bl">{price(spotlight.price)}</b><s>{price(spotlight.old)}</s></div>
            <span className="ofr-spot-save">-{off(spotlight)}% · you save {price(saved(spotlight))}</span>
            <button type="button" className="ofr-yellow" onClick={onAdd(spotlight)}>Add to cart</button>
          </div>
        </article>
      </section>
      <section id="ofr-deals-dk" className="ofr-scroll">
        <div className="ofr-dk-tabrow">{tabs(true)}<span className="ofr-caption">{tab.caption}</span></div>
        <div className="ofr-dk-grid">
          {items.map(p => <article key={p.slug} className="ofr-card">
            <PLink p={p} className="ofr-well" style={{ background: tintOf(p) }}><img src={p.image} alt={nameOf(p)} /><span className="ofr-off">-{off(p)}%</span></PLink>
            <span className="ofr-save">You save {price(saved(p))}</span>
            <h3><PLink p={p}>{nameOf(p)}</PLink></h3>
            <div className="ofr-card-foot">
              <div><b className="ofr-bl">{price(p.price)}</b><s>{price(p.old)}</s></div>
              <button type="button" className="ofr-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={18} /></button>
            </div>
          </article>)}
        </div>
        <div className="ofr-more-row">{moreBtn}</div>
      </section>
      <section>
        <div><span className="ofr-eb ofr-amber">EVERY PRODUCT COUNTED ONCE · {deals.length} IN TOTAL</span><h2 className="ofr-bl ofr-dk-h2">Deals by category</h2></div>
        <div className="ofr-dk-tiles">
          <CatLink c={feature} className="ofr-tile ofr-dk-feature" style={{ background: feature.bg }}>
            <span className="ofr-eb" style={{ color: feature.ink }}>TOP DISCOUNT</span>
            <b className="ofr-bl">{feature.label}</b>
            <small>{feature.n} deals · up to {feature.max}% off</small>
            <span className="ofr-feature-btn" style={{ background: feature.ink }}>Shop {feature.label.toLowerCase()} deals →</span>
            <img src={feature.image} alt="" />
          </CatLink>
          {others.slice(0, 4).map(c => <CatLink key={c.slug} c={c} className="ofr-tile" style={{ background: c.bg }}>
            <b>{c.label}</b><small>{c.n} deals</small><small className="ofr-upto" style={{ color: c.ink }}>up to {c.max}% off</small>
            <img src={c.image} alt="" />
          </CatLink>)}
        </div>
        <div className="ofr-dk-tiles2">
          {others.slice(4).map(c => <CatLink key={c.slug} c={c} className="ofr-tile" style={{ background: c.bg }}>
            <b>{c.label}</b><small>{c.n} deals · <span style={{ color: c.ink }}>up to {c.max}% off</span></small>
            <img src={c.image} alt="" />
          </CatLink>)}
        </div>
      </section>
      <section className="ofr-dk-strip">
        <div><span className="ofr-truck"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg></span><span><b>Free delivery over ৳3,000</b><small>৳80 below that</small></span></div>
        <div><span className="ofr-truck"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" aria-hidden="true"><rect x="2" y="6" width="20" height="13" rx="3" /><circle cx="12" cy="12.5" r="3" /></svg></span><span><b>Cash on delivery</b><small>bKash · Nagad · cards too</small></span></div>
        <div><span className="ofr-truck"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg></span><span><b>Original brands only</b><small>Sealed packs, never repacked</small></span></div>
      </section>
    </div>
  </PageShell>;
}
