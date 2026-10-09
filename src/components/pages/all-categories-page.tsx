import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { PageShell, MobileTabBar } from "./page-shell";
import { catalogCategories } from "@/lib/catalog-demo";
import { getCategoryListing } from "@/lib/home-categories";
import { slugify } from "@/lib/live-head";
import { getProduct, products, tk, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

/* /categories — 1:1 translation of public/design-ref/categories-{phone,desktop}.html, wired to the catalogue. */

const IMG: Record<string, string> = {
  "Bedding & Blankets": "carters-honey-cotton-wash-cloth", "Baby Accessories": "baby-nail-care-set", "Baby Clothing": "baby-clothing-set",
  "Panjabi & Pajamas": "girl-pajama-set", "Skin Care": "aveeno-baby-lotion", "Bath & Hygiene": "baby-hooded-towel",
  "Feeding & Nursing": "baby-feeding-set", "Diapers & Wipes": "pampers-new-baby-diapers", "Health & Safety": "digital-baby-thermometer",
  "Toys & Learning": "baby-rattle-set", "Outdoor & Travel": "baby-carrier", "School & Activity": "baby-activity-walker",
  "Strollers & Prams": "baby-stroller", "High Chairs & Boosters": "baby-high-chair", "Mother & Maternity": "electric-breast-pump",
  "Gifts & Hampers": "johnsons-baby-care-gift-set",
};

const GROUPS = [
  { id: "clothing", name: "Clothing & sleep", eyebrow: "WEAR & SLEEP", tint: "#e6f2ff", ink: "#2f5bd3", names: ["Baby Clothing", "Panjabi & Pajamas", "Bedding & Blankets", "Baby Accessories"] },
  { id: "care", name: "Feeding & everyday care", eyebrow: "EVERY DAY", tint: "#fff3d1", ink: "#b06d00", names: ["Feeding & Nursing", "Diapers & Wipes", "Bath & Hygiene", "Skin Care", "Health & Safety"] },
  { id: "play", name: "Play & gear", eyebrow: "PLAY & GO", tint: "#e2f8ee", ink: "#136b40", names: ["Toys & Learning", "Strollers & Prams", "High Chairs & Boosters", "Outdoor & Travel", "School & Activity"] },
  { id: "mum", name: "Mum & gifts", eyebrow: "FOR MUM & GIFTING", tint: "#ffe6ef", ink: "#c21e55", names: ["Mother & Maternity", "Gifts & Hampers"] },
].map(g => ({
  ...g,
  cats: g.names
    .filter(n => catalogCategories.some(c => c.name === n))
    .map((name, i) => { const slug = slugify(name); return { name, slug, i, count: getCategoryListing(slug).items.length, image: getProduct(IMG[name] ?? "")?.image ?? "" }; })
    .sort((a, b) => b.count - a.count || a.i - b.i),
}));
type Group = (typeof GROUPS)[number];
type Cat = Group["cats"][number];

if (import.meta.env.DEV) {
  const got = GROUPS.map(g => g.cats.map(c => `${c.name} ${c.count}`).join(", ")).join(" · ");
  const want = "Bedding & Blankets 12, Baby Accessories 10, Baby Clothing 7, Panjabi & Pajamas 1 · Skin Care 21, Bath & Hygiene 16, Feeding & Nursing 6, Diapers & Wipes 5, Health & Safety 5 · Toys & Learning 5, Outdoor & Travel 5, School & Activity 5, Strollers & Prams 1, High Chairs & Boosters 1 · Mother & Maternity 11, Gifts & Hampers 10";
  if (got !== want) console.warn(`[categories] unexpected counts: ${got}`);
}

const SHORT: Record<string, string> = { "aptamil-advance-follow-on-milk": "Aptamil Advance Follow On Milk" };
const TINT: Record<string, string> = { "pampers-new-baby-diapers": "#e9f2ff", "aptamil-advance-follow-on-milk": "#fff4d1", "philips-avent-bottle-set": "#e6f2ff", "johnsons-baby-shampoo": "#fff4d1" };
const ROTATE = ["#e9f2ff", "#fff4d1", "#ffeef4", "#e2f8ee", "#f1eaff"];
const popular = products.map((p, i) => ({ p, i })).sort((a, b) => b.p.reviews - a.p.reviews || a.i - b.i).map(x => x.p);
const nameOf = (p: Product) => SHORT[p.slug] ?? p.name;
const tintOf = (p: Product) => TINT[p.slug] ?? ROTATE[products.indexOf(p) % ROTATE.length]!;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

function Arrow({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d3bea" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
function CatLink({ c, className, style, children }: { c: Cat; className: string; style?: CSSProperties; children: ReactNode }) {
  return c.slug === "baby-clothing"
    ? <Link to="/categories/baby-clothing" className={className} style={style}>{children}</Link>
    : <Link to="/categories/$cat" params={{ cat: c.slug }} className={className} style={style}>{children}</Link>;
}

function SearchBox({ q, setQ, cls }: { q: string; setQ: (v: string) => void; cls: string }) {
  return <div className={cls}>
    <SearchIcon />
    <label htmlFor={cls === "alc-ph-search" ? "cq" : "cq-d"} className="alc-sr">Find a category</label>
    <input id={cls === "alc-ph-search" ? "cq" : "cq-d"} type="search" placeholder="Find a category: bath, toys, clothing…" value={q} onChange={e => setQ(e.target.value)} />
  </div>;
}

function Empty({ q }: { q: string }) {
  return <section className="alc-empty">
    <h2 className="alc-bl">No category called “{q}”</h2>
    <p>It may still be a product. Try searching all {products.length} products.</p>
    <Link to="/search" search={{ q } as never}>Search products for “{q}”</Link>
  </section>;
}

/* ---------- phone group ---------- */
function PhGroup({ g, cats }: { g: Group; cats: Cat[] }) {
  const feat = cats.length % 2 === 1 ? cats[0] : undefined;
  const rest = feat ? cats.slice(1) : cats;
  return <section id={g.id} className="alc-ph-group alc-anchor">
    <div className="alc-ph-ghead"><div><span className="alc-eb" style={{ color: g.ink }}>{g.eyebrow}</span><h2 className="alc-bl">{g.name}</h2></div><span>{cats.length === 1 ? "1 category" : `${cats.length} categories`}</span></div>
    {feat && <CatLink c={feat} className="alc-feat">
      <span className="alc-art" style={{ background: g.tint }}><img src={feat.image} alt="" /></span>
      <span className="alc-feat-copy"><span className="alc-eb" style={{ color: g.ink }}>MOST PRODUCTS</span><b className="alc-bl">{feat.name}</b><small>{plural(feat.count, "product")}</small><span className="alc-pill" style={{ background: g.ink }}>Shop now →</span></span>
    </CatLink>}
    {rest.length > 0 && <div className="alc-ph-grid">{rest.map(c => <CatLink key={c.slug} c={c} className="alc-tile">
      <span className="alc-art" style={{ background: g.tint }}><img src={c.image} alt="" /></span>
      <b>{c.name}</b>
      <span className="alc-tile-foot"><small>{plural(c.count, "product")}</small><span className="alc-go" style={{ background: g.tint, color: g.ink }}><Arrow size={14} /></span></span>
    </CatLink>)}</div>}
  </section>;
}

/* ---------- desktop group ---------- */
function DkTile({ g, c, big }: { g: Group; c: Cat; big?: boolean }) {
  return <CatLink c={c} className={`alc-tile${big ? " alc-tile-big" : ""}`}>
    <span className="alc-art" style={{ background: g.tint }}><img src={c.image} alt="" /></span>
    <b>{c.name}</b>
    <span className="alc-tile-foot"><small>{plural(c.count, "product")}</small><span className="alc-go" style={{ background: g.tint, color: g.ink }}><Arrow size={16} /></span></span>
  </CatLink>;
}
function DkGroup({ g, cats }: { g: Group; cats: Cat[] }) {
  const n = cats.length;
  let body;
  if (n === 4) body = <div className="alc-dk-four">{cats.map(c => <DkTile key={c.slug} g={g} c={c} big />)}</div>;
  else if (n === 2) body = <div className="alc-dk-two">{cats.map(c => <CatLink key={c.slug} c={c} className="alc-tile alc-wide">
    <span className="alc-art" style={{ background: g.tint }}><img src={c.image} alt="" /></span>
    <span className="alc-wide-copy"><b className="alc-bl">{c.name}</b><small>{plural(c.count, "product")}</small><span className="alc-pill2" style={{ background: g.ink }}>Shop now →</span></span>
  </CatLink>)}</div>;
  else {
    const [f, ...rest] = cats;
    body = <div className={`alc-dk-feat alc-dk-n${n}`}>
      <CatLink c={f!} className="alc-tile alc-dk-feature" style={{ background: g.tint }}>
        <span className="alc-eb" style={{ color: g.ink }}>MOST PRODUCTS IN THIS GROUP</span>
        <b className="alc-bl">{f!.name}</b>
        <small>{plural(f!.count, "product")}</small>
        <span className="alc-art"><img src={f!.image} alt="" /></span>
        <span className="alc-pill2 alc-pill3" style={{ background: g.ink }}>Shop {f!.name} →</span>
      </CatLink>
      {rest.map(c => <DkTile key={c.slug} g={g} c={c} />)}
    </div>;
  }
  return <section id={`${g.id}-d`} className="alc-anchor">
    <div className="alc-dk-ghead"><div><span className="alc-eb" style={{ color: g.ink }}>{g.eyebrow}</span><h2 className="alc-bl">{g.name}</h2></div><span>{n === 1 ? "1 category" : `${n} categories`}</span></div>
    {body}
  </section>;
}

export function AllCategoriesPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState("clothing");
  const { lines, add } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const router = useRouter();
  const term = q.trim().toLowerCase();
  const shown = useMemo(() => GROUPS.map(g => ({ g, cats: term ? g.cats.filter(c => c.name.toLowerCase().includes(term) || g.name.toLowerCase().includes(term)) : g.cats })).filter(x => x.cats.length), [term]);
  const total = shown.reduce((n, x) => n + x.cats.length, 0);
  const back = () => { if (window.history.length > 1) router.history.back(); else router.navigate({ to: "/" }); };
  const jump = (id: string, dk: boolean) => (e: MouseEvent) => {
    e.preventDefault();
    if (dk) setActive(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(dk ? `${id}-d` : id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const onAdd = (p: Product) => (e: MouseEvent<HTMLButtonElement>) => add(p, p.sizes[0], 1, e.currentTarget);

  useEffect(() => {
    const els = shown.map(x => document.getElementById(`${x.g.id}-d`)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    if (!shown.some(x => x.g.id === active)) setActive(shown[0]!.g.id);
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id.replace(/-d$/, ""));
    }, { rootMargin: "-20% 0px -60% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const subtitle = `${total === 1 ? "1 category" : `${total} categories`} · ${products.length} products`;

  return <PageShell className="alc-page">
    {/* ---------- PHONE ---------- */}
    <div className="alc-ph">
      <header className="alc-ph-top">
        <div className="alc-ph-row">
          <button type="button" className="alc-ib" aria-label="Back" onClick={back}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg></button>
          <div className="alc-ph-title"><h1 className="alc-bl">All categories</h1><p>{subtitle}</p></div>
          <Link to="/cart" className="alc-ib alc-cart" aria-label={`Cart, ${count} items`} data-cart-target="">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></svg>
            {count > 0 && <span className="alc-badge">{count}</span>}
          </Link>
        </div>
        <SearchBox q={q} setQ={setQ} cls="alc-ph-search" />
        {shown.length > 0 && <nav aria-label="Jump to group" className="alc-ph-chips">
          {shown.map(({ g, cats }) => <a key={g.id} href={`#${g.id}`} onClick={jump(g.id, false)} style={{ background: g.tint, color: g.ink }}>{g.name} <span>{cats.length}</span></a>)}
        </nav>}
      </header>
      <div className="alc-ph-body">
        {shown.length ? <>
          {shown.map(({ g, cats }) => <PhGroup key={g.id} g={g} cats={cats} />)}
          <p className="alc-ph-note">Some products sit in more than one category.</p>
        </> : <Empty q={q.trim()} />}
        <section>
          <span className="alc-eb alc-pink">MOST REVIEWED</span>
          <h2 className="alc-bl alc-h22">Popular right now</h2>
          <div className="alc-ph-pop">
            {popular.slice(0, 4).map(p => <article key={p.slug}>
              <Link to="/product/$slug" params={{ slug: p.slug }} className="alc-pop-art" style={{ background: tintOf(p) }}><img src={p.image} alt={nameOf(p)} /></Link>
              <h3><Link to="/product/$slug" params={{ slug: p.slug }}>{nameOf(p)}</Link></h3>
              <span className="alc-pop-rate">★ {p.rating.toFixed(1)} <span>({p.reviews})</span></span>
              <div className="alc-pop-foot"><b className="alc-bl">৳ {tk(p.price)}</b><button type="button" className="alc-add" aria-label={`Add ${nameOf(p)} to cart`} onClick={onAdd(p)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button></div>
            </article>)}
          </div>
        </section>
        <section className="alc-ph-help">
          <span className="alc-eb alc-brown">CAN’T FIND IT?</span>
          <h2 className="alc-bl alc-h22">Ask a real person</h2>
          <div><a href="tel:+8801712345678" className="alc-dark">Call us</a><Link to="/support" className="alc-green">Help centre</Link></div>
        </section>
        <div style={{ height: 8 }} />
      </div>
      <MobileTabBar active="categories" />
    </div>

    {/* ---------- DESKTOP ---------- */}
    <div className="alc-dk">
      <section className="alc-dk-head">
        <div>
          <nav aria-label="Breadcrumb" className="alc-crumb"><Link to="/">Home</Link> › <span>All categories</span></nav>
          <div className="alc-dk-title"><h1 className="alc-bl">All categories</h1><span>{subtitle}</span></div>
        </div>
        <SearchBox q={q} setQ={setQ} cls="alc-dk-search" />
      </section>
      <div className="alc-dk-cols">
        <aside className="alc-side">
          <nav className="alc-jump" aria-label="Jump to group">
            <h2 className="alc-bl">Jump to</h2>
            {shown.map(({ g, cats }) => { const on = active === g.id; return <a key={g.id} href={`#${g.id}-d`} onClick={jump(g.id, true)} aria-current={on ? "location" : "false"} style={on ? { background: g.tint, color: g.ink } : undefined}>
              <span className="alc-dot" style={{ background: g.ink }} /><span className="alc-grow">{g.name}</span><small>{cats.length}</small>
            </a>; })}
          </nav>
          <section className="alc-side-pop">
            <span className="alc-eb alc-pink">MOST REVIEWED</span>
            <h2 className="alc-bl">Popular right now</h2>
            <div>{popular.slice(0, 3).map(p => <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }}>
              <span className="alc-side-art" style={{ background: tintOf(p) }}><img src={p.image} alt="" /></span>
              <span className="alc-min0"><b>{nameOf(p)}</b><small>৳ {tk(p.price)} <span>· ★ {p.rating.toFixed(1)}</span></small></span>
            </Link>)}</div>
          </section>
          <section className="alc-side-help">
            <span className="alc-eb alc-brown">CAN’T FIND IT?</span>
            <h2 className="alc-bl">Ask a real person</h2>
            <a href="tel:+8801712345678" className="alc-dark">Call +880 1712 345678</a>
            <Link to="/support" className="alc-green">Visit help centre</Link>
          </section>
        </aside>
        <div className="alc-dk-main">
          {shown.length ? <>
            {shown.map(({ g, cats }) => <DkGroup key={g.id} g={g} cats={cats} />)}
            <p className="alc-dk-note">Some products sit in more than one category, so category counts add up to more than {products.length}.</p>
          </> : <Empty q={q.trim()} />}
        </div>
      </div>
    </div>
  </PageShell>;
}
