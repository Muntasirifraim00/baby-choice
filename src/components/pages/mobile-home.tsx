import { brandSlug } from "@/lib/brands";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Heart,
  Lightbulb,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useCart, FREE_DELIVERY } from "@/lib/cart-store";
import { getProduct, off, pick, tk, type Product } from "@/lib/products";
import { slugify } from "@/lib/live-head";
import { MobileTabBar } from "@/components/pages/page-shell";
import heroMain from "@/assets/home/hero-main.png.asset.json";
import heroBath from "@/assets/home/hero-bath.png.asset.json";
import heroFeeding from "@/assets/home/hero-feeding.png.asset.json";
import catClothing from "@/assets/home/cat-clothing.png";
import catFeeding from "@/assets/home/cat-feeding.png";
import catDiapering from "@/assets/home/cat-diapering.png";
import catToys from "@/assets/home/cat-toys.png";
import catGear from "@/assets/home/cat-gear.png";
import catBath from "@/assets/home/cat-bath.png";
import catFormula from "@/assets/home/cat-formula.png";
import catGifts from "@/assets/home/cat-gifts.png";
import stageNew from "@/assets/home/stage-new.png";
import stage6m from "@/assets/home/stage-6m.png";
import stage12m from "@/assets/home/stage-12m.png";
import stage2y from "@/assets/home/stage-2y.png";
import stage4y from "@/assets/home/stage-4y.png";

/* Phone homepage (< 900px). Built from the approved "Main.dc" phone design. */

/* ------------------------------------------------------------------ data */

/** Per-product tile colour and short benefit tag from the design. */
const LOOK: Record<string, { bg: string; tag: string }> = {
  "pampers-new-baby-diapers": { bg: "#e9f2ff", tag: "Soft & dry protection" },
  "johnsons-baby-wipes": { bg: "#e2f8ee", tag: "Extra gentle" },
  "aptamil-advance-follow-on-milk": { bg: "#fff4d1", tag: "Follow-on formula" },
  "chicco-feeding-bottle": { bg: "#eaf2ff", tag: "BPA-free" },
  "nestle-cerelac-wheat-apple": { bg: "#fff0e4", tag: "First foods" },
  "johnsons-baby-shampoo": { bg: "#fff4d1", tag: "No more tears" },
  "cetaphil-baby-wash": { bg: "#e2f8ee", tag: "Organic calendula" },
  "baby-play-mat": { bg: "#f1eaff", tag: "Activity gym" },
  "baby-rattle-set": { bg: "#ffeef4", tag: "5 colourful rattles" },
  "sudocrem-nappy-rash-cream": { bg: "#ffeef4", tag: "Nappy rash care" },
  "philips-avent-bottle-set": { bg: "#e6f2ff", tag: "BPA-free · 3 pcs" },
  "johnsons-baby-care-gift-set": { bg: "#ffe6ef", tag: "Gift box" },
  "nuby-sippy-cup": { bg: "#e2f8ee", tag: "Spill-proof" },
  "aveeno-baby-lotion": { bg: "#f1eaff", tag: "Daily moisture" },
};
const look = (p: Product) => LOOK[p.slug] ?? { bg: "#f1eaff", tag: p.sub };
const money = (n: number) => "৳" + tk(n);

/** Short display names, so long catalogue names fit the phone cards. */
const SHORT: Record<string, string> = {
  "sudocrem-nappy-rash-cream": "Sudocrem Nappy Rash Cream",
  "aptamil-advance-follow-on-milk": "Aptamil Advance Follow On Milk",
};
const nameOf = (p: Product) => SHORT[p.slug] ?? p.name;

type StageId = "nb" | "m6" | "m12" | "y2" | "y4";
const STAGES: { id: StageId; label: string; sub: string; long: string; caps: string; tip: string; picks: string[]; img: string }[] = [
  {
    id: "nb", img: stageNew, label: "New", sub: "0–3 mo", long: "Newborn, 0–3 months", caps: "NEWBORNS",
    tip: "Newborns go through 8–12 diapers a day. Keep a spare pack and wipes in the bag.",
    picks: ["pampers-new-baby-diapers", "johnsons-baby-wipes", "johnsons-baby-shampoo", "sudocrem-nappy-rash-cream"],
  },
  {
    id: "m6", img: stage6m, label: "3–6", sub: "months", long: "Baby, 3–6 months", caps: "3–6 MONTHS",
    tip: "Rattles and play mats help with reaching, grabbing and rolling.",
    picks: ["chicco-feeding-bottle", "baby-rattle-set", "baby-play-mat", "aveeno-baby-lotion"],
  },
  {
    id: "m12", img: stage12m, label: "6–12", sub: "months", long: "Baby, 6–12 months", caps: "6–12 MONTHS",
    tip: "Starting solids? Begin with single-grain cereals and one new food at a time.",
    picks: ["nestle-cerelac-wheat-apple", "aptamil-advance-follow-on-milk", "nuby-sippy-cup", "cetaphil-baby-wash"],
  },
  {
    id: "y2", img: stage2y, label: "1–2", sub: "years", long: "Toddler, 1–2 years", caps: "1–2 YEARS",
    tip: "Spill-proof cups make the switch from bottles easier.",
    picks: ["nuby-sippy-cup", "baby-play-mat", "cetaphil-baby-wash", "johnsons-baby-wipes"],
  },
  {
    id: "y4", img: stage4y, label: "2–4", sub: "years", long: "Little one, 2–4 years", caps: "2–4 YEARS",
    tip: "Gentle bath care and a calm routine help bedtime go smoothly.",
    picks: ["johnsons-baby-care-gift-set", "aveeno-baby-lotion", "johnsons-baby-shampoo", "philips-avent-bottle-set"],
  },
];
const STAGE_KEY = "baby-choice-stage";

type Slide = {
  tag: string; title: string; sub: string; cta: string; bg: string; blob: string; ink: string; img: string; alt: string;
  cat: string;
};
const SLIDES: Slide[] = [
  {
    tag: "NEW ARRIVALS", title: "Everything for\nyour little one", sub: "Up to 30% OFF on soft, safe picks for your newest family member.",
    cta: "Shop newborn", bg: "#ffe3ec", blob: "#ffcadb", ink: "#c21e55", img: heroMain.url, alt: "Baby in a bear hoodie",
    cat: "baby-clothing",
  },
  {
    tag: "BATH TIME", title: "Gentle care for\nhappy baths", sub: "Mild washes, towels and toys for giggly baths.",
    cta: "Shop bath", bg: "#ddf1ff", blob: "#c7e6ff", ink: "#2f5bd3", img: heroBath.url, alt: "Baby at bath time",
    cat: "bath-and-hygiene",
  },
  {
    tag: "FEEDING", title: "Healthy beginnings\nevery day", sub: "Bottles, bowls and weaning picks for little appetites.",
    cta: "Shop feeding", bg: "#fff1c4", blob: "#ffe59a", ink: "#8a5a00", img: heroFeeding.url, alt: "Baby at feeding time",
    cat: "feeding-and-nursing",
  },
];

const CATS = [
  { label: "Diapers", img: catDiapering, bg: "#e9f2ff", cat: "diapers-and-wipes" },
  { label: "Wipes", img: catDiapering, bg: "#e2f8ee", cat: "diapers-and-wipes" },
  { label: "Formula", img: catFormula, bg: "#fff4d1", cat: "baby-formula-and-milk" },
  { label: "Feeding", img: catFeeding, bg: "#e6f2ff", cat: "feeding-and-nursing" },
  { label: "Baby food", img: catFeeding, bg: "#fff0e4", cat: "feeding-and-nursing" },
  { label: "Bath", img: catBath, bg: "#fff4d1", cat: "bath-and-hygiene" },
  { label: "Skin care", img: catBath, bg: "#f1eaff", cat: "skin-care" },
  { label: "Toys", img: catToys, bg: "#ffeef4", cat: "toys-and-learning" },
];

/** Popular searches: each one returns results in the current catalogue. */
const POPULAR = [
  { label: "Diapers", q: "diapers" },
  { label: "Aptamil", q: "aptamil" },
  { label: "Baby wipes", q: "wipes" },
  { label: "Bottles", q: "bottle" },
];

/** Everyday essentials shown when there is no past order to reorder from. */
const ESSENTIALS: [string, string][] = [
  ["pampers-new-baby-diapers", "M"],
  ["johnsons-baby-wipes", "120 pcs"],
  ["aptamil-advance-follow-on-milk", "800g"],
];

const DEALS = pick("nestle-cerelac-wheat-apple", "pampers-new-baby-diapers", "johnsons-baby-wipes", "baby-rattle-set", "philips-avent-bottle-set");

type Need = { label: string; dot: string } & ({ cat: string } | { q: string });
const NEEDS: Need[] = [
  { label: "Better sleep", dot: "#6d3bea", q: "bedtime" },
  { label: "Teething", dot: "#f0457a", q: "rattle" },
  { label: "Nappy rash", dot: "#f5a623", q: "nappy" },
  { label: "Starting solids", dot: "#1fae73", cat: "feeding-and-nursing" },
  { label: "Bath time", dot: "#2f7de0", cat: "bath-and-hygiene" },
  { label: "Travel & outings", dot: "#b4470f", cat: "outdoor-and-travel" },
  { label: "Hospital bag", dot: "#c21e55", cat: "baby-accessories" },
  { label: "Gifts", dot: "#4c22b8", cat: "gifts-and-hampers" },
];

const BUNDLE: [string, string][] = [
  ["pampers-new-baby-diapers", "#e9f2ff"],
  ["johnsons-baby-wipes", "#e2f8ee"],
  ["johnsons-baby-shampoo", "#fff4d1"],
  ["sudocrem-nappy-rash-cream", "#ffeef4"],
  ["cetaphil-baby-wash", "#e2f8ee"],
  ["aveeno-baby-lotion", "#f1eaff"],
];

const BRANDS = [
  { name: "Pampers", c: "#0f766e" }, { name: "Johnson’s", c: "#1e3a8a" }, { name: "Aptamil", c: "#1d4ed8" },
  { name: "Philips Avent", c: "#1e3a8a" }, { name: "Chicco", c: "#b91c1c" }, { name: "Cetaphil", c: "#0e7490" },
  { name: "Sudocrem", c: "#b91c1c" }, { name: "Nestlé", c: "#1e3a8a" },
];

const TIPS = [
  { tag: "FEEDING · 4 MIN", c: "#b06d00", bg: "#fff1c4", title: "First foods at 6 months: a gentle start" },
  { tag: "SLEEP · 5 MIN", c: "#2f5bd3", bg: "#e6f2ff", title: "Building a calm bedtime routine" },
  { tag: "DIAPERING · 3 MIN", c: "#c21e55", bg: "#ffe3ec", title: "Nappy rash: prevent it, soothe it" },
];

const sizeFor = (w: number) =>
  w <= 5 ? { label: "S", range: "3–6 kg" } : w <= 10 ? { label: "M", range: "6–11 kg" } : w <= 14 ? { label: "L", range: "9–14 kg" } : { label: "XL", range: "12–17 kg" };

/* --------------------------------------------------------------- helpers */

const pad = (n: number) => String(n).padStart(2, "0");
function useCountdownToMidnight() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const e = new Date(n);
      e.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, Math.floor((e.getTime() - n.getTime()) / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}

/** Briefly marks an item as "added" after its button is used. */
function useFlash() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const flash = (k: string) => {
    setDone((d) => ({ ...d, [k]: true }));
    window.setTimeout(() => setDone((d) => ({ ...d, [k]: false })), 1800);
  };
  return [done, flash] as const;
}

function Eyebrow({ c, children }: { c: string; children: React.ReactNode }) {
  return (
    <span className="mh-eyebrow" style={{ color: c }}>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- sections */

function TopBar() {
  const { lines, wish } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q.trim() } });
  };
  return (
    <>
      <div className="mh-announce">
        <span className="y">Cash on delivery</span>
        <span>·</span>
        <span>Free delivery over {money(FREE_DELIVERY)}</span>
      </div>
      <header className="mh-header">
        <div className="mh-header-row">
          <Link to="/" className="mh-logo" aria-label="Baby Choice home">
            <svg width="34" height="31" viewBox="0 0 44 40" aria-hidden="true">
              <path d="M22 38C8 28 2 20 2 12 2 6 7 2 12.5 2c4 0 7.5 2.3 9.5 5.6C24 4.3 27.5 2 31.5 2 37 2 42 6 42 12c0 8-6 16-20 26z" fill="#f0457a" />
              <circle cx="22" cy="18" r="9" fill="#ffdcc6" />
              <circle cx="19" cy="17" r="1.3" fill="#2a1650" />
              <circle cx="25" cy="17" r="1.3" fill="#2a1650" />
              <path d="M19 21q3 2.6 6 0" fill="none" stroke="#c2334a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>
              Baby<em>Choice</em>
            </span>
          </Link>
          <span className="mh-grow" />
          <Link to="/wishlist" className="mh-ibtn" aria-label={`Wishlist, ${wish.length} items`}>
            <Heart aria-hidden="true" />
            {wish.length > 0 && <span className="mh-wbadge">{wish.length}</span>}
          </Link>
          <Link to="/cart" className="mh-cartbtn" aria-label={`Cart, ${count} items`}>
            <ShoppingCart aria-hidden="true" />
            <span className="mh-cbadge">{count}</span>
          </Link>
        </div>
        <div className="mh-deliver">
          <MapPin aria-hidden="true" />
          Deliver to <b>[Area], Dhaka</b>
        </div>
        <form role="search" className="mh-search" onSubmit={submit}>
          <Search aria-hidden="true" />
          <label htmlFor="mh-q" className="sr-only">
            Search
          </label>
          <input
            id="mh-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search diapers, formula, brands…"
          />
          <button type="submit">Search</button>
        </form>
        <div className="mh-popular mh-scroll">
          {POPULAR.map((s) => (
            <Link key={s.label} to="/search" search={{ q: s.q }}>
              {s.label}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}

function StageCard({ stage, setStage }: { stage: (typeof STAGES)[number]; setStage: (id: StageId) => void }) {
  return (
    <section className="mh-sec">
      <div className="mh-stage">
        <span className="mh-stage-blob" />
        <div className="mh-stage-top">
          <span className="mh-stage-ico">
            <svg width="38" height="38" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="16" cy="16" r="9" fill="#c99467" />
              <circle cx="44" cy="16" r="9" fill="#c99467" />
              <circle cx="30" cy="32" r="22" fill="#d9a77a" />
              <ellipse cx="30" cy="40" rx="10" ry="7" fill="#f6dcc0" />
              <circle cx="22" cy="29" r="2.6" fill="#2b1d18" />
              <circle cx="38" cy="29" r="2.6" fill="#2b1d18" />
              <ellipse cx="30" cy="37" rx="3" ry="2.2" fill="#2b1d18" />
            </svg>
          </span>
          <div className="mh-min">
            <Eyebrow c="#ffd166">SHOPPING FOR</Eyebrow>
            <h2 className="mh-stage-title">{stage.long}</h2>
            <p className="mh-stage-note">Picks and tips below follow this age</p>
          </div>
        </div>
        <div className="mh-stage-grid" role="group" aria-label="Baby’s age">
          {STAGES.map((st) => {
            const on = st.id === stage.id;
            return (
              <button key={st.id} type="button" aria-pressed={on} className={on ? "on" : ""} onClick={() => setStage(st.id)}>
                <img src={st.img} alt="" className="mh-stage-img" loading="lazy" />
                <b>{st.label}</b>
                <small>{st.sub}</small>
              </button>
            );
          })}
        </div>
        <div className="mh-stage-tip" aria-live="polite">
          <Lightbulb aria-hidden="true" />
          <p>{stage.tip}</p>
        </div>
      </div>
    </section>
  );
}

function Offers() {
  const [i, setI] = useState(0);
  const s = SLIDES[i] ?? SLIDES[0]!;
  const cta = (
    <>
      {s.cta} <span aria-hidden="true">→</span>
    </>
  );
  return (
    <section className="mh-sec">
      <div className="mh-offer" aria-roledescription="carousel" aria-label="Offers" style={{ background: s.bg }}>
        <span className="mh-offer-blob" style={{ background: s.blob }} />
        <img src={s.img} alt={s.alt} className="mh-offer-img" />
        <div className="mh-offer-copy" aria-live="polite">
          <span className="mh-offer-tag" style={{ color: s.ink }}>
            {s.tag}
          </span>
          <h2 className="mh-offer-title">{s.title}</h2>
          <p>{s.sub}</p>
          <Link to="/categories/$cat" params={{ cat: s.cat }} className="mh-offer-cta">
            {cta}
          </Link>
        </div>
        <div className="mh-dots">
          {SLIDES.map((x, n) => (
            <button
              key={x.tag}
              type="button"
              aria-label={`Show offer ${n + 1}`}
              aria-current={n === i}
              className={n === i ? "on" : ""}
              onClick={() => setI(n)}
            />
          ))}
        </div>
        <button type="button" className="mh-offer-next" aria-label="Next offer" onClick={() => setI((n) => (n + 1) % SLIDES.length)}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="mh-trust mh-scroll" aria-label="Why shop with us">
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" fill="#1fae73" />
          <path d="m8.5 12 2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
        <span><b>100% original</b><small>Sealed &amp; authorised</small></span>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="6" width="20" height="13" rx="3" fill="#f5a623" />
          <circle cx="12" cy="12.5" r="3" fill="#fff" />
        </svg>
        <span><b>Cash on delivery</b><small>bKash · Nagad · cards</small></span>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="3" fill="#6d3bea" />
          <path d="M3 9h18M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" />
        </svg>
        <span><b>Expiry shown</b><small>On every food &amp; formula</small></span>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 3 7v10l9 5 9-5V7z" fill="#f0457a" />
          <path d="M3 7l9 5 9-5M12 12v10" stroke="#fff" strokeWidth="1.6" fill="none" />
        </svg>
        <span><b>Easy returns</b><small>Wrong size? We swap it</small></span>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mh-sec">
      <div className="mh-head">
        <h2 className="mh-h2">Shop by category</h2>
        <Link to="/categories" className="mh-more">
          See all →
        </Link>
      </div>
      <div className="mh-cats">
        {CATS.map((c) => (
          <Link key={c.label} to="/categories/$cat" params={{ cat: c.cat }} className="mh-cat">
            <span style={{ background: c.bg }}>
              <img src={c.img} alt="" loading="lazy" />
            </span>
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Reorder() {
  const { lastOrder, add } = useCart();
  const [done, flash] = useFlash();
  const past = (lastOrder?.lines ?? [])
    .map((l) => ({ p: getProduct(l.slug), size: l.size }))
    .filter((x): x is { p: Product; size: string } => !!x.p);
  const hasOrder = past.length > 0;
  const rows = hasOrder
    ? past
    : ESSENTIALS.map(([slug, size]) => ({ p: getProduct(slug), size })).filter((x): x is { p: Product; size: string } => !!x.p);
  const verb = hasOrder ? "Reorder" : "Add";
  return (
    <section className="mh-sec">
      <div className="mh-card mh-pad">
        <div className="mh-head center">
          <div>
            <Eyebrow c="#f0457a">{hasOrder ? "RUNNING LOW?" : "START WITH THE BASICS"}</Eyebrow>
            <h2 className="mh-h2 sm">{hasOrder ? "Reorder in one tap" : "Everyday essentials"}</h2>
          </div>
          <Link to="/account/$section" params={{ section: "orders" }} className="mh-more">
            My orders
          </Link>
        </div>
        {hasOrder && lastOrder && <p className="mh-reorder-note">From your last order, {lastOrder.number}</p>}
        <div className="mh-reorder">
          {rows.map(({ p, size }) => {
            const k = `${p.slug}|${size}`;
            const isDone = !!done[k];
            return (
              <div key={k} className="mh-reorder-row">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="mh-thumb" style={{ background: look(p).bg }} aria-label={p.name}>
                  <img src={p.image} alt="" loading="lazy" />
                </Link>
                <span className="mh-min mh-grow">
                  <b className="mh-ellipsis">{nameOf(p)}</b>
                  <small>
                    {p.sizes.length > 1 && /^(S|M|L|XL)$/.test(size) ? `Size ${size}` : size} · {money(p.price)}
                  </small>
                </span>
                <button
                  type="button"
                  className={`mh-pill-btn ${isDone ? "done" : ""}`}
                  aria-label={`${verb} ${p.name}`}
                  onClick={(e) => {
                    add(p, size, 1, e.currentTarget);
                    flash(k);
                  }}
                >
                  {isDone ? "Added ✓" : verb}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mh-auto">
          <span className="mh-grow">
            <b>
              Auto-deliver &amp; save [X]% <em className="mh-soon">Coming soon</em>
            </b>
            <small>Diapers, wipes &amp; formula arriving before you run out, on a schedule you choose. Not available yet.</small>
          </span>
        </div>
      </div>
    </section>
  );
}

function SizeFinder() {
  const [w, setW] = useState(8);
  const size = sizeFor(w);
  return (
    <section className="mh-sec">
      <div className="mh-size">
        <div>
          <Eyebrow c="#2f5bd3">DIAPER SIZE FINDER</Eyebrow>
          <h2 className="mh-h2 sm">How much does your baby weigh?</h2>
        </div>
        <div className="mh-stepper">
          <button type="button" aria-label="Decrease weight" onClick={() => setW((x) => Math.max(2, x - 1))} disabled={w <= 2}>
            −
          </button>
          <div aria-live="polite">
            <b>{w}</b>
            <span>kg</span>
          </div>
          <button type="button" aria-label="Increase weight" onClick={() => setW((x) => Math.min(20, x + 1))} disabled={w >= 20}>
            +
          </button>
        </div>
        <div className="mh-size-result" aria-live="polite">
          <span className="mh-size-badge">
            <small>SIZE</small>
            <b>{size.label}</b>
          </span>
          <span className="mh-min mh-grow mh-size-txt">
            <b>Best fit: size {size.label}</b>
            <small>Fits about {size.range}. Check the pack chart: sizes vary by brand.</small>
          </span>
        </div>
        <Link to="/categories/$cat" params={{ cat: "diapers-and-wipes" }} className="mh-size-cta">
          Shop size {size.label} diapers →
        </Link>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { wish, toggleWish, add } = useCart();
  const [done, flash] = useFlash();
  const wished = wish.includes(p.slug);
  const isDone = !!done[p.slug];
  const lk = look(p);
  return (
    <article className="mh-pc">
      <div className="mh-pc-art" style={{ background: lk.bg }}>
        <Link to="/product/$slug" params={{ slug: p.slug }} aria-label={p.name} className="mh-pc-img">
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
        <span className="mh-off">-{off(p)}%</span>
        <button
          type="button"
          className={`mh-heart ${wished ? "on" : ""}`}
          aria-pressed={wished}
          aria-label={`Save ${p.name} to wishlist`}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart aria-hidden="true" fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mh-pc-tag">
        <Check aria-hidden="true" />
        {lk.tag}
      </div>
      <h3>
        <Link to="/product/$slug" params={{ slug: p.slug }}>
          {nameOf(p)}
        </Link>
      </h3>
      <div className="mh-pc-rate">
        ★ {p.rating.toFixed(1)} <span>({p.reviews} reviews)</span>
      </div>
      <div className="mh-pc-foot">
        <div>
          <b>{money(p.price)}</b>
          <s>{money(p.old)}</s>
        </div>
        <button
          type="button"
          className={`mh-add ${isDone ? "done" : ""}`}
          aria-label={isDone ? `Added ${p.name} to cart` : `Add ${p.name} to cart`}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            add(p, p.sizes[0] ?? "", 1, e.currentTarget);
            flash(p.slug);
          }}
        >
          {isDone ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}

function Picks({ stage }: { stage: (typeof STAGES)[number] }) {
  const items = pick(...stage.picks);
  return (
    <section className="mh-sec">
      <div className="mh-head">
        <div>
          <Eyebrow c="#6d3bea">PERFECT FOR {stage.caps}</Eyebrow>
          <h2 className="mh-h2">Parents’ top picks</h2>
        </div>
        <Link to="/trending" className="mh-more">
          View all →
        </Link>
      </div>
      <div className="mh-grid2" data-stage={stage.id}>
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}

function FlashDeals() {
  const left = useCountdownToMidnight();
  const parts =
    left == null
      ? ["--", "--", "--"]
      : [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];
  const label =
    left == null ? "Deals end at midnight" : `Ends in ${Math.floor(left / 3600)} hours ${Math.floor((left % 3600) / 60)} minutes`;
  return (
    <section className="mh-flash">
      <span className="mh-flash-blob" />
      <div className="mh-sec mh-flash-head">
        <div className="mh-flash-title">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#ffd166" />
          </svg>
          <h2 className="mh-h2">Flash deals</h2>
        </div>
        <div className="mh-timer" role="timer" aria-label={label}>
          <span>{parts[0]}</span>
          <b>:</b>
          <span>{parts[1]}</span>
          <b>:</b>
          <span className="hot">{parts[2]}</span>
        </div>
      </div>
      <div className="mh-row mh-scroll">
        {DEALS.map((p) => {
          const o = off(p);
          return (
            <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="mh-deal">
              <span className="mh-deal-art" style={{ background: look(p).bg }}>
                <img src={p.image} alt="" loading="lazy" />
                <span className="mh-off">-{o}%</span>
              </span>
              <h3>{nameOf(p)}</h3>
              <span className="mh-deal-price">
                <b>{money(p.price)}</b>
                <s>{money(p.old)}</s>
              </span>
              <span className="mh-deal-bar">
                <span style={{ width: `${Math.min(100, o * 3)}%` }} />
                <em>Save {money(p.old - p.price)}</em>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Needs() {
  return (
    <section>
      <h2 className="mh-h2 mh-sec">Shop by need</h2>
      <div className="mh-needs">
        {NEEDS.map((n) => {
          const dot = <span style={{ background: n.dot }} />;
          return "cat" in n ? (
            <Link key={n.label} to="/categories/$cat" params={{ cat: n.cat }} className="mh-chip">
              {dot}
              {n.label}
            </Link>
          ) : (
            <Link key={n.label} to="/search" search={{ q: n.q }} className="mh-chip">
              {dot}
              {n.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Safety() {
  const rows = [
    {
      t: "Sealed, original packs",
      d: "From brands and authorised importers only. No loose or repacked items.",
      i: <path d="m5 12 5 5L20 7" />,
    },
    {
      t: "Expiry date before you buy",
      d: "Shown on every formula, food and skin-care page.",
      i: (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 10h16M9 3v4M15 3v4" />
        </>
      ),
    },
    {
      t: "Ingredients & materials listed",
      d: "BPA-free, tear-free and age labels right next to Add to cart.",
      i: <path d="M9 3h6v5l4 8a3 3 0 0 1-2.7 4H7.7A3 3 0 0 1 5 16l4-8z" />,
    },
  ];
  return (
    <section className="mh-sec">
      <div className="mh-safe">
        <Eyebrow c="#136b40">OUR SAFETY PROMISE</Eyebrow>
        <h2 className="mh-h2 sm">What goes on your baby is checked first</h2>
        <div className="mh-safe-list">
          {rows.map((r) => (
            <div key={r.t}>
              <span className="mh-safe-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  {r.i}
                </svg>
              </span>
              <span>
                <b>{r.t}</b>
                <small>{r.d}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bundle() {
  const { add } = useCart();
  const [picked, setPicked] = useState<Record<string, boolean>>({
    "pampers-new-baby-diapers": true,
    "johnsons-baby-wipes": true,
    "johnsons-baby-shampoo": true,
  });
  const [added, setAdded] = useState(false);
  const items = BUNDLE.map(([slug, tile]) => ({ p: getProduct(slug), tile })).filter(
    (x): x is { p: Product; tile: string } => !!x.p,
  );
  const chosen = items.filter((x) => picked[x.p.slug]).map((x) => x.p);
  const sum = chosen.reduce((n, p) => n + p.price, 0);
  const was = chosen.reduce((n, p) => n + p.old, 0);
  return (
    <section className="mh-sec" id="mh-bundle">
      <div className="mh-card mh-pad">
        <div className="mh-head center">
          <div>
            <Eyebrow c="#f0457a">BUILD A BUNDLE</Eyebrow>
            <h2 className="mh-h2 sm">New baby starter kit</h2>
          </div>
          <span className="mh-bundle-chip">Tap to pick</span>
        </div>
        <div className="mh-bundle">
          {items.map(({ p, tile }) => {
            const on = !!picked[p.slug];
            return (
              <button
                key={p.slug}
                type="button"
                aria-pressed={on}
                className={on ? "on" : ""}
                onClick={() => {
                  setAdded(false);
                  setPicked((s) => ({ ...s, [p.slug]: !s[p.slug] }));
                }}
              >
                <span className="mh-thumb sm" style={{ background: tile }}>
                  <img src={p.image} alt="" loading="lazy" />
                </span>
                <span className="mh-min mh-grow">
                  <b className="mh-ellipsis">{nameOf(p)}</b>
                  <small>{money(p.price)}</small>
                </span>
                <span className="mh-check">
                  <Check aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
        <div className="mh-bundle-foot">
          <div>
            <small>
              {chosen.length} {chosen.length === 1 ? "item" : "items"}
            </small>
            <div>
              <b>{money(sum)}</b>
              {was > sum && <s>{money(was)}</s>}
            </div>
          </div>
          <button
            type="button"
            className={added ? "done" : ""}
            disabled={chosen.length === 0}
            onClick={(e) => {
              if (!chosen.length) return;
              const el = e.currentTarget;
              chosen.forEach((p) => add(p, p.sizes[0] ?? "", 1, el));
              setAdded(true);
            }}
          >
            {added ? "Added ✓" : "Add bundle"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const cards = [
    { bg: "#f1eaff", av: "#efe7ff", avc: "#6d3bea", l: "A", body: "[A real review in the parent’s own words: how the product held up, fit or helped.]", prod: "Pampers New Baby" },
    { bg: "#ffe3ec", av: "#ffe3ec", avc: "#c21e55", l: "B", body: "[A real review in the parent’s own words: delivery, packaging, freshness.]", prod: "Aptamil Advance" },
  ];
  return (
    <section>
      <div className="mh-sec mh-head">
        <div>
          <Eyebrow c="#b06d00">★ [4.8] FROM [N] PARENTS</Eyebrow>
          <h2 className="mh-h2">Real parents, real photos</h2>
        </div>
      </div>
      <div className="mh-row mh-scroll">
        {cards.map((c) => (
          <figure key={c.l} className="mh-review">
            <div className="mh-review-photo" style={{ background: c.bg }}>
              [Customer photo]
            </div>
            <div className="mh-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote>{c.body}</blockquote>
            <figcaption>
              <span className="mh-av" style={{ background: c.av, color: c.avc }}>
                {c.l}
              </span>
              <span>
                <b>[Name], [Area]</b>
                <small>Verified purchase · {c.prod}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Tips() {
  return (
    <section>
      <div className="mh-sec mh-head">
        <h2 className="mh-h2">Parenting tips</h2>
        <Link to="/support" className="mh-more">
          Read more →
        </Link>
      </div>
      <div className="mh-row mh-scroll">
        {TIPS.map((t) => (
          <Link key={t.title} to="/support" className="mh-tip">
            <span className="mh-tip-art" style={{ background: t.bg }} />
            <span className="mh-tip-body">
              <small style={{ color: t.c }}>{t.tag}</small>
              <b>{t.title}</b>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="mh-sec">
      <h2 className="mh-h2 mh-center">Brands parents trust</h2>
      <div className="mh-brands">
        {BRANDS.map((b) => (
          <Link key={b.name} to="/brands/$brand" params={{ brand: brandSlug(b.name) }} style={{ color: b.c }}>
            {b.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Help() {
  return (
    <section className="mh-sec">
      <div className="mh-help">
        <div>
          <Eyebrow c="#8a5a00">NOT SURE WHAT TO BUY?</Eyebrow>
          <h2 className="mh-h2 sm">Talk to a real person</h2>
          <p>Sizes, formula stages, delivery: we answer from [9am–10pm], every day.</p>
        </div>
        <div className="mh-help-btns">
          <a href="tel:+8801712345678" className="call">
            <Phone aria-hidden="true" />
            Call us
          </a>
          <Link to="/support" className="chat">
            <MessageCircle aria-hidden="true" />
            Chat now
          </Link>
        </div>
        <small>+880 1712 345678 · support@babychoice.com</small>
      </div>
    </section>
  );
}

function Newsletter() {
  const [v, setV] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <section className="mh-sec">
      <div className="mh-news">
        <h2 className="mh-h2 sm">Stage-by-stage tips, every month</h2>
        <p>Plus early sale access. No spam, unsubscribe anytime.</p>
        {joined ? (
          <div className="mh-news-done" role="status">
            <Check aria-hidden="true" /> Thanks, you’re on the list.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (v.trim()) setJoined(true);
            }}
          >
            <label htmlFor="mh-em" className="sr-only">
              Email or phone
            </label>
            <input id="mh-em" type="text" value={v} onChange={(e) => setV(e.target.value)} placeholder="Email or phone number" />
            <button type="submit">Join</button>
          </form>
        )}
      </div>
    </section>
  );
}

function MobileFooter() {
  return (
    <footer className="mh-footer">
      <div className="mh-foot-logo">
        Baby<span>Choice</span>
      </div>
      <nav className="mh-foot-links" aria-label="Help">
        <Link to="/account">Track my order</Link>
        <Link to="/support">Delivery info</Link>
        <Link to="/support">Returns &amp; exchange</Link>
        <Link to="/about">Safety &amp; quality</Link>
        <Link to="/about">About us</Link>
        <Link to="/support">FAQs</Link>
      </nav>
      <p>House 25, Road 10, Dhanmondi, Dhaka 1209</p>
      <div className="mh-pay">
        {["Cash on delivery", "bKash", "Nagad", "Visa · Mastercard"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <small>© 2026 Baby Choice</small>
    </footer>
  );
}

/* ------------------------------------------------------------------ page */

export function MobileHome() {
  const [stageId, setStageId] = useState<StageId>("m12");
  useEffect(() => {
    try {
      const v = localStorage.getItem(STAGE_KEY);
      if (v && STAGES.some((s) => s.id === v)) setStageId(v as StageId);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const setStage = (id: StageId) => {
    setStageId(id);
    try {
      localStorage.setItem(STAGE_KEY, id);
    } catch {
      /* storage unavailable */
    }
  };
  const stage = STAGES.find((s) => s.id === stageId) ?? STAGES[2]!;
  return (
    <div className="hd mh">
      <TopBar />
      <main className="mh-main">
        <StageCard stage={stage} setStage={setStage} />
        <Offers />
        <Trust />
        <Categories />
        <Reorder />
        <SizeFinder />
        <Picks stage={stage} />
        <FlashDeals />
        <Needs />
        <Safety />
        <Bundle />
        <Reviews />
        <Tips />
        <Brands />
        <Help />
        <Newsletter />
        <MobileFooter />
      </main>
      <MobileTabBar active="home" />
    </div>
  );
}
