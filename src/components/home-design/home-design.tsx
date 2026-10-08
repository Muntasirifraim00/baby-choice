import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  Plus,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useCart, FREE_DELIVERY } from "@/lib/cart-store";
import { getProduct, off, pick, products, tk, type Product } from "@/lib/products";
import { slugify } from "@/lib/live-head";
import {
  Balloon,
  Bolt,
  Bottle,
  Box,
  Cash,
  CategoryArt,
  Duck,
  FoodBowl,
  GiftBox,
  HdGradients,
  HeroBaby,
  HeroDuck,
  HeroTeddy,
  LogoHeart,
  Moon,
  Shield,
  Star,
  Teddy,
  Truck,
  type CatArt,
} from "@/components/home-design/art";

/* ------------------------------------------------------------------ data */

const CONTACT = {
  phone: "+880 1712 345678",
  email: "support@babychoice.com",
  address: "House 25, Road 10, Dhanmondi, Dhaka 1209",
};

const NAV: {
  label: string;
  cat?: string;
  to?: "/trending" | "/brands" | "/offers";
  hot?: boolean;
}[] = [
  { label: "New in", to: "/trending" },
  { label: "Newborn", cat: "baby-clothing" },
  { label: "Clothing", cat: "baby-clothing" },
  { label: "Feeding", cat: "feeding-and-nursing" },
  { label: "Diapering", cat: "diapers-and-wipes" },
  { label: "Toys", cat: "toys-and-learning" },
  { label: "Gear", cat: "strollers-and-prams" },
  { label: "Bath & care", cat: "bath-and-hygiene" },
  { label: "Gift sets", cat: "gifts-and-hampers" },
  { label: "Brands", to: "/brands" },
  { label: "Sale ✦", to: "/offers", hot: true },
];

const MEGA = [
  {
    title: "Clothing",
    ink: "#2f5bd3",
    links: [
      ["Bodysuits & onesies", "baby-clothing"],
      ["Panjabi & pajamas", "panjabi-and-pajamas"],
      ["Bedding & blankets", "bedding-and-blankets"],
      ["Baby accessories", "baby-accessories"],
      ["School & activity", "school-and-activity"],
    ],
  },
  {
    title: "Feeding",
    ink: "#b06d00",
    links: [
      ["Bottles & cups", "feeding-and-nursing"],
      ["Formula & milk", "feeding-and-nursing"],
      ["High chairs", "high-chairs-and-boosters"],
      ["Mother & maternity", "mother-and-maternity"],
      ["Health & safety", "health-and-safety"],
    ],
  },
  {
    title: "Diapering",
    ink: "#c21e55",
    links: [
      ["Diapers", "diapers-and-wipes"],
      ["Wipes", "diapers-and-wipes"],
      ["Bath & hygiene", "bath-and-hygiene"],
      ["Skin care", "skin-care"],
      ["Gifts & hampers", "gifts-and-hampers"],
    ],
  },
  {
    title: "Toys & gear",
    ink: "#136b40",
    links: [
      ["Toys & learning", "toys-and-learning"],
      ["Strollers & prams", "strollers-and-prams"],
      ["Outdoor & travel", "outdoor-and-travel"],
      ["High chairs & boosters", "high-chairs-and-boosters"],
      ["Baby accessories", "baby-accessories"],
    ],
  },
] as const;

const SLIDES = [
  {
    tag: "NEW ARRIVALS",
    title: "Hello,\ntiny world!",
    sub: "Soft, safe picks for your newest family member, delivered to your door.",
    cta: "Shop newborn",
    cat: "baby-clothing",
    bg: "#ffe3ec",
    blob: "#ffd0de",
    ink: "#c21e55",
    art: "baby",
  },
  {
    tag: "BATH TIME",
    title: "Splash-time\nfavourites",
    sub: "Towels, toys and gentle washes for happy, giggly baths.",
    cta: "Shop bath",
    cat: "bath-and-hygiene",
    bg: "#ddf1ff",
    blob: "#c7e6ff",
    ink: "#2f5bd3",
    art: "duck",
  },
  {
    tag: "PLAY & LEARN",
    title: "Play, learn,\ngrow!",
    sub: "Toys that grow with every new milestone.",
    cta: "Shop toys",
    cat: "toys-and-learning",
    bg: "#fff1c4",
    blob: "#ffe59a",
    ink: "#8a5a00",
    art: "teddy",
  },
] as const;

const CATS: { label: string; k: CatArt; bg: string; shade: string; cat: string }[] = [
  { label: "Clothing", k: "onesie", bg: "#e6f2ff", shade: "#cfe3fb", cat: "baby-clothing" },
  { label: "Feeding", k: "bottle", bg: "#fff3d1", shade: "#f8e2a6", cat: "feeding-and-nursing" },
  { label: "Diapering", k: "diaper", bg: "#ffe6ef", shade: "#fbcfdd", cat: "diapers-and-wipes" },
  { label: "Toys", k: "toy", bg: "#e2f8ee", shade: "#c4ecda", cat: "toys-and-learning" },
  { label: "Gear", k: "stroller", bg: "#efe8ff", shade: "#ddd0fb", cat: "strollers-and-prams" },
  { label: "Bath & care", k: "wash", bg: "#e3f4ff", shade: "#c9e6fb", cat: "bath-and-hygiene" },
  { label: "Formula", k: "can", bg: "#fff0e4", shade: "#fbdcc4", cat: "feeding-and-nursing" },
  { label: "Gift sets", k: "gift", bg: "#ffe6ef", shade: "#fbcfdd", cat: "gifts-and-hampers" },
];

const STAGES = [
  {
    id: "nb",
    label: "New",
    sub: "0–3 mo",
    caps: "NEWBORNS",
    pct: 70,
    next: "Holding head up",
    tip: "Tummy-time mats and soft rattles help build strength.",
    picks: [
      "pampers-new-baby-diapers",
      "carters-girl-bodysuit-set",
      "baby-hooded-towel",
      "johnsons-baby-shampoo",
    ],
  },
  {
    id: "m6",
    label: "3–6",
    sub: "months",
    caps: "3–6 MONTHS",
    pct: 55,
    next: "Rolling over",
    tip: "Play gyms and bright toys encourage reaching and rolling.",
    picks: ["chicco-feeding-bottle", "baby-rattle-set", "baby-play-mat", "johnsons-baby-wipes"],
  },
  {
    id: "m12",
    label: "6–12",
    sub: "months",
    caps: "6–12 MONTHS",
    pct: 40,
    next: "First steps",
    tip: "Push toys and grippy socks make early walking safer.",
    picks: [
      "nestle-cerelac-wheat-apple",
      "aptamil-advance-follow-on-milk",
      "baby-feeding-set",
      "stacking-rings-toy",
    ],
  },
  {
    id: "y2",
    label: "1–2",
    sub: "years",
    caps: "1–2 YEARS",
    pct: 62,
    next: "First words",
    tip: "Picture books and sound toys spark early talking.",
    picks: ["nuby-sippy-cup", "baby-activity-walker", "winter-romper-panda", "soft-teddy-bear"],
  },
  {
    id: "y4",
    label: "2–4",
    sub: "years",
    caps: "2–4 YEARS",
    pct: 30,
    next: "Potty training",
    tip: "Comfy pajamas and gentle bath care keep routines happy.",
    picks: ["girl-party-dress-bow", "girl-pajama-set", "baby-dove-shampoo", "boy-romper-striped"],
  },
];
const PICK_BG = ["#e9f2ff", "#fff4d1", "#f1eaff", "#ffeef4"];

const DEAL_BG = ["#fff1f1", "#eaf2ff", "#ffeef4", "#e2f8ee"];
const flashDeals = [...products].sort((a, b) => off(b) - off(a)).slice(0, 4);

const RAILS = [
  {
    title: "Clothing",
    sub: "Soft cotton for every day",
    category: "Clothing",
    cat: "baby-clothing",
    bg: "#e6f2ff",
    deep: "#2f5bd3",
    art: "onesie" as CatArt,
  },
  {
    title: "Diapering",
    sub: "Diapers, wipes & care",
    category: "Diapers",
    cat: "diapers-and-wipes",
    bg: "#ffe6ef",
    deep: "#c21e55",
    art: "diaper" as CatArt,
  },
  {
    title: "Feeding",
    sub: "Bottles, bowls & first foods",
    category: "Feeding",
    cat: "feeding-and-nursing",
    bg: "#fff3d1",
    deep: "#b06d00",
    art: "bottle" as CatArt,
  },
  {
    title: "Bath & care",
    sub: "Gentle washes & lotions",
    category: "Bath & Skin",
    cat: "bath-and-hygiene",
    bg: "#e3f4ff",
    deep: "#2f7de0",
    art: "wash" as CatArt,
  },
  {
    title: "Toys",
    sub: "Play, learn & grow",
    category: "Toys",
    cat: "toys-and-learning",
    bg: "#e2f8ee",
    deep: "#136b40",
    art: "toy" as CatArt,
  },
  {
    title: "Health",
    sub: "Care essentials for parents",
    category: "Health",
    cat: "health-and-safety",
    bg: "#fff0e4",
    deep: "#b4470f",
    art: "can" as CatArt,
  },
  {
    title: "Gear & gifts",
    sub: "Strollers, carriers & gift sets",
    category: "Baby Care",
    cat: "baby-accessories",
    bg: "#efe8ff",
    deep: "#4c22b8",
    art: "stroller" as CatArt,
  },
];

const BUNDLE = [
  { slug: "pampers-new-baby-diapers", short: "NB", tile: "#e9f2ff" },
  { slug: "johnsons-baby-wipes", short: "Wipe", tile: "#e2f8ee" },
  { slug: "baby-hooded-towel", short: "Wrap", tile: "#f1eaff" },
  { slug: "carters-girl-bodysuit-set", short: "Body", tile: "#fff4d1" },
  { slug: "sudocrem-nappy-rash-cream", short: "Care", tile: "#ffeef4" },
  { slug: "johnsons-baby-shampoo", short: "Bath", tile: "#e6f2ff" },
];

/** Daily surprise copy — replace with the real offer before launch. */
const DAILY_SURPRISE = { title: "[X]% off your next order", code: "[CODE]" };

const BRANDS = [
  { name: "Aptamil", c: "#1d4ed8" },
  { name: "Nestlé", c: "#1e3a8a" },
  { name: "Sudocrem", c: "#b91c1c" },
  { name: "Pampers", c: "#0f766e" },
  { name: "Carter's", c: "#0e7490" },
  { name: "Johnson's", c: "#1e3a8a" },
  { name: "Philips Avent", c: "#1e3a8a" },
  { name: "Huggies", c: "#c2185b" },
];

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
function CatLink({
  cat,
  className,
  children,
  style,
  label,
}: {
  cat: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  label?: string;
}) {
  return (
    <Link
      to="/categories/$cat"
      params={{ cat }}
      className={className}
      style={style}
      aria-label={label}
    >
      {children}
    </Link>
  );
}
const Arrow = () => <ArrowRight aria-hidden="true" />;

function WishHeart({ slug, size = "md" }: { slug: string; size?: "md" | "lg" }) {
  const { wish, toggleWish } = useCart();
  const on = wish.includes(slug);
  return (
    <button
      type="button"
      className={`hd-heart ${size} ${on ? "on hd-pop" : ""}`}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        toggleWish(slug);
      }}
    >
      <Heart fill={on ? "currentColor" : "none"} />
    </button>
  );
}

function AddButton({ product, label, deep }: { product: Product; label?: string; deep?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`hd-add ${label ? "wide" : ""} ${done ? "done hd-pop" : ""}`}
      style={!done && deep ? { background: deep } : undefined}
      aria-label={done ? `Added ${product.name} to cart` : `Add ${product.name} to cart`}
      onClick={(e) => {
        add(product, product.sizes[0] ?? "", 1, e.currentTarget);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 5 5L20 7" />
        </svg>
      ) : (
        <Plus aria-hidden="true" />
      )}
      {label && <span>{done ? "Added" : label}</span>}
    </button>
  );
}

function ProductImg({ product, className }: { product: Product; className?: string }) {
  return <img className={className} src={product.image} alt={product.name} loading="lazy" />;
}

/* ---------------------------------------------------------------- header */

export function Announcement() {
  const items = [
    ["Free gift wrapping on every order", ""],
    ["Cash on delivery all over Bangladesh", "y"],
    ["Earn Little Stars points on every taka", ""],
    ["New winter collection is here", "p"],
    [`Free delivery on orders over ৳${tk(FREE_DELIVERY)}`, ""],
  ];
  const row = items.map(([t, c], i) => (
    <span key={i} className={c === "y" ? "y" : c === "p" ? "p" : ""}>
      ✦ {t}
    </span>
  ));
  return (
    <div className="hd-announce" aria-label="Store announcements">
      <div className="hd-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}

export function Header() {
  const { lines, wish } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [mega, setMega] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q.trim() } });
  };
  return (
    <header className="hd-header">
      <div className="hd-wrap hd-header-top">
        <Link to="/" className="hd-logo" aria-label="Baby Choice home">
          <LogoHeart className="hd-wiggle" />
          <span>
            <b>
              <span>Baby</span>
              <em>Choice</em>
            </b>
            <small>Everything for your little one</small>
          </span>
        </Link>
        <form role="search" className="hd-search" onSubmit={submit}>
          <Search className="hd-search-ico" aria-hidden="true" />
          <label htmlFor="hd-q" className="sr-only">
            Search
          </label>
          <input
            id="hd-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search diapers, formula, toys, brands…"
          />
          <Link
            to="/search"
            search={{ q: "" }}
            className="hd-photo"
            aria-label="Browse all products"
          >
            <Camera />
          </Link>
          <button type="submit" className="hd-search-btn">
            Search
          </button>
        </form>
        <div className="hd-actions">
          <Link to="/account" className="hd-points" aria-label="Little Stars points">
            <Star className="hd-spin" />
            <span>
              <b>320</b>
              <small>points</small>
            </span>
          </Link>
          <Link
            to="/wishlist"
            className="hd-icon-btn"
            aria-label={`Wishlist, ${wish.length} items`}
          >
            <Heart />
            {wish.length > 0 && <span className="hd-badge pink">{wish.length}</span>}
          </Link>
          <Link to="/account" className="hd-account">
            <UserRound />
            Account
          </Link>
          <Link to="/cart" className="hd-cart hd-pulse">
            <ShoppingCart />
            Cart
            <span className="hd-cart-count" aria-live="polite">
              {count}
            </span>
          </Link>
        </div>
      </div>
      <nav aria-label="Main" className="hd-wrap hd-nav">
        <button
          type="button"
          className="hd-allcats"
          aria-expanded={mega}
          onClick={() => setMega((v) => !v)}
        >
          <LayoutGrid />
          All categories
          <ChevronDown className={mega ? "flip" : ""} />
        </button>
        <div className="hd-navlinks">
          {NAV.map((n) =>
            n.cat ? (
              <CatLink key={n.label} cat={n.cat} className="hd-navlink">
                {n.label}
              </CatLink>
            ) : (
              <Link key={n.label} to={n.to!} className={`hd-navlink ${n.hot ? "hot" : ""}`}>
                {n.label}
              </Link>
            ),
          )}
        </div>
      </nav>
      {mega && (
        <div className="hd-mega hd-drop">
          <div className="hd-wrap">
            <div className="hd-mega-panel">
              <div className="hd-mega-cols">
                {MEGA.map((m) => (
                  <div key={m.title}>
                    <h3 style={{ color: m.ink }}>{m.title}</h3>
                    {m.links.map(([label, cat]) => (
                      <CatLink key={label} cat={cat} className="hd-navlink">
                        {label}
                      </CatLink>
                    ))}
                  </div>
                ))}
              </div>
              <CatLink cat="diapers-and-wipes" className="hd-mega-promo hd-lift">
                <span className="hd-eyebrow y">THIS WEEK</span>
                <span className="hd-mega-title">
                  Diaper week:
                  <br />
                  bundle &amp; save
                </span>
                <span className="hd-pill-white">Shop diapering →</span>
                <CategoryArt kind="diaper" className="hd-float hd-mega-art" />
              </CatLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i] ?? SLIDES[0];
  return (
    <section className="hd-wrap hd-hero-row">
      <div
        className="hd-hero"
        style={{ background: s.bg }}
        aria-roledescription="carousel"
        aria-label="Featured"
      >
        <span className="hd-hero-blob" style={{ background: s.blob }} />
        <Balloon className="hd-float hd-balloon-a" />
        <Balloon className="hd-float-b hd-balloon-b" tone="Purple" width={42} height={72} />
        <Star className="hd-float-sm hd-hero-star" width={34} height={34} />
        <div className="hd-hero-art" key={`a${i}`}>
          {s.art === "baby" ? (
            <HeroBaby className="hd-fade" />
          ) : s.art === "duck" ? (
            <HeroDuck className="hd-fade" />
          ) : (
            <HeroTeddy className="hd-fade" />
          )}
        </div>
        <div className="hd-hero-copy hd-fade" key={`c${i}`}>
          <span className="hd-hero-tag" style={{ color: s.ink }}>
            {s.tag}
          </span>
          <h1>{s.title}</h1>
          <p>{s.sub}</p>
          <div className="hd-hero-ctas">
            <CatLink cat={s.cat} className="hd-btn-dark">
              {s.cta} <Arrow />
            </CatLink>
            <CatLink cat="gifts-and-hampers" className="hd-btn-white">
              Gift finder
            </CatLink>
          </div>
        </div>
        <div className="hd-hero-dots">
          {SLIDES.map((x, n) => (
            <button
              type="button"
              key={x.tag}
              aria-label={`Show slide ${n + 1}`}
              aria-current={n === i}
              className={n === i ? "on" : ""}
              onClick={() => setI(n)}
            />
          ))}
        </div>
        <div className="hd-hero-arrows">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setI((n) => (n + SLIDES.length - 1) % SLIDES.length)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setI((n) => (n + 1) % SLIDES.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="hd-hero-side">
        <CatLink cat="bath-and-hygiene" className="hd-side-card hd-lift pink">
          <span className="hd-eyebrow" style={{ color: "#c21e55" }}>
            BATH TIME
          </span>
          <span className="hd-side-title">
            Splash-time
            <br />
            essentials
          </span>
          <span className="hd-pill" style={{ background: "#f0457a" }}>
            Shop bath →
          </span>
          <Duck className="hd-float hd-side-art" />
        </CatLink>
        <CatLink cat="feeding-and-nursing" className="hd-side-card hd-lift blue">
          <span className="hd-eyebrow" style={{ color: "#3b28b8" }}>
            FEEDING
          </span>
          <span className="hd-side-title">
            Feeding
            <br />
            made easy
          </span>
          <span className="hd-pill" style={{ background: "#6d3bea" }}>
            Explore →
          </span>
          <Bottle className="hd-float-b hd-side-art bottle" />
        </CatLink>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    [<Truck className="hd-float-sm" key="t" />, "Fast delivery", "All over Bangladesh"],
    [<Shield className="hd-float-sm" key="s" />, "100% original", "Genuine brands only"],
    [<Cash className="hd-float-sm" key="c" />, "Cash on delivery", "Plus bKash, Nagad & cards"],
    [<Box className="hd-float-sm" key="b" />, "Easy returns", "Hassle-free exchange"],
  ] as const;
  return (
    <section className="hd-wrap hd-trust">
      {items.map(([icon, t, s]) => (
        <div key={t}>
          {icon}
          <span>
            <b>{t}</b>
            <small>{s}</small>
          </span>
        </div>
      ))}
    </section>
  );
}

function Categories() {
  return (
    <section className="hd-wrap hd-section">
      <div className="hd-head">
        <h2>Explore categories</h2>
        <Link to="/categories" className="hd-more">
          See all →
        </Link>
      </div>
      <div className="hd-cat-grid">
        {CATS.map((c) => (
          <CatLink key={c.label} cat={c.cat} className="hd-tile">
            <span
              className="hd-tile-art"
              style={{ background: c.bg, boxShadow: `inset 0 -8px 0 ${c.shade}` }}
            >
              <CategoryArt kind={c.k} className="hd-float" />
            </span>
            <span>{c.label}</span>
          </CatLink>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------- age & milestones */

function PickCard({ product, bg }: { product: Product; bg: string }) {
  return (
    <article className="hd-pick hd-lift hd-fade">
      <div className="hd-pick-art" style={{ background: bg }}>
        <span className="hd-shadow" />
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <ProductImg product={product} className="hd-float" />
        </Link>
        <WishHeart slug={product.slug} size="lg" />
      </div>
      <span className="hd-tag">{product.badge ?? product.category}</span>
      <h3>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          {product.name}
        </Link>
      </h3>
      <div className="hd-pick-foot">
        <span className="hd-price-lg">৳ {tk(product.price)}</span>
        <AddButton product={product} label="Add to cart" />
      </div>
    </article>
  );
}

function AgeAndPicks() {
  const [id, setId] = useState("nb");
  const st = STAGES.find((x) => x.id === id) ?? STAGES[0]!;
  const picks = pick(...st.picks);
  const circ = 2 * Math.PI * 38;
  return (
    <>
      <section className="hd-wrap hd-section hd-two">
        <div className="hd-age">
          <div className="hd-age-head">
            <Teddy className="hd-float-sm" />
            <div>
              <h2>How old is your little one?</h2>
              <p>Pick an age and we'll tailor everything below</p>
            </div>
          </div>
          <div className="hd-stages">
            {STAGES.map((x) => (
              <button
                type="button"
                key={x.id}
                aria-pressed={x.id === id}
                className={x.id === id ? "on" : ""}
                onClick={() => setId(x.id)}
              >
                <b>{x.label}</b>
                <small>{x.sub}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="hd-milestone">
          <span className="hd-ms-blob" />
          <div className="hd-ms-row">
            <div className="hd-ring">
              <svg width="110" height="110" viewBox="0 0 92 92" aria-hidden="true">
                <circle cx="46" cy="46" r="38" fill="none" stroke="#8d66f5" strokeWidth="10" />
                <circle
                  cx="46"
                  cy="46"
                  r="38"
                  fill="none"
                  stroke="#ffd166"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${((circ * st.pct) / 100).toFixed(1)} ${circ.toFixed(1)}`}
                  transform="rotate(-90 46 46)"
                />
              </svg>
              <span>
                <b>{st.pct}%</b>
                <small>to next</small>
              </span>
            </div>
            <div>
              <span className="hd-eyebrow y">MILESTONE TRACKER</span>
              <h3>Up next: {st.next}</h3>
              <p>{st.tip}</p>
            </div>
          </div>
          <div className="hd-ms-ctas">
            <Link to="/trending">Shop this stage</Link>
            <Link to="/account" className="alt">
              Track my baby
            </Link>
          </div>
        </div>
      </section>
      <section className="hd-wrap hd-section">
        <div className="hd-head">
          <div>
            <span className="hd-eyebrow purple">PERFECT FOR {st.caps}</span>
            <h2>Picks for your little one</h2>
          </div>
          <Link to="/trending" className="hd-more">
            View all →
          </Link>
        </div>
        <div className="hd-pick-grid">
          {picks.map((p, n) => (
            <PickCard key={p.slug} product={p} bg={PICK_BG[n % PICK_BG.length]!} />
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------- flash deals */

function FlashDeals() {
  const left = useCountdownToMidnight();
  const parts =
    left == null
      ? ["--", "--", "--"]
      : [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];
  return (
    <section className="hd-flash">
      <span className="hd-flash-blob a" />
      <span className="hd-flash-blob b" />
      <div className="hd-wrap hd-flash-inner">
        <div className="hd-flash-head">
          <div className="hd-flash-title">
            <Bolt className="hd-pulse" />
            <div>
              <h2>Flash Deals</h2>
              <span>Grab them before they're gone</span>
            </div>
          </div>
          <div className="hd-timer" aria-label="Time left today">
            <span className="lbl">Ends in</span>
            <span className="box">
              <b>{parts[0]}</b>
              <small>HRS</small>
            </span>
            <b className="sep">:</b>
            <span className="box">
              <b>{parts[1]}</b>
              <small>MIN</small>
            </span>
            <b className="sep">:</b>
            <span className="box hot">
              <b>{parts[2]}</b>
              <small>SEC</small>
            </span>
          </div>
        </div>
        <div className="hd-deal-grid">
          {flashDeals.map((p, n) => (
            <article key={p.slug} className="hd-deal hd-lift">
              <div className="hd-deal-art" style={{ background: DEAL_BG[n % DEAL_BG.length] }}>
                <span className="hd-off">-{off(p)}%</span>
                <Link to="/product/$slug" params={{ slug: p.slug }} aria-label={p.name}>
                  <ProductImg product={p} className="hd-float" />
                </Link>
                <span className="hd-shimmer" />
              </div>
              <h3>
                <Link to="/product/$slug" params={{ slug: p.slug }}>
                  {p.name}
                </Link>
              </h3>
              <div className="hd-deal-price">
                <span>৳ {tk(p.price)}</span>
                <s>৳ {tk(p.old)}</s>
              </div>
              <div className="hd-deal-bar">
                <span style={{ width: `${Math.min(100, off(p) * 3)}%` }} />
                <em>Save ৳ {tk(p.old - p.price)}</em>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ category rails */

function RailCard({ product, bg, deep }: { product: Product; bg: string; deep: string }) {
  const pct = off(product);
  const badge = pct > 0 ? `-${pct}%` : product.badge;
  return (
    <article className="hd-rcard hd-lift hd-fade">
      <div className="hd-rcard-art" style={{ background: bg }}>
        <span className="hd-shadow sm" />
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <ProductImg product={product} className="hd-float" />
        </Link>
        {badge && (
          <span
            className="hd-off"
            style={pct > 0 ? undefined : { background: "#ffd166", color: "#2a1650" }}
          >
            {badge}
          </span>
        )}
        <WishHeart slug={product.slug} />
      </div>
      <h4>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          {product.name}
        </Link>
      </h4>
      <div className="hd-rcard-foot">
        <div>
          <b>৳ {tk(product.price)}</b>
          {product.old > product.price && <s>৳ {tk(product.old)}</s>}
        </div>
        <AddButton product={product} deep={deep} />
      </div>
    </article>
  );
}

function CategoryRails() {
  const rails = RAILS.map((r) => ({
    ...r,
    items: products.filter((p) => p.category === r.category).slice(0, 6),
  })).filter((r) => r.items.length);
  const total = rails.reduce((n, r) => n + r.items.length, 0);
  return (
    <section className="hd-wrap hd-section">
      <div className="hd-head">
        <div>
          <span className="hd-eyebrow pink">{total} PARENT FAVOURITES</span>
          <h2 className="xl">Shop every category</h2>
        </div>
      </div>
      <nav aria-label="Jump to category" className="hd-chips">
        {rails.map((r) => (
          <a
            key={r.cat + r.title}
            href={`#cat-${r.cat}`}
            className="hd-lift"
            style={{ background: r.bg, color: r.deep }}
          >
            {r.title}
          </a>
        ))}
      </nav>
      <div className="hd-rails">
        {rails.map((r) => (
          <div key={r.title} id={`cat-${r.cat}`} className="hd-rail" style={{ background: r.bg }}>
            <CatLink cat={r.cat} className="hd-rail-tile hd-tile">
              <span className="hd-rail-blob" style={{ background: r.bg }} />
              <span className="hd-rail-count" style={{ color: r.deep }}>
                {r.items.length} top picks
              </span>
              <span className="hd-rail-title">{r.title}</span>
              <span className="hd-rail-sub">{r.sub}</span>
              <span className="hd-rail-btn" style={{ background: r.deep }}>
                Shop all →
              </span>
              <span className="hd-rail-art">
                <CategoryArt kind={r.art} className="hd-float" />
              </span>
            </CatLink>
            <div className="hd-rail-grid">
              {r.items.map((p) => (
                <RailCard key={p.slug} product={p} bg={r.bg} deep={r.deep} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------- surprise & bundle */

function GiftAndBundle() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>(BUNDLE.slice(0, 3).map((b) => b.slug));
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const items = useMemo(
    () =>
      BUNDLE.map((b) => ({ ...b, p: getProduct(b.slug) })).filter(
        (b): b is typeof b & { p: Product } => !!b.p,
      ),
    [],
  );
  const chosen = items.filter((b) => picked.includes(b.slug));
  const sum = chosen.reduce((n, b) => n + b.p.price, 0);
  const was = chosen.reduce((n, b) => n + b.p.old, 0);
  return (
    <section className="hd-wrap hd-section hd-two stretch">
      <div className="hd-gift">
        <span className="hd-gift-blob" />
        {!open ? (
          <>
            <button
              type="button"
              className="hd-gift-btn hd-wiggle"
              aria-label="Open today's surprise"
              onClick={() => setOpen(true)}
            >
              <GiftBox width={150} height={150} />
            </button>
            <span className="hd-eyebrow amber">DAILY SURPRISE</span>
            <span className="hd-gift-title">Click the gift box!</span>
            <span className="hd-gift-sub">A new treat for you every day</span>
          </>
        ) : (
          <>
            <span className="hd-gift-open hd-pop">
              <Star className="hd-spin" width={86} height={86} />
            </span>
            <span className="hd-eyebrow amber hd-pop">YOU UNLOCKED</span>
            <span className="hd-gift-title hd-pop">{DAILY_SURPRISE.title}</span>
            <span className="hd-code hd-pop">{DAILY_SURPRISE.code}</span>
          </>
        )}
      </div>
      <div className="hd-bundle">
        <div className="hd-head wrap">
          <div>
            <span className="hd-eyebrow pink">BUILD A BUNDLE</span>
            <h2>New baby starter kit</h2>
          </div>
          <span className="hd-bundle-chip hd-pulse">Pick 3+ essentials</span>
        </div>
        <div className="hd-bundle-grid">
          {items.map((b) => {
            const on = picked.includes(b.slug);
            return (
              <button
                type="button"
                key={b.slug}
                aria-pressed={on}
                className={on ? "on" : ""}
                onClick={() => {
                  setAdded(false);
                  setPicked((v) => (on ? v.filter((x) => x !== b.slug) : [...v, b.slug]));
                }}
              >
                <span className="hd-bundle-tile" style={{ background: b.tile }}>
                  <img src={b.p.image} alt="" />
                </span>
                <span className="hd-bundle-name">
                  <b>{b.p.name}</b>
                  <small>৳ {tk(b.p.price)}</small>
                </span>
                <span className="hd-check">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
        <div className="hd-bundle-foot">
          <div>
            <small>{chosen.length} items selected</small>
            <div>
              <b>৳ {tk(sum)}</b>
              {was > sum && <s>৳ {tk(was)}</s>}
            </div>
          </div>
          <button
            type="button"
            disabled={!chosen.length}
            onClick={(e) => {
              chosen.forEach((b) => add(b.p, b.p.sizes[0] ?? "", 1, e.currentTarget));
              setAdded(true);
            }}
          >
            {added ? "Added to cart ✓" : "Add bundle to cart"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- loyalty & reviews */

function LoyaltyAndReviews() {
  return (
    <section className="hd-wrap hd-section hd-two">
      <div className="hd-loyalty">
        <Star className="hd-float hd-loyalty-star" width={120} height={120} />
        <span className="hd-eyebrow" style={{ color: "#c21e55" }}>
          LITTLE STARS REWARDS
        </span>
        <h2>You're 180 points away from Gold Star</h2>
        <div className="hd-loyalty-bar">
          <span />
        </div>
        <div className="hd-loyalty-scale">
          <span>Silver · 320</span>
          <span>Gold · 500</span>
        </div>
        <div className="hd-perks">
          <div>
            <b>Free</b>
            <small>birthday gift</small>
          </div>
          <div>
            <b>Early</b>
            <small>sale access</small>
          </div>
          <div>
            <b>Priority</b>
            <small>delivery</small>
          </div>
        </div>
      </div>
      <div className="hd-reviews">
        <div className="hd-head">
          <h2>Happy parents say</h2>
          <span className="hd-avg">★ [Avg rating]</span>
        </div>
        <div className="hd-review-grid">
          {[
            ["A", "#efe7ff", "#6d3bea"],
            ["B", "#ffe3ec", "#c21e55"],
          ].map(([l, bg, c]) => (
            <figure key={l} className="hd-review hd-lift">
              <div className="hd-stars">★★★★★</div>
              <blockquote>[Real customer review goes here, in the parent's own words]</blockquote>
              <figcaption>
                <span style={{ background: bg, color: c }}>{l}</span>
                <span>
                  <b>[Customer name]</b>
                  <small>Verified buyer</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tips() {
  const tips = [
    {
      tag: "FEEDING · 4 MIN READ",
      ink: "#b06d00",
      bg: "#fff1c4",
      title: "First foods at 6 months: a gentle start",
      art: <FoodBowl className="hd-float" />,
    },
    {
      tag: "SLEEP · 5 MIN READ",
      ink: "#2f5bd3",
      bg: "#e6f2ff",
      title: "Building a calm bedtime routine",
      art: <Moon className="hd-float-b" />,
    },
    {
      tag: "GEAR · 5 MIN READ",
      ink: "#6d3bea",
      bg: "#efe8ff",
      title: "How to choose your first stroller",
      art: <CategoryArt kind="stroller" className="hd-float hd-tip-stroller" />,
    },
  ];
  return (
    <section className="hd-wrap hd-section">
      <div className="hd-head">
        <h2 className="xl">Parenting tips</h2>
        <Link to="/support" className="hd-more">
          Read more →
        </Link>
      </div>
      <div className="hd-tips">
        {tips.map((t) => (
          <Link key={t.title} to="/support" className="hd-tip hd-lift">
            <span className="hd-tip-art" style={{ background: t.bg }}>
              {t.art}
            </span>
            <span className="hd-tip-copy">
              <small style={{ color: t.ink }}>{t.tag}</small>
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
    <section className="hd-wrap hd-section">
      <h2 className="hd-center">Brands parents trust</h2>
      <div className="hd-brands">
        {BRANDS.map((b) => (
          <Link
            key={b.name}
            to="/brands/$brand"
            params={{ brand: slugify(b.name) }}
            className="hd-lift"
            style={{ color: b.c }}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [joined, setJoined] = useState(false);
  const [v, setV] = useState("");
  return (
    <section className="hd-wrap hd-section hd-last">
      <div className="hd-news">
        <span className="hd-news-blob" />
        <Teddy className="hd-float-sm hd-news-teddy" width={96} height={96} />
        <div className="hd-news-copy">
          <h2>Join the Baby Choice family</h2>
          <p>Stage-by-stage tips, early sale access and member-only offers.</p>
        </div>
        {!joined ? (
          <form
            className="hd-news-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (v.trim()) setJoined(true);
            }}
          >
            <label htmlFor="hd-em" className="sr-only">
              Email or phone
            </label>
            <input
              id="hd-em"
              type="text"
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="Your email or phone number"
            />
            <button type="submit">Join free</button>
          </form>
        ) : (
          <div className="hd-news-done hd-pop">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 5 5L20 7" />
            </svg>
            Welcome to the family!
          </div>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="hd-footer">
      <div className="hd-wrap">
        <div className="hd-foot-cols">
          <div className="hd-foot-brand">
            <div className="hd-foot-logo">
              <span>Baby</span>
              <em>Choice</em>
            </div>
            <p>
              Everything for your little one. Original products, delivered with love across
              Bangladesh.
            </p>
          </div>
          <div>
            <h3>Shop</h3>
            <Link to="/trending">New arrivals</Link>
            <CatLink cat="baby-clothing">Clothing</CatLink>
            <CatLink cat="feeding-and-nursing">Feeding</CatLink>
            <CatLink cat="diapers-and-wipes">Diapering</CatLink>
            <CatLink cat="toys-and-learning">Toys &amp; gear</CatLink>
          </div>
          <div>
            <h3>Help</h3>
            <Link to="/account">Track my order</Link>
            <Link to="/support">Delivery info</Link>
            <Link to="/support">Returns &amp; exchange</Link>
            <Link to="/about">About us</Link>
            <Link to="/support">FAQs</Link>
          </div>
          <div>
            <h3>Talk to us</h3>
            <span>{CONTACT.phone}</span>
            <span>{CONTACT.email}</span>
            <span>{CONTACT.address}</span>
            <Link to="/support" className="hd-chat">
              Chat with us
            </Link>
          </div>
        </div>
        <div className="hd-foot-bottom">
          <span>© 2026 Baby Choice. All rights reserved.</span>
          <div>
            {["Cash on delivery", "bKash", "Nagad", "Visa · Mastercard"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ page */

export function HomeDesign() {
  return (
    <div className="hd">
      <HdGradients />
      <Announcement />
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Categories />
        <AgeAndPicks />
        <FlashDeals />
        <CategoryRails />
        <GiftAndBundle />
        <LoyaltyAndReviews />
        <Tips />
        <Brands />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
