import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { tk, off, type Product } from "@/lib/products";
import {
  DEAL_TINTS, RANK_COLORS, TREND_TINTS, maxOff, saleCount, shortName, tickerLabel, topDeals, topTrending,
} from "@/lib/header-data";
import { useBumpKey, useMotionPaused, useReducedMotion, useTypewriter } from "@/lib/motion";

/* ------------------------------------------------------------------ icons */
const PauseIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
);
const PlayIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" /></svg>
);
export const LogoMark = ({ w, h }: { w: number; h: number }) => (
  <svg width={w} height={h} viewBox="0 0 44 40" aria-hidden="true"><path d="M22 38C8 28 2 20 2 12 2 6 7 2 12.5 2c4 0 7.5 2.3 9.5 5.6C24 4.3 27.5 2 31.5 2 37 2 42 6 42 12c0 8-6 16-20 26z" fill="#f0457a" /><circle cx="22" cy="18" r="9" fill="#ffdcc6" /><circle cx="19" cy="17" r="1.3" fill="#2a1650" /><circle cx="25" cy="17" r="1.3" fill="#2a1650" /><path d="M19 21q3 2.6 6 0" fill="none" stroke="#c2334a" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
export const SearchIco = ({ s, w }: { s: number; w: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#6d3bea" strokeWidth={w} strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const StarIco = ({ s, className }: { s: number; className?: string }) => (
  <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="#f5b400" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.3l6.6-.8z" /></svg>
);
export const HeartIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
);
export const CartIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></svg>
);
export const UserIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const GridIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
);
export const TagIco = ({ s, className }: { s: number; className?: string }) => (
  <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={className ? 2.4 : 2.3} strokeLinejoin="round" aria-hidden="true"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" /></svg>
);
const FlameIco = ({ w, h, white }: { w: number; h: number; white?: boolean }) => (
  <svg className="hm-flame" width={w} height={h} viewBox="0 0 24 26" aria-hidden="true">
    <path d="M12 1c1.2 3.6-1.4 5.6-1.4 8.2a2.6 2.6 0 0 0 5.2.3c0-1.1-.4-2-1-3 2.6 1.8 4.7 4.9 4.7 8.6A7.5 7.5 0 0 1 4.5 15c0-4.4 3.3-6.6 4.4-10 .6 1.7 1.6 2.8 3 3.4C11.4 6 11.2 3.4 12 1z" fill={white ? "#fff" : "#ff7a1a"} />
    {!white && <path d="M12 13c1.8 1.4 3 3 3 5a3 3 0 0 1-6 0c0-1.6.9-2.6 1.7-3.6.2.9.7 1.4 1.3 1.6-.4-1-.4-2 0-3z" fill="#ffd166" />}
  </svg>
);
const PlusIco = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
);
const CamIco = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
const XIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
);

const price = (n: number) => "৳ " + tk(n);
const POINTS = 320;

/* ------------------------------------------------------------ announcement */
const MESSAGES: [string, string][] = [
  ["✦ Free delivery on orders over ৳3,000", ""],
  ["✦ Free gift wrapping on every order", ""],
  ["✦ Cash on delivery all over Bangladesh", "#ffd166"],
  ["✦ Earn Little Stars points on every taka", ""],
  [`✦ Up to ${maxOff}% off in Offers`, "#ffb3cb"],
];

export function HmAnnouncement() {
  const [paused, toggle] = useMotionPaused();
  const row = (k: string) => MESSAGES.map(([t, c], i) => <span key={k + i} style={c ? { color: c } : undefined} aria-hidden={k === "b" || undefined}>{t}</span>);
  return (
    <div className="hm-root hm-announce" aria-label="Store announcements">
      <div className="hm-marq">{row("a")}{row("b")}</div>
      <button type="button" className="hm-pause" aria-pressed={paused} onClick={toggle}>
        {paused ? <PlayIco s={14} /> : <PauseIco s={14} />} {paused ? "Play motion" : "Pause motion"}
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- search */
const D_PHRASES = ["diapers for newborns", "Aptamil formula", "baby gift sets", "Johnson’s baby shampoo", "feeding bottles"];
const M_PHRASES = ["diapers for newborns", "Aptamil formula", "baby gift sets", "feeding bottles"];

function useSearchBox(phrases: string[], fallback: string) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [paused] = useMotionPaused();
  const reduced = useReducedMotion();
  const typed = useTypewriter(phrases, !focus && !q && !paused && !reduced);
  const navigate = useNavigate();
  return {
    input: {
      value: q,
      onChange: (e: { target: { value: string } }) => setQ(e.target.value),
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      placeholder: typed ?? fallback,
    },
    submit: (e: FormEvent) => {
      e.preventDefault();
      navigate({ to: "/search", search: { q: q.trim() } });
    },
  };
}

/* --------------------------------------------------------------- desktop */
type MenuKey = "mega" | "offers" | "trending" | null;

function useShift(open: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [dx, setDx] = useState(0);
  useLayoutEffect(() => {
    if (!open || !ref.current) {
      setDx(0);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    const over = r.right - dx - (document.documentElement.clientWidth - 12);
    setDx(over > 0 ? over : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { ref, style: dx ? { left: -dx } : undefined };
}

function OffersPanel({ open }: { open: boolean }) {
  const { add } = useCart();
  const shift = useShift(open);
  if (!open) return null;
  return (
    <div className="hm-panel hm-panel-offers" ref={shift.ref} style={shift.style}>
      <div className="hm-panel-head">
        <div><span className="hm-eyebrow" style={{ color: "#c21e55" }}>BIGGEST DISCOUNTS RIGHT NOW</span><h3 className="hm-bl hm-panel-title">{saleCount} products on sale</h3></div>
        <Link to="/offers" className="hm-under">Under ৳500 →</Link>
      </div>
      <div className="hm-pgrid">
        {topDeals.map((p, i) => (
          <article className="hm-pcard" key={p.slug}>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="hm-pimg" style={{ background: DEAL_TINTS[i] }}>
              <img src={p.image} alt={shortName(p)} /><span className="hm-off">-{off(p)}%</span>
            </Link>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="hm-pname">{shortName(p)}</Link>
            <div className="hm-prow">
              <span><b className="hm-bl hm-pprice">{price(p.price)}</b><s className="hm-pold">{price(p.old)}</s></span>
              <button type="button" className="hm-add" aria-label={`Add ${shortName(p)} to cart`} onClick={(e) => add(p, p.sizes[0], 1, e.currentTarget)}><PlusIco s={16} /></button>
            </div>
          </article>
        ))}
      </div>
      <Link to="/offers" className="hm-seeall">See all {saleCount} deals →</Link>
    </div>
  );
}

function TrendRow({ p, i, mobile }: { p: Product; i: number; mobile?: boolean }) {
  return (
    <Link to="/product/$slug" params={{ slug: p.slug }} className={mobile ? "hm-m-trow" : "hm-trow"}>
      <span className="hm-bl hm-rank" style={{ color: RANK_COLORS[i] }}>{i + 1}</span>
      <span className="hm-timg" style={{ background: TREND_TINTS[i] }}><img src={p.image} alt="" /></span>
      <span className="hm-tbody"><b>{shortName(p)}</b><small>★ {p.rating} <span>· {p.reviews} reviews</span></small></span>
      <b className="hm-bl hm-tprice">{mobile ? "৳" + tk(p.price) : price(p.price)}</b>
    </Link>
  );
}

function TrendingPanel({ open }: { open: boolean }) {
  const shift = useShift(open);
  if (!open) return null;
  return (
    <div className="hm-panel hm-panel-trend" ref={shift.ref} style={shift.style}>
      <span className="hm-eyebrow" style={{ color: "#b06d00" }}>MOST-REVIEWED BY PARENTS</span>
      <h3 className="hm-bl hm-panel-title">Trending at Baby Choice</h3>
      <div className="hm-tlist">{topTrending.map((p, i) => <TrendRow key={p.slug} p={p} i={i} />)}</div>
      <Link to="/trending" className="hm-seetrend">See all trending →</Link>
    </div>
  );
}

/** Desktop header (≥900px). `catLink` renders a category link, `megaPanel` the All categories mega menu. */
export function HmHeader({
  catLinks,
  megaPanel,
}: {
  catLinks: (cls: string) => ReactNode;
  megaPanel: (close: () => void) => ReactNode;
}) {
  const { lines, wish } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const bump = useBumpKey(count);
  const search = useSearchBox(D_PHRASES, "Search diapers, formula, toys, brands…");
  const [open, setOpen] = useState<MenuKey>(null);
  const timer = useRef<number | undefined>(undefined);
  const clear = () => window.clearTimeout(timer.current);
  useEffect(() => clear, []);
  const pills = useRef<Record<string, HTMLAnchorElement | null>>({});

  const menuProps = (k: "offers" | "trending") => ({
    onMouseEnter: () => { clear(); timer.current = window.setTimeout(() => setOpen(k), 120); },
    onMouseLeave: () => { clear(); timer.current = window.setTimeout(() => setOpen((o) => (o === k ? null : o)), 200); },
    onFocus: () => { clear(); setOpen(k); },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen((o) => (o === k ? null : o));
    },
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && open === k) { setOpen(null); pills.current[k]?.focus(); }
    },
  });

  return (
    <header className="hm-root hm-header">
      <div className="hm-top">
        <Link to="/" className="hm-logo" aria-label="Baby Choice home">
          <LogoMark w={46} h={42} />
          <span className="hm-logo-text"><b className="hm-bl">Baby<span>Choice</span></b><small>Everything for your little one</small></span>
        </Link>
        <form role="search" className="hm-search" onSubmit={search.submit}>
          <SearchIco s={20} w={2.5} />
          <label htmlFor="hm-dq" className="hm-sr">Search products</label>
          <input id="hm-dq" type="search" {...search.input} />
          <Link to="/search" search={{ q: "" }} className="hm-photo" aria-label="Search by photo"><CamIco /></Link>
          <button type="submit" className="hm-search-btn">Search</button>
        </form>
        <Link to="/account" className="hm-points" aria-label={`Little Stars, ${POINTS} points`}>
          <StarIco s={22} className="hm-star" />
          <span><b>{POINTS}</b><small>points</small></span>
        </Link>
        <Link to="/wishlist" className="hm-wish" aria-label={`Wishlist, ${wish.length} items`}>
          <HeartIco s={22} />
          {wish.length > 0 && <span className="hm-wbadge">{wish.length}</span>}
        </Link>
        <Link to="/account" className="hm-account"><UserIco s={20} />Account</Link>
        <Link to="/cart" className="hm-cart" aria-label={`Cart, ${count} items`}>
          <CartIco s={22} />Cart <span key={bump} className={`hm-cart-count ${bump ? "hm-bump" : ""}`}>{count}</span>
        </Link>
      </div>
      <nav aria-label="Main" className="hm-nav">
        <button type="button" className="hm-allcats" aria-expanded={open === "mega"} onClick={() => setOpen((o) => (o === "mega" ? null : "mega"))}>
          <GridIco s={18} />All categories
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={open === "mega" ? { transform: "rotate(180deg)" } : undefined}><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div className="hm-menu hm-menu-offers" {...menuProps("offers")}>
          <Link to="/offers" className="hm-ofr" aria-haspopup="true" aria-expanded={open === "offers"} ref={(el) => { pills.current.offers = el; }}>
            <TagIco s={18} className="hm-tagic" />Offers
          </Link>
          <span className="hm-pct" aria-hidden="true">-{maxOff}%</span>
          <OffersPanel open={open === "offers"} />
        </div>
        <div className="hm-menu" {...menuProps("trending")}>
          <Link to="/trending" className="hm-trd" aria-haspopup="true" aria-expanded={open === "trending"} ref={(el) => { pills.current.trending = el; }}>
            <FlameIco w={18} h={20} /> Trending{" "}
            <span className="hm-rk" aria-hidden="true"><span className="hm-rk-col">{[...topTrending, topTrending[0]!].map((p, i) => <span key={i}>{tickerLabel(p, i % 3)}</span>)}</span></span>
          </Link>
          <TrendingPanel open={open === "trending"} />
        </div>
        <Link to="/trending" className="hm-navlink hm-newin"><span className="hm-dot" />New in</Link>
        <span className="hm-divider" />
        <div className="hm-navscroll">{catLinks("hm-navlink")}</div>
      </nav>
      {open === "mega" && megaPanel(() => setOpen(null))}
    </header>
  );
}

/* ---------------------------------------------------------------- mobile */
const M_MESSAGES: [string, string][] = [
  ["✦ Cash on delivery all over Bangladesh", "#ffd166"],
  ["✦ Free delivery over ৳3,000", ""],
  [`✦ Up to ${maxOff}% off in Offers`, "#ffb3cb"],
];
const PEEK_KEY = "bc-peek-done";
const topDeal = topDeals[0]!;
const topTrend = topTrending[0]!;

type PeekKind = "offers" | "trending" | null;

export function MobileHeaderMotion() {
  const { lines, wish, add } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [paused, toggle] = useMotionPaused();
  const reduced = useReducedMotion();
  const search = useSearchBox(M_PHRASES, "Search diapers, formula, brands…");
  const [peek, setPeek] = useState<PeekKind>(null);
  const [done, setDone] = useState(true);
  const layer = useRef<HTMLDivElement>(null);
  const circles = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pos, setPos] = useState({ offers: 47, trending: 121 });

  useEffect(() => {
    try { setDone(sessionStorage.getItem(PEEK_KEY) === "1"); } catch { setDone(false); }
  }, []);
  const stop = () => {
    setDone(true);
    setPeek(null);
    try { sessionStorage.setItem(PEEK_KEY, "1"); } catch { /* storage unavailable */ }
  };

  useEffect(() => {
    if (paused) { if (!done) stop(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    if (done || reduced || paused) return;
    const steps: [PeekKind, number][] = [[null, 1500]];
    for (let c = 0; c < 3; c++) steps.push(["offers", 4500], [null, 3300], ["trending", 4500], [null, 2800]);
    let i = 0;
    let t: number;
    const next = () => {
      const [kind, ms] = steps[i]!;
      setPeek(kind);
      i++;
      if (i < steps.length) t = window.setTimeout(next, ms);
    };
    next();
    const onScroll = () => { if (window.scrollY > 40) stop(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, reduced, paused]);

  useLayoutEffect(() => {
    const measure = () => {
      const base = layer.current?.getBoundingClientRect().left ?? 0;
      const c = (k: string, d: number) => { const r = circles.current[k]?.getBoundingClientRect(); return r ? r.left + r.width / 2 - base : d; };
      setPos({ offers: c("offers", 47), trending: c("trending", 121) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [peek]);

  const peekProps = (k: "offers" | "trending") => {
    const on = peek === k;
    return {
      className: `hm-m-peek ${on ? "on" : ""}`,
      "aria-hidden": on ? undefined : true,
      inert: !on,
      style: { "--ox": `${pos[k] - 1}px` } as React.CSSProperties,
    };
  };
  const highlights = useMemo(() => [
    { k: "under", to: "/offers" as const, bg: "#fff4d1", label: "Under ৳500", inner: <b className="hm-bl" style={{ fontSize: 15, color: "#8a5a00" }}>৳500</b> },
    { k: "gifts", to: "/categories/$cat" as const, bg: "#ffe6ef", label: "Gift sets", inner: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c21e55" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M2 9h20M12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z" /></svg> },
    { k: "brands", to: "/brands" as const, bg: "#f1eaff", label: "Brands", inner: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d3bea" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.3 6.8 19l1-5.8L3.6 9.1l5.8-.8z" /></svg> },
  ], []);

  return (
    <div className="hm-m-root">
      <div className="hm-m-announce">
        <div className="hm-m-annwin"><div className="hm-m-ann">{[...M_MESSAGES, M_MESSAGES[0]!].map(([t, c], i) => <span key={i} style={c ? { color: c } : undefined} aria-hidden={i === 3 || undefined}>{t}</span>)}</div></div>
        <button type="button" className="hm-m-pause" aria-label={paused ? "Play motion" : "Pause motion"} aria-pressed={paused} onClick={toggle}>
          {paused ? <PlayIco s={12} /> : <PauseIco s={12} />}
        </button>
      </div>
      <header className="hm-m-header">
        <div className="hm-m-row">
          <Link to="/" className="hm-m-logo" aria-label="Baby Choice home"><LogoMark w={28} h={26} /><b className="hm-bl">Baby<span>Choice</span></b></Link>
          <span className="hm-m-grow" />
          <Link to="/account" className="hm-m-points" aria-label={`Little Stars, ${POINTS} points`}><StarIco s={14} />{POINTS}</Link>
          <Link to="/wishlist" className="hm-m-ib" aria-label={`Wishlist, ${wish.length} items`}><HeartIco s={19} />{wish.length > 0 && <span className="hm-m-cnt" style={{ background: "#f0457a" }}>{wish.length}</span>}</Link>
          <Link to="/cart" className="hm-m-ib hm-m-cart" aria-label={`Cart, ${count} items`}><CartIco s={18} /><span className="hm-m-cnt" style={{ background: "#2a1650" }}>{count}</span></Link>
        </div>
        <form role="search" className="hm-m-search" onSubmit={search.submit}>
          <SearchIco s={16} w={2.6} />
          <label htmlFor="hm-mq" className="hm-sr">Search products</label>
          <input id="hm-mq" type="search" {...search.input} />
          <button type="submit">Search</button>
        </form>
        <nav aria-label="Highlights" className="hm-m-stories">
          <Link to="/offers" className="hm-m-story" ref={(el) => { circles.current.offers = el; }}>
            <span className="hm-m-ring pink"><span className="hm-m-in" style={{ background: DEAL_TINTS[0] }}><img src={topDeal.image} alt="" /></span><span className="hm-m-tagp" style={{ background: "#c21e55" }}>-{maxOff}%</span></span>Offers
          </Link>
          <Link to="/trending" className="hm-m-story" ref={(el) => { circles.current.trending = el; }}>
            <span className="hm-m-ring orange"><span className="hm-m-in" style={{ background: TREND_TINTS[0] }}><img src={topTrend.image} alt="" /></span><span className="hm-m-tagp" style={{ background: "#ff7a1a" }}><FlameIco w={9} h={10} white />HOT</span></span>Trending
          </Link>
          <Link to="/trending" className="hm-m-story">
            <span className="hm-m-ring green"><span className="hm-m-in" style={{ background: "#e2f8ee" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="#1fae73" aria-hidden="true"><path d="M12 2l1.8 5.6L19.5 9.4l-5.7 1.8L12 17l-1.8-5.8-5.7-1.8 5.7-1.8zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z" /></svg></span><span className="hm-m-tagp" style={{ background: "#1fae73" }}>NEW</span></span>New in
          </Link>
          {highlights.map((h) => (
            <Link key={h.k} to={h.to} params={h.to === "/categories/$cat" ? { cat: "gifts-and-hampers" } : undefined} className="hm-m-story">
              <span className="hm-m-ring calm"><span className="hm-m-in" style={{ background: h.bg }}>{h.inner}</span></span>{h.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="hm-m-peeks" ref={layer}>
        <div {...peekProps("offers")}>
          <span className="hm-m-arrow" style={{ left: pos.offers - 15 }} />
          <button type="button" className="hm-m-x" aria-label="Close preview" onClick={stop}><XIco /></button>
          <span className="hm-m-eyebrow" style={{ color: "#c21e55" }}>TODAY’S BIGGEST DISCOUNT</span>
          <div className="hm-m-deal">
            <Link to="/product/$slug" params={{ slug: topDeal.slug }} className="hm-m-dimg" style={{ background: DEAL_TINTS[0] }}><img src={topDeal.image} alt={shortName(topDeal)} /><span>-{off(topDeal)}%</span></Link>
            <div className="hm-m-dbody">
              <Link to="/product/$slug" params={{ slug: topDeal.slug }} className="hm-m-dname">{shortName(topDeal)}</Link>
              <span className="hm-m-dprice"><b className="hm-bl">{price(topDeal.price)}</b><s>{price(topDeal.old)}</s><span>Save {price(topDeal.old - topDeal.price)}</span></span>
            </div>
            <button type="button" className="hm-add" aria-label={`Add ${shortName(topDeal)} to cart`} onClick={(e) => { add(topDeal, topDeal.sizes[0], 1, e.currentTarget); stop(); }}><PlusIco s={15} /></button>
          </div>
          <Link to="/offers" className="hm-m-see" style={{ background: "#fff0f5", color: "#c21e55" }}>See all {saleCount} deals →</Link>
          <span className="hm-m-bar"><span style={{ background: "#f0457a" }} /></span>
        </div>
        <div {...peekProps("trending")}>
          <span className="hm-m-arrow" style={{ left: pos.trending - 15 }} />
          <button type="button" className="hm-m-x" aria-label="Close preview" onClick={stop}><XIco /></button>
          <span className="hm-m-eyebrow" style={{ color: "#b06d00" }}>TRENDING NOW · MOST REVIEWED</span>
          <div className="hm-m-tlist">{topTrending.map((p, i) => <TrendRow key={p.slug} p={p} i={i} mobile />)}</div>
          <Link to="/trending" className="hm-m-see" style={{ background: "#fff3e2", color: "#8a4a00" }}>See all trending →</Link>
          <span className="hm-m-bar"><span style={{ background: "#ff7a1a" }} /></span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- tab icons */
export const HomeIco = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
);
