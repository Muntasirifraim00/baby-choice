import { useState, type MouseEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { PageShell, MobileTabBar } from "./page-shell";
import { products, off, tk, type Product } from "@/lib/products";
import { brands } from "@/lib/brands";
import { useCart } from "@/lib/cart-store";

type Tab = "Most loved" | "Top rated" | "Best value";
const TABS: Tab[] = ["Most loved", "Top rated", "Best value"];
const CAPTION: Record<Tab, string> = {
  "Most loved": "Ranked by number of parent reviews",
  "Top rated": "Highest star rating, then most reviews",
  "Best value": "Biggest discount on the original price",
};
// Ties in "Most loved" keep catalogue order so the result matches the approved reference order.
const ORDER: Record<Tab, Product[]> = {
  "Most loved": [...products].sort((a, b) => b.reviews - a.reviews),
  "Top rated": [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews),
  "Best value": [...products].sort((a, b) => off(b) - off(a) || b.reviews - a.reviews),
};

const SHORT: Record<string, string> = {
  "aptamil-advance-follow-on-milk": "Aptamil Advance Follow On Milk",
  "sudocrem-nappy-rash-cream": "Sudocrem Nappy Rash Cream",
  "carters-girl-bodysuit-set": "Baby Girl 3-Pack Bodysuit Set",
  "winter-romper-panda": "Baby Winter Romper (Panda)",
  "aveeno-baby-shampoo": "Aveeno Baby Shampoo",
};
const nameOf = (p: Product) => SHORT[p.slug] ?? p.name;

const TINT: Record<string, string> = {
  "pampers-new-baby-diapers": "#e9f2ff",
  "aptamil-advance-follow-on-milk": "#fff4d1", "johnsons-baby-shampoo": "#fff4d1", "johnsons-baby-oil": "#fff4d1", "huggies-baby-wipes": "#fff4d1",
  "philips-avent-bottle-set": "#e6f2ff", "johnsons-baby-powder": "#e6f2ff", "baby-nail-care-set": "#e6f2ff",
  "chicco-feeding-bottle": "#eaf2ff",
  "sudocrem-nappy-rash-cream": "#ffeef4", "carters-girl-bodysuit-set": "#ffeef4", "baby-rattle-set": "#ffeef4",
  "nestle-cerelac-wheat-apple": "#fff0e4",
  "aveeno-baby-lotion": "#f1eaff", "winter-romper-panda": "#f1eaff",
  "aveeno-baby-shampoo": "#e2f8ee", "baby-stroller": "#e2f8ee", "johnsons-baby-wipes": "#e2f8ee", "digital-baby-thermometer": "#e2f8ee",
  "johnsons-baby-care-gift-set": "#ffe6ef",
};
const ROTATE = ["#e9f2ff", "#fff4d1", "#ffeef4", "#e2f8ee", "#f1eaff"];
const tintOf = (p: Product) => TINT[p.slug] ?? ROTATE[products.indexOf(p) % ROTATE.length];

const avg = (Math.round(products.reduce((s, p) => s + p.rating, 0) / products.length * 10) / 10).toFixed(1);
const totalReviews = tk(products.reduce((s, p) => s + p.reviews, 0));

const BRAND_TONES = [["#ffe6ef", "#c21e55"], ["#e6f2ff", "#2f5bd3"], ["#e2f8ee", "#136b40"], ["#fff3d1", "#b06d00"], ["#efe8ff", "#4c22b8"], ["#e3f4ff", "#2f5bd3"]];
const topBrands = [...brands].sort((a, b) => b.totalReviews - a.totalReviews).slice(0, 6);

const CATS = [
  { label: "Bath & skin", cat: "Bath & Skin", slug: "bath-and-hygiene", dot: "#2f7de0" },
  { label: "Clothing", cat: "Clothing", slug: "baby-clothing", dot: "#c21e55" },
  { label: "Feeding", cat: "Feeding", slug: "feeding-and-nursing", dot: "#b06d00" },
  { label: "Diapers", cat: "Diapers", slug: "diapers-and-wipes", dot: "#6d3bea" },
  { label: "Health", cat: "Health", slug: "health-and-safety", dot: "#1fae73" },
  { label: "Toys", cat: "Toys", slug: "toys-and-learning", dot: "#f0457a" },
  { label: "Baby gear", cat: "Baby Care", slug: "strollers-and-prams", dot: "#136b40" },
].map(c => ({ ...c, count: products.filter(p => p.category === c.cat).length }));

function Plus({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function useAdd() {
  const { add } = useCart();
  return (p: Product) => (e: MouseEvent<HTMLButtonElement>) => add(p, p.sizes[0], 1, e.currentTarget);
}

function Img({ p, alt = nameOf(p) }: { p: Product; alt?: string }) {
  return <Link to="/product/$slug" params={{ slug: p.slug }} className="trd-imglink"><img src={p.image} alt={alt} /></Link>;
}
function Name({ p }: { p: Product }) {
  return <Link to="/product/$slug" params={{ slug: p.slug }}>{nameOf(p)}</Link>;
}

function Chips() {
  return <>{CATS.map(c => {
    const inner = <><span className="trd-dot" style={{ background: c.dot }} />{c.label} <small>{c.count}</small></>;
    return c.slug === "baby-clothing"
      ? <Link key={c.slug} to="/categories/baby-clothing" className="trd-chip">{inner}</Link>
      : <Link key={c.slug} to="/categories/$cat" params={{ cat: c.slug }} className="trd-chip">{inner}</Link>;
  })}</>;
}

function Tabs({ tab, setTab, cls }: { tab: Tab; setTab: (t: Tab) => void; cls: string }) {
  return <div role="tablist" aria-label="Ranking" className={cls}>
    {TABS.map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
  </div>;
}

export function TrendingPage() {
  const [tab, setTabRaw] = useState<Tab>("Most loved");
  const [all, setAll] = useState(false);
  const setTab = (t: Tab) => { setTabRaw(t); setAll(false); };
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const router = useRouter();
  const onAdd = useAdd();
  const items = ORDER[tab];
  const [first, second, third] = items;
  const rest = items.slice(3, all ? items.length : 11);
  const value = tab === "Best value";
  const meta = (p: Product) => value ? `${off(p)}% off` : `${p.reviews} reviews`;
  const short = (p: Product) => value ? `(${off(p)}% off)` : `(${p.reviews})`;
  const back = () => { if (window.history.length > 1) router.history.back(); else router.navigate({ to: "/" }); };
  const seeLabel = all ? "Show top 11" : null;

  return <PageShell className="trd-page">
    {/* ---------- PHONE ---------- */}
    <div className="trd-ph">
      <header className="trd-ph-top">
        <button type="button" className="trd-ib" aria-label="Back" onClick={back}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg></button>
        <div className="trd-ph-title"><h1 className="trd-bl">Trending</h1><p>Ranked by real parent reviews</p></div>
        <Link to="/search" className="trd-ib" aria-label="Search"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
        <Link to="/cart" className="trd-ib trd-cart" aria-label={`Cart, ${count} items`} data-cart-target="">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></svg>
          {count > 0 && <span className="trd-badge">{count}</span>}
        </Link>
      </header>
      <div className="trd-ph-body">
        <section className="trd-ph-hero">
          <span className="trd-ph-blob" />
          <div className="trd-rel">
            <span className="trd-eb trd-gold">WHAT PARENTS LOVE MOST</span>
            <h2 className="trd-bl">The most-reviewed baby picks at Baby Choice</h2>
            <div className="trd-ph-pills"><span>{products.length} products</span><span>★ {avg} average</span><span>{totalReviews} reviews</span></div>
          </div>
        </section>
        <section>
          <Tabs tab={tab} setTab={setTab} cls="trd-ph-tabs" />
          <p className="trd-ph-cap">{CAPTION[tab]}</p>
        </section>
        <section className="trd-ph-pod">
          <article className="trd-ph-one">
            <span className="trd-bl trd-ph-m1">1</span>
            <div className="trd-ph-well1" style={{ background: tintOf(first) }}><Img p={first} /></div>
            <div className="trd-ph-one-info">
              <span className="trd-eb trd-purple">{first.brand}</span>
              <h3><Name p={first} /></h3>
              <span className="trd-rate">★ {first.rating.toFixed(1)} <span>· {meta(first)}</span></span>
              <div className="trd-ph-one-buy">
                <div><b className="trd-bl">৳ {tk(first.price)}</b><s>৳ {tk(first.old)}</s></div>
                <button type="button" className="trd-add" aria-label={`Add ${nameOf(first)} to cart`} onClick={onAdd(first)}><Plus size={18} /></button>
              </div>
            </div>
          </article>
          <div className="trd-ph-two">
            {[second, third].map((p, i) => <article key={p.slug} className="trd-ph-sm">
              <span className={`trd-bl trd-ph-m trd-m${i + 2}`}>{i + 2}</span>
              <div className="trd-ph-well2" style={{ background: tintOf(p) }}><Img p={p} /></div>
              <h3><Name p={p} /></h3>
              <span className="trd-rate">★ {p.rating.toFixed(1)} <span>{short(p)}</span></span>
              <div className="trd-ph-sm-buy"><b className="trd-bl">৳ {tk(p.price)}</b><button type="button" className="trd-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={16} /></button></div>
            </article>)}
          </div>
        </section>
        <section>
          <div className="trd-head"><div><span className="trd-eb trd-pink">RANKS 4–{all ? items.length : 11}</span><h2 className="trd-bl trd-ph-h2">Also climbing</h2></div>
            <button type="button" className="trd-see" onClick={() => setAll(a => !a)} aria-expanded={all}>{seeLabel ?? `See all ${items.length} →`}</button></div>
          <ol className="trd-ph-list">
            {rest.map((p, i) => <li key={p.slug} className="trd-row">
              <span className="trd-rk">{i + 4}</span>
              <span className="trd-thumb" style={{ background: tintOf(p) }}><Img p={p} alt="" /></span>
              <span className="trd-row-info"><b><Name p={p} /></b><span className="trd-rate">★ {p.rating.toFixed(1)} <span>· {meta(p)}</span></span><b className="trd-bl trd-row-price">৳ {tk(p.price)}</b></span>
              <button type="button" className="trd-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={16} /></button>
            </li>)}
          </ol>
        </section>
        <section>
          <span className="trd-eb trd-green">MOST-REVIEWED BRANDS</span>
          <h2 className="trd-bl trd-ph-h2">Brands parents trust</h2>
          <div className="trd-ph-brands">
            {topBrands.map((b, i) => <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} className="trd-ph-brand">
              <span className="trd-bl" style={{ background: BRAND_TONES[i][0], color: BRAND_TONES[i][1] }}>{b.name === "Baby Choice" ? "BC" : b.name[0]}</span>
              <b>{b.displayName}</b><small>{b.count} {b.count === 1 ? "product" : "products"} · ★{b.avgRating}</small>
            </Link>)}
          </div>
        </section>
        <section>
          <h2 className="trd-bl trd-ph-h2">Trending by category</h2>
          <div className="trd-chips"><Chips /></div>
        </section>
        <div className="trd-sp" />
      </div>
      <MobileTabBar active="categories" />
    </div>

    {/* ---------- DESKTOP ---------- */}
    <div className="trd-dk trd-wrap">
      <section className="trd-dk-title">
        <div>
          <nav aria-label="Breadcrumb" className="trd-crumb"><Link to="/">Home</Link> › <span>Trending</span></nav>
          <div className="trd-dk-h"><h1 className="trd-bl">Trending</h1><span>{CAPTION[tab]}</span></div>
        </div>
        <Tabs tab={tab} setTab={setTab} cls="trd-dk-tabs" />
      </section>
      <section className="trd-dk-top">
        <div className="trd-dk-hero">
          <span className="trd-dk-blob" />
          <div className="trd-rel">
            <span className="trd-eb trd-gold">WHAT PARENTS LOVE MOST</span>
            <h2 className="trd-bl">The most-reviewed baby picks at Baby Choice</h2>
            <p>Rankings come from real reviews and ratings on our own catalogue, not paid placement.</p>
          </div>
          <div className="trd-dk-stats">
            <div><b className="trd-bl">{products.length}</b><small>products ranked</small></div>
            <div><b className="trd-bl">{avg}★</b><small>average rating</small></div>
            <div><b className="trd-bl">{totalReviews}</b><small>parent reviews</small></div>
          </div>
        </div>
        <article className="trd-card trd-dk-one">
          <span className="trd-bl trd-dk-m1">1</span>
          <div className="trd-well trd-dk-well1" style={{ background: tintOf(first) }}><Img p={first} /></div>
          <span className="trd-eb trd-purple trd-dk-brand1">{first.brand}</span>
          <h3><Name p={first} /></h3>
          <span className="trd-rate trd-mt4">★ {first.rating.toFixed(1)} <span>· {meta(first)}</span></span>
          <div className="trd-dk-one-buy">
            <div><b className="trd-bl">৳ {tk(first.price)}</b><s>৳ {tk(first.old)}</s></div>
            <button type="button" className="trd-addtxt" onClick={onAdd(first)}>Add to cart</button>
          </div>
        </article>
        <div className="trd-dk-two">
          {[second, third].map((p, i) => <article key={p.slug} className="trd-card trd-dk-sm">
            <span className={`trd-bl trd-dk-m trd-m${i + 2}`}>{i + 2}</span>
            <div className="trd-well trd-dk-well2" style={{ background: tintOf(p) }}><Img p={p} /></div>
            <div className="trd-dk-sm-info">
              <h3><Name p={p} /></h3>
              <span className="trd-rate">★ {p.rating.toFixed(1)} <span>· {meta(p)}</span></span>
              <b className="trd-bl">৳ {tk(p.price)}</b>
              <button type="button" className="trd-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={18} /></button>
            </div>
          </article>)}
        </div>
      </section>
      <section>
        <div className="trd-head"><div><span className="trd-eb trd-pink">RANKS 4–{all ? items.length : 11}</span><h2 className="trd-bl trd-dk-h2">Also climbing</h2></div>
          <button type="button" className="trd-see" onClick={() => setAll(a => !a)} aria-expanded={all}>{seeLabel ?? `See all ${items.length} ranked →`}</button></div>
        <div className="trd-dk-grid">
          {rest.map((p, i) => <article key={p.slug} className="trd-card">
            <span className="trd-bl trd-dk-rk">#{i + 4}</span>
            <div className="trd-well trd-dk-well3" style={{ background: tintOf(p) }}><Img p={p} /></div>
            <span className="trd-eb trd-purple trd-dk-brand3">{p.brand}</span>
            <h3 className="trd-dk-g-name"><Name p={p} /></h3>
            <span className="trd-rate trd-mt4">★ {p.rating.toFixed(1)} <span>· {meta(p)}</span></span>
            <div className="trd-dk-g-buy">
              <div><b className="trd-bl">৳ {tk(p.price)}</b><s>৳ {tk(p.old)}</s></div>
              <button type="button" className="trd-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><Plus size={18} /></button>
            </div>
          </article>)}
        </div>
      </section>
      <section className="trd-dk-bottom">
        <div className="trd-dk-brandbox">
          <span className="trd-eb trd-green">MOST-REVIEWED BRANDS</span>
          <h2 className="trd-bl trd-dk-h2b">Brands parents trust</h2>
          <div className="trd-dk-brands">
            {topBrands.map((b, i) => <Link key={b.slug} to="/brands/$brand" params={{ brand: b.slug }} className="trd-dk-brand">
              <span className="trd-bl" style={{ background: BRAND_TONES[i][0], color: BRAND_TONES[i][1] }}>{b.name === "Baby Choice" ? "BC" : b.name[0]}</span>
              <span className="trd-minw"><b>{b.displayName}</b><small>{b.count} {b.count === 1 ? "product" : "products"} · ★{b.avgRating}</small></span>
            </Link>)}
          </div>
        </div>
        <div className="trd-dk-catbox">
          <span className="trd-eb trd-green">BROWSE</span>
          <h2 className="trd-bl trd-dk-h2b trd-darkgreen">Trending by category</h2>
          <div className="trd-chips trd-dk-chips"><Chips /></div>
        </div>
      </section>
    </div>
  </PageShell>;
}
