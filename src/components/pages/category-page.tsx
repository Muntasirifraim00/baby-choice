import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell, MobileTabBar } from "@/components/pages/page-shell";
import { useCart, totals, FREE_DELIVERY } from "@/lib/cart-store";
import { getCategoryListing } from "@/lib/home-categories";
import { catalogCategories } from "@/lib/catalog-demo";
import { slugify } from "@/lib/live-head";
import { off, tk, type Product } from "@/lib/products";

/* ---------------- data helpers (all derived from the real catalog) ---------------- */

const money = (n: number) => `৳ ${tk(Math.round(n))}`;

/** Sub-category ("kind") of a product, derived from its type / name. */
const KINDS: [RegExp, string][] = [
  [/wipes/i, "Wipes"],
  [/diaper bag/i, "Bags & carriers"],
  [/diaper/i, "Diapers"],
  [/rash|cream/i, "Creams & care"],
  [/towel|wash cloth/i, "Towels"],
  [/shampoo/i, "Shampoo"],
  [/body wash|baby wash/i, "Body wash"],
  [/lotion/i, "Lotion"],
  [/oil/i, "Oil"],
  [/talc|baby powder/i, "Powder"],
  [/gift/i, "Gift sets"],
  [/bodysuit/i, "Bodysuits"],
  [/romper/i, "Rompers"],
  [/dress/i, "Dresses"],
  [/pajama/i, "Sleepwear"],
  [/clothing set/i, "Sets"],
  [/milk|cerelac|cereal/i, "Formula & food"],
  [/bottle|sippy|cup/i, "Bottles & cups"],
  [/feeding set/i, "Feeding sets"],
  [/high chair/i, "High chairs"],
  [/stroller/i, "Strollers"],
  [/carrier/i, "Bags & carriers"],
  [/thermometer|first aid/i, "Health"],
  [/breast pump/i, "Mum care"],
  [/nail/i, "Grooming"],
  [/play mat|walker/i, "Play & activity"],
  [/rattle|teddy|stacking|toy/i, "Toys"],
];
const kindOf = (p: Product) => KINDS.find(([re]) => re.test(`${p.type ?? ""} ${p.name}`))?.[1] ?? p.category;

/** Ages derived from age-style sizes like "0-3M", "1-2Y", "6+ Months". */
type AgeId = "nb" | "m6" | "m12" | "y2" | "y3";
const AGES: { id: AgeId; label: string }[] = [
  { id: "nb", label: "Newborn" },
  { id: "m6", label: "3–6 mo" },
  { id: "m12", label: "6–12 mo" },
  { id: "y2", label: "1–2 yrs" },
  { id: "y3", label: "2–3 yrs" },
];
const SIZE_AGES: Record<string, AgeId[]> = {
  "0-3M": ["nb"], "3-6M": ["m6"], "6-12M": ["m12"], "1-2Y": ["y2"], "2-3Y": ["y3"],
  "6+ Months": ["m12", "y2", "y3"], "12+ Months": ["y2", "y3"],
};
const RANGE: Record<AgeId, [number, number]> = { nb: [0, 3], m6: [3, 6], m12: [6, 12], y2: [12, 24], y3: [24, 36] };
const agesOf = (p: Product) => [...new Set(p.sizes.flatMap(s => SIZE_AGES[s] ?? []))];
const isAgeSize = (s: string) => s in SIZE_AGES;

function ageLabel(p: Product) {
  const plus = p.sizes.find(s => s.includes("+"));
  if (plus) return plus.replace("Months", "months");
  const ages = agesOf(p);
  if (!ages.length) return null;
  const min = Math.min(...ages.map(a => RANGE[a][0]));
  const max = Math.max(...ages.map(a => RANGE[a][1]));
  if (max <= 12) return `${min}–${max} mo`;
  if (min >= 12) return `${min / 12}–${max / 12} yrs`;
  return `${min} mo – ${max / 12} yrs`;
}
function sizeLabel(p: Product) {
  const age = ageLabel(p);
  if (age) return age;
  if (p.sizes.length > 2) return `${p.sizes[0]} – ${p.sizes[p.sizes.length - 1]}`;
  return p.sizes.join(" · ");
}

type QuickId = "top" | "deal" | "u1000" | "new";
const QUICK: { id: QuickId; label: string; test: (p: Product) => boolean }[] = [
  { id: "top", label: "Rated 4.8+", test: p => p.rating >= 4.8 },
  { id: "deal", label: "20%+ off", test: p => off(p) >= 20 },
  { id: "u1000", label: "Under ৳1,000", test: p => p.price < 1000 },
  { id: "new", label: "New arrivals", test: p => /new/i.test(p.badge ?? "") },
];

type SortId = "pop" | "rating" | "low" | "high" | "disc";
const SORTS: { id: SortId; label: string }[] = [
  { id: "pop", label: "Most popular" },
  { id: "rating", label: "Top rated" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "disc", label: "Biggest discount" },
];
const SORTERS: Record<SortId, (a: Product, b: Product) => number> = {
  pop: (a, b) => b.reviews - a.reviews,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  disc: (a, b) => off(b) - off(a),
};

type PriceId = "p1" | "p2" | "p3" | "p4";
const PRICES: { id: PriceId; label: string; min: number; max: number }[] = [
  { id: "p1", label: "Under ৳500", min: 0, max: 499 },
  { id: "p2", label: "৳500 – 1,000", min: 500, max: 1000 },
  { id: "p3", label: "৳1,000 – 2,000", min: 1001, max: 2000 },
  { id: "p4", label: "৳2,000+", min: 2001, max: Infinity },
];

const TINTS = ["#e6f2ff", "#ffeef4", "#e2f8ee", "#f1eaff", "#fff4d1", "#fff1f1"];
const tintOf = (slug: string): string => TINTS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % TINTS.length] ?? "#f1eaff";

type State = {
  sub: string; age: AgeId | "any"; quick: QuickId[]; brands: string[]; sizes: string[]; price: PriceId | null;
};
const EMPTY: State = { sub: "all", age: "any", quick: [], brands: [], sizes: [], price: null };
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

function matches(p: Product, s: State, skip?: "brand") {
  if (s.sub !== "all" && kindOf(p) !== s.sub) return false;
  if (s.age !== "any" && !agesOf(p).includes(s.age)) return false;
  for (const q of s.quick) if (!QUICK.find(x => x.id === q)?.test(p)) return false;
  if (skip !== "brand" && s.brands.length && !s.brands.includes(p.brand)) return false;
  if (s.sizes.length && !p.sizes.some(z => s.sizes.includes(z))) return false;
  if (s.price) {
    const r = PRICES.find(x => x.id === s.price);
    if (r && (p.price < r.min || p.price > r.max)) return false;
  }
  return true;
}

/* ---------------- small icons ---------------- */

const IcBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>;
const IcSearch = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
const IcCart = ({ s = 20 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="19.5" r="1.3" fill="#fff" /><circle cx="17" cy="19.5" r="1.3" fill="#fff" /></svg>;
const IcFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
const IcSort = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d3bea" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" /></svg>;
const IcChev = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
const IcCheck = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>;
const IcClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
const IcGrid = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>;
const IcList = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="6" height="6" rx="1.5" /><rect x="11" y="5" width="10" height="4" rx="1.5" /><rect x="3" y="14" width="6" height="6" rx="1.5" /><rect x="11" y="15" width="10" height="4" rx="1.5" /></svg>;
const IcHeart = ({ on }: { on: boolean }) => on
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0457a" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" /></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5f86" strokeWidth="2" aria-hidden="true"><path d="M12 21C5 16 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 8-10 13z" /></svg>;
const Teddy = ({ w = 22, sad = false, className }: { w?: number; sad?: boolean; className?: string }) => (
  <svg className={className} width={w} height={w * (sad ? 110 / 120 : 1)} viewBox="0 0 60 60" aria-hidden="true">
    <circle cx="16" cy="15" r="9" fill="url(#hdBrown)" /><circle cx="44" cy="15" r="9" fill="url(#hdBrown)" />
    <circle cx="30" cy="31" r="22" fill="url(#hdBrown)" /><ellipse cx="30" cy="39" rx="10" ry="7" fill="#f6dcc0" />
    <circle cx="22" cy="28" r="2.6" fill="#2b1d18" /><circle cx="38" cy="28" r="2.6" fill="#2b1d18" />
    {sad && <path d="M26 43q4-3 8 0" stroke="#2b1d18" strokeWidth="1.6" fill="none" strokeLinecap="round" />}
  </svg>
);
const AllArt = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="2.5" fill="url(#hdPink)" /><rect x="13" y="3" width="8" height="8" rx="2.5" fill="url(#hdYellow)" />
    <rect x="3" y="13" width="8" height="8" rx="2.5" fill="url(#hdBlue)" /><rect x="13" y="13" width="8" height="8" rx="2.5" fill="url(#hdMint)" />
  </svg>
);

/* ---------------- page ---------------- */

export function CategoryPage({ cat }: { cat: string }) {
  const listing = useMemo(() => getCategoryListing(cat), [cat]);
  const all = listing.items;
  const { lines, wish, add, setQty, toggleWish } = useCart();

  const [s, setS] = useState<State>(EMPTY);
  const [sort, setSort] = useState<SortId>("pop");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sheet, setSheet] = useState<null | "sort" | "filter">(null);
  const [sortMenu, setSortMenu] = useState(false);
  const patch = (p: Partial<State>) => setS(prev => ({ ...prev, ...p }));

  /* options derived from this category's real items */
  const subs = useMemo(() => {
    const m = new Map<string, Product[]>();
    for (const p of all) { const k = kindOf(p); m.set(k, [...(m.get(k) ?? []), p]); }
    return [...m.entries()].map(([label, items]) => ({ label, items }));
  }, [all]);
  const ages = useMemo(() => AGES.filter(a => all.some(p => agesOf(p).includes(a.id))), [all]);
  const quick = useMemo(() => QUICK.filter(q => all.some(q.test)), [all]);
  const brandNames = useMemo(() => [...new Set(all.map(p => p.brand))].sort(), [all]);
  const sizeNames = useMemo(() => [...new Set(all.flatMap(p => p.sizes).filter(z => !isAgeSize(z)))], [all]);
  const prices = useMemo(() => PRICES.filter(r => all.some(p => p.price >= r.min && p.price <= r.max)), [all]);

  const list = useMemo(() => all.filter(p => matches(p, s)).sort(SORTERS[sort]), [all, s, sort]);
  const brandCount = (b: string) => all.filter(p => p.brand === b && matches(p, s, "brand")).length;

  const filterCount = s.brands.length + s.sizes.length + (s.price ? 1 : 0);
  const activeCount = filterCount + s.quick.length + (s.age !== "any" ? 1 : 0) + (s.sub !== "all" ? 1 : 0);
  const clearAll = () => setS(EMPTY);
  const resetSheet = () => patch({ brands: [], sizes: [], price: null, quick: [] });
  const sortName = SORTS.find(x => x.id === sort)?.label ?? "";
  const countLabel = `${list.length} ${list.length === 1 ? "product" : "products"}`;

  /* cart */
  const t = totals(lines);
  const left = FREE_DELIVERY - t.net;
  const freeNote = left > 0 ? `Add ${money(left)} more for free delivery` : "You unlocked free delivery!";

  /* sheets: escape, scroll lock, focus */
  const sheetRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openSheet = (k: "sort" | "filter") => (e: MouseEvent<HTMLButtonElement>) => { opener.current = e.currentTarget; setSheet(k); };
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheet(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); opener.current?.focus(); };
  }, [sheet]);

  /* desktop sort menu: close on outside click / escape */
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortMenu) return;
    const onDown = (e: PointerEvent) => { if (!menuRef.current?.contains(e.target as Node)) setSortMenu(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSortMenu(false); };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onKey); };
  }, [sortMenu]);

  const sortOptions = (onPick: () => void) => (
    <div role="radiogroup" aria-label="Sort by" className="cg-sorts">
      {SORTS.map(o => (
        <button key={o.id} type="button" role="radio" aria-checked={sort === o.id} className={`cg-sort-opt ${sort === o.id ? "on" : ""}`} onClick={() => { setSort(o.id); onPick(); }}>
          <span>{o.label}</span><span className="cg-radio" aria-hidden="true"><span /></span>
        </button>
      ))}
    </div>
  );

  const filterBody = (withAge: boolean) => (
    <>
      {withAge && ages.length > 0 && (
        <FilterGroup title="Baby's age">
          <div className="cg-chipwrap">
            {[{ id: "any" as const, label: "All ages" }, ...ages].map(a => (
              <button key={a.id} type="button" aria-pressed={s.age === a.id} className={`cg-pill ${s.age === a.id ? "on" : ""}`} onClick={() => patch({ age: a.id })}>{a.label}</button>
            ))}
          </div>
        </FilterGroup>
      )}
      {prices.length > 1 && (
        <FilterGroup title="Price">
          <div className="cg-prices">
            {prices.map(r => (
              <button key={r.id} type="button" aria-pressed={s.price === r.id} className={`cg-chip ${s.price === r.id ? "on" : ""}`} onClick={() => patch({ price: s.price === r.id ? null : r.id })}>{r.label}</button>
            ))}
          </div>
        </FilterGroup>
      )}
      {brandNames.length > 1 && (
        <FilterGroup title="Brand">
          <div className="cg-chipwrap">
            {brandNames.map(b => {
              const on = s.brands.includes(b);
              return (
                <button key={b} type="button" aria-pressed={on} className={`cg-chip round ${on ? "on" : ""}`} onClick={() => patch({ brands: toggle(s.brands, b) })}>
                  {b} <span className="cg-n">{brandCount(b)}</span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
      {sizeNames.length > 1 && (
        <FilterGroup title="Size">
          <div className="cg-sizes">
            {sizeNames.map(z => {
              const on = s.sizes.includes(z);
              return <button key={z} type="button" aria-pressed={on} className={`cg-chip cg-size ${on ? "on" : ""}`} onClick={() => patch({ sizes: toggle(s.sizes, z) })}>{z}</button>;
            })}
          </div>
        </FilterGroup>
      )}
      {quick.length > 0 && (
        <FilterGroup title="Good to know">
          <div className="cg-switches">
            {quick.map(q => {
              const on = s.quick.includes(q.id);
              return (
                <button key={q.id} type="button" role="switch" aria-checked={on} className={`cg-switch ${on ? "on" : ""}`} onClick={() => patch({ quick: toggle(s.quick, q.id) })}>
                  {q.label}<span className="cg-track" aria-hidden="true"><span /></span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
    </>
  );

  const items: ReactNode[] = [];
  list.forEach((p, i) => {
    items.push(
      <ProductCard key={p.slug} p={p} view={view} wished={wish.includes(p.slug)} onWish={() => toggleWish(p.slug)}
        qty={lines.filter(l => l.slug === p.slug).reduce((n, l) => n + l.qty, 0)}
        onInc={el => {
          const last = [...lines].reverse().find(l => l.slug === p.slug);
          if (last) setQty(p.slug, last.size, last.qty + 1); else add(p, p.sizes[0], 1, el);
        }}
        onDec={() => {
          const last = [...lines].reverse().find(l => l.slug === p.slug);
          if (last) setQty(p.slug, last.size, last.qty - 1);
        }} />,
    );
    if (i === 3 && list.length > 4) items.push(<PromoBanner key="cg-banner" />);
  });

  return (
    <PageShell className="cg">
      <div className={`cg-page ${t.count > 0 ? "has-cart" : ""}`}>
        {/* ---------- phone top bar + toolbar ---------- */}
        <div className="cg-top">
          <header className="cg-bar">
            <Link to="/categories" aria-label="Back to all categories" className="cg-ibtn"><IcBack /></Link>
            <div className="cg-bar-title">
              <h1>{listing.name}</h1>
              <p aria-live="polite">{countLabel}</p>
            </div>
            <Link to="/search" aria-label="Search products" className="cg-ibtn"><IcSearch /></Link>
            <Link to="/cart" aria-label={`Cart, ${t.count} items`} className="cg-ibtn cg-cartbtn">
              <IcCart />
              {t.count > 0 && <span className="cg-badge cg-pop">{t.count}</span>}
            </Link>
          </header>
          <div className="cg-tools">
            <button type="button" className="cg-filterbtn" onClick={openSheet("filter")} aria-haspopup="dialog">
              <IcFilter />Filter
              {filterCount > 0 && <span className="cg-fcount cg-pop" aria-label={`${filterCount} active`}>{filterCount}</span>}
            </button>
            <button type="button" className="cg-sortbtn" onClick={openSheet("sort")} aria-haspopup="dialog">
              <IcSort /><span className="cg-sortname"><span className="sr-only">Sort: </span>{sortName}</span><IcChev />
            </button>
            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        <div className="cg-wrap">
          {/* ---------- desktop heading ---------- */}
          <div className="cg-dhead">
            <nav aria-label="Breadcrumb" className="cg-crumbs">
              <Link to="/">Home</Link><span aria-hidden="true">›</span>
              <Link to="/categories">Categories</Link><span aria-hidden="true">›</span>
              <span aria-current="page">{listing.name}</span>
            </nav>
            <div className="cg-dtitle">
              <h1>{listing.name}</h1>
              <span className="cg-dcount">{countLabel}</span>
            </div>
          </div>

          {/* ---------- sub-categories ---------- */}
          {subs.length > 1 && (
            <nav aria-label="Sub-categories" className="cg-subs">
              <SubTile label="All" on={s.sub === "all"} onPick={() => patch({ sub: "all" })} bg="#fff1c4"><AllArt /></SubTile>
              {subs.map(sc => (
                <SubTile key={sc.label} label={sc.label} on={s.sub === sc.label} onPick={() => patch({ sub: s.sub === sc.label ? "all" : sc.label })} bg={tintOf(sc.items[0]?.slug ?? sc.label)}>
                  {sc.items[0] && <img src={sc.items[0].image} alt="" loading="lazy" />}
                </SubTile>
              ))}
            </nav>
          )}

          <div className="cg-layout">
            {/* ---------- desktop sidebar ---------- */}
            <aside className="cg-side" aria-label="Filters">
              <div className="cg-panel">
                <div className="cg-panel-head">
                  <h2>Filters</h2>
                  {activeCount > 0 && <button type="button" className="cg-link" onClick={clearAll}>Clear all</button>}
                </div>
                {filterBody(true)}
              </div>
              {t.count > 0 && (
                <Link to="/cart" className="cg-sidecart">
                  <span className="cg-sidecart-ic"><IcCart s={18} /></span>
                  <span className="cg-sidecart-txt"><b>{t.count} items · {money(t.net)}</b><span>{freeNote}</span></span>
                  <span className="cg-sidecart-go">View cart →</span>
                </Link>
              )}
              <nav className="cg-panel cg-cats" aria-label="All categories">
                <h2>Categories</h2>
                <ul>
                  {catalogCategories.map(c => {
                    const slug = slugify(c.name);
                    return <li key={slug}><Link to="/categories/$cat" params={{ cat: slug }} aria-current={slug === cat ? "page" : undefined} className={slug === cat ? "on" : ""}>{c.name}</Link></li>;
                  })}
                </ul>
              </nav>
            </aside>

            <div className="cg-results">
              {/* phone: age row */}
              {ages.length > 0 && (
                <section className="cg-age cg-phone" aria-labelledby="cg-age-h">
                  <div className="cg-age-head"><Teddy className="cg-float-sm" /><h2 id="cg-age-h">Your baby's age</h2></div>
                  <div className="cg-hscroll">
                    {[{ id: "any" as const, label: "All ages" }, ...ages].map(a => (
                      <button key={a.id} type="button" aria-pressed={s.age === a.id} className={`cg-age-btn ${s.age === a.id ? "on" : ""}`} onClick={() => patch({ age: a.id })}>{a.label}</button>
                    ))}
                  </div>
                </section>
              )}
              {/* phone: quick chips */}
              {quick.length > 0 && (
                <section className="cg-quick cg-hscroll cg-phone" aria-label="Quick filters">
                  {quick.map(q => {
                    const on = s.quick.includes(q.id);
                    return <button key={q.id} type="button" aria-pressed={on} className={`cg-qchip ${on ? "on" : ""}`} onClick={() => patch({ quick: toggle(s.quick, q.id) })}>{on && <IcCheck />}{q.label}</button>;
                  })}
                </section>
              )}

              {/* desktop toolbar */}
              <div className="cg-dtools">
                <div className="cg-dquick" aria-label="Quick filters" role="group">
                  {quick.map(q => {
                    const on = s.quick.includes(q.id);
                    return <button key={q.id} type="button" aria-pressed={on} className={`cg-qchip ${on ? "on" : ""}`} onClick={() => patch({ quick: toggle(s.quick, q.id) })}>{on && <IcCheck />}{q.label}</button>;
                  })}
                </div>
                <div className="cg-dright">
                  <div className="cg-sortwrap" ref={menuRef}>
                    <button type="button" className="cg-sortbtn" aria-haspopup="true" aria-expanded={sortMenu} onClick={() => setSortMenu(v => !v)}>
                      <IcSort /><span className="cg-sortname"><span className="cg-sortpre">Sort: </span>{sortName}</span><IcChev />
                    </button>
                    {sortMenu && <div className="cg-sortmenu cg-fade">{sortOptions(() => setSortMenu(false))}</div>}
                  </div>
                  <ViewToggle view={view} setView={setView} />
                </div>
              </div>

              {activeCount > 0 && (
                <div className="cg-active cg-fade">
                  <span>{list.length} results · {activeCount} {activeCount === 1 ? "filter" : "filters"} on</span>
                  <button type="button" className="cg-link" onClick={clearAll}>Clear all</button>
                </div>
              )}

              {list.length > 0 ? (
                <>
                  <section aria-label={`${listing.name} products`} className={`cg-grid ${view}`}>{items}</section>
                  <div className="cg-end"><svg className="cg-bounce" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="url(#hdYellow)" /></svg><span>You've seen everything here</span></div>
                </>
              ) : (
                <div className="cg-empty cg-fade">
                  <Teddy w={120} sad className="cg-float" />
                  {all.length === 0 ? (
                    <>
                      <h2>Nothing here yet</h2>
                      <p>We don't have products in this category right now. Browse our other categories instead.</p>
                      <Link to="/categories" className="cg-bigbtn">See all categories</Link>
                    </>
                  ) : (
                    <>
                      <h2>Oops, nothing here yet</h2>
                      <p>No products match all your filters. Try removing one or two.</p>
                      <button type="button" className="cg-bigbtn" onClick={clearAll}>Clear all filters</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- phone floating cart + tabs ---------- */}
        {t.count > 0 && (
          <Link to="/cart" className="cg-cartbar cg-pop">
            <span className="cg-cartbar-ic"><IcCart s={18} /></span>
            <span className="cg-cartbar-txt"><b>{t.count} items · {money(t.net)}</b><span>{freeNote}</span></span>
            <span className="cg-cartbar-go">View cart →</span>
          </Link>
        )}
        <MobileTabBar active="categories" />

        {/* ---------- sheets ---------- */}
        {sheet === "sort" && (
          <div className="cg-sheetwrap">
            <button type="button" aria-label="Close sort" className="cg-scrim" onClick={() => setSheet(null)} tabIndex={-1} />
            <div role="dialog" aria-modal="true" aria-labelledby="cg-sort-h" className="cg-sheet" ref={sheetRef} tabIndex={-1}>
              <div className="cg-grab" aria-hidden="true" />
              <div className="cg-sheet-head">
                <h2 id="cg-sort-h">Sort by</h2>
                <button type="button" className="cg-x" aria-label="Close" onClick={() => setSheet(null)}><IcClose /></button>
              </div>
              {sortOptions(() => setSheet(null))}
            </div>
          </div>
        )}
        {sheet === "filter" && (
          <div className="cg-sheetwrap">
            <button type="button" aria-label="Close filters" className="cg-scrim" onClick={() => setSheet(null)} tabIndex={-1} />
            <div role="dialog" aria-modal="true" aria-labelledby="cg-filter-h" className="cg-sheet cg-fsheet" ref={sheetRef} tabIndex={-1}>
              <div className="cg-fsheet-top">
                <div className="cg-grab" aria-hidden="true" />
                <div className="cg-sheet-head">
                  <h2 id="cg-filter-h">Filters</h2>
                  <div className="cg-sheet-acts">
                    <button type="button" className="cg-link" onClick={resetSheet}>Reset</button>
                    <button type="button" className="cg-x" aria-label="Close" onClick={() => setSheet(null)}><IcClose /></button>
                  </div>
                </div>
              </div>
              <div className="cg-fsheet-body">{filterBody(false)}</div>
              <div className="cg-fsheet-foot">
                <button type="button" className="cg-showbtn" onClick={() => setSheet(null)}>
                  {list.length ? `Show ${list.length} ${list.length === 1 ? "product" : "products"}` : "No matches. Try fewer filters"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

/* ---------------- pieces ---------------- */

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="cg-group">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

function ViewToggle({ view, setView }: { view: "grid" | "list"; setView: (v: "grid" | "list") => void }) {
  return (
    <div role="group" aria-label="Layout" className="cg-view">
      <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}><IcGrid /></button>
      <button type="button" aria-label="List view" aria-pressed={view === "list"} className={view === "list" ? "on" : ""} onClick={() => setView("list")}><IcList /></button>
    </div>
  );
}

function SubTile({ label, on, onPick, bg, children }: { label: string; on: boolean; onPick: () => void; bg: string; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={on} className={`cg-sub ${on ? "on" : ""}`} onClick={onPick}>
      <span className="cg-sub-art" style={{ background: bg }}>{children}</span>
      <span className="cg-sub-label">{label}</span>
    </button>
  );
}

function PromoBanner() {
  return (
    <Link to="/cart" className="cg-banner cg-fade">
      <span className="cg-banner-blob" aria-hidden="true" />
      <span className="cg-banner-shine cg-shimmer" aria-hidden="true" />
      <span className="cg-banner-copy">
        <span className="cg-banner-kicker">FREE DELIVERY</span>
        <span className="cg-banner-title">On orders over ৳{tk(FREE_DELIVERY)}</span>
        <span className="cg-banner-cta">Check your cart →</span>
      </span>
      <svg className="cg-float cg-banner-art" width="96" height="84" viewBox="0 0 96 84" aria-hidden="true">
        <path d="M8 24h56v12c0 20-12 32-28 32S8 56 8 36z" fill="url(#hdWhite)" /><rect x="8" y="24" width="56" height="10" rx="3" fill="url(#hdBlue)" />
        <rect x="50" y="46" width="42" height="28" rx="8" fill="url(#hdMint)" /><ellipse cx="71" cy="55" rx="9" ry="4.5" fill="url(#hdWhite)" />
        <rect x="62" y="6" width="26" height="9" rx="3" fill="url(#hdPink)" /><rect x="61" y="14" width="28" height="22" rx="5" fill="url(#hdWhite)" />
      </svg>
    </Link>
  );
}

function ProductCard({ p, view, wished, onWish, qty, onInc, onDec }: {
  p: Product; view: "grid" | "list"; wished: boolean; onWish: () => void; qty: number; onInc: (el: HTMLElement) => void; onDec: () => void;
}) {
  const pct = off(p);
  const badge = pct > 0 ? `-${pct}%` : p.badge;
  return (
    <article className={`cg-card ${view} cg-fade`}>
      <div className="cg-card-img" style={{ background: tintOf(p.slug) }}>
        <Link to="/product/$slug" params={{ slug: p.slug }} tabIndex={-1} aria-hidden="true" className="cg-card-imglink">
          <img src={p.image} alt="" loading="lazy" />
        </Link>
        {badge && <span className={`cg-card-badge ${pct > 0 ? "sale" : ""}`}>{badge}</span>}
        <button type="button" aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`} aria-pressed={wished} className={`cg-wish ${wished ? "cg-pop" : ""}`} onClick={onWish}>
          <IcHeart on={wished} />
        </button>
      </div>
      <div className="cg-card-info">
        <span className="cg-card-brand">{p.brand}</span>
        <h3><Link to="/product/$slug" params={{ slug: p.slug }}>{p.name}</Link></h3>
        <div className="cg-card-meta">
          <span className="cg-card-pill">{sizeLabel(p)}</span>
          <span className="cg-card-rate"><span aria-hidden="true">★</span> {p.rating.toFixed(1)} <span className="cg-card-rev">({p.reviews})</span><span className="sr-only"> stars from {p.reviews} reviews</span></span>
        </div>
        <div className="cg-card-foot">
          <div className="cg-card-price">
            <div className="cg-price">{money(p.price)}</div>
            {p.old > p.price && <s>{money(p.old)}</s>}
          </div>
          {qty > 0 ? (
            <div className="cg-stepper cg-pop">
              <button type="button" aria-label={`Remove one ${p.name}`} onClick={onDec}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
              <span aria-live="polite" aria-label={`${qty} in cart`}>{qty}</span>
              <button type="button" aria-label={`Add one more ${p.name}`} onClick={e => onInc(e.currentTarget)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
            </div>
          ) : (
            <button type="button" className="cg-add" aria-label={`Add ${p.name} to cart`} onClick={e => onInc(e.currentTarget)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
