import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Headset,
  Plus,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AddToCartButton, ProductLink, WishButton } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { getProduct, off, pick, products, tk, type Product } from "@/lib/products";

/* ---------- data ---------- */

type Slide = {
  tag: string;
  title: string[];
  sub: string;
  cta: string;
  to: string;
  cat?: string;
  slug: string;
  tone: string;
};
const SLIDES: Slide[] = [
  {
    tag: "NEW ARRIVALS",
    title: ["Hello,", "tiny world!"],
    sub: "Soft, safe picks for your newest family member, delivered to your door.",
    cta: "Shop clothing",
    to: "/categories/$cat",
    cat: "baby-clothing",
    slug: "winter-romper-panda",
    tone: "pink",
  },
  {
    tag: "BATH TIME",
    title: ["Splash-time", "favourites"],
    sub: "Towels, gentle washes and lotions for happy, giggly baths.",
    cta: "Shop bath",
    to: "/categories/$cat",
    cat: "bath-and-hygiene",
    slug: "baby-hooded-towel",
    tone: "sky",
  },
  {
    tag: "PLAY & LEARN",
    title: ["Play, learn,", "grow!"],
    sub: "Toys that grow with every new milestone.",
    cta: "Shop toys",
    to: "/categories/$cat",
    cat: "toys-and-learning",
    slug: "soft-teddy-bear",
    tone: "lemon",
  },
];

const STORIES = [
  { label: "Trending", slug: "pampers-new-baby-diapers", to: "/trending" as const },
  { label: "Clothing", slug: "carters-girl-bodysuit-set", cat: "baby-clothing" },
  { label: "Diapers", slug: "huggies-diapers-pack", cat: "diapers-and-wipes" },
  { label: "Feeding", slug: "philips-avent-bottle-set", cat: "feeding-and-nursing" },
  { label: "Bath", slug: "johnsons-baby-shampoo", cat: "bath-and-hygiene" },
  { label: "Toys", slug: "baby-rattle-set", cat: "toys-and-learning" },
  { label: "Health", slug: "digital-baby-thermometer", cat: "health-and-safety" },
  { label: "Offers", slug: "johnsons-baby-care-gift-set", to: "/offers" as const },
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
    tip: "Push toys and first foods make this stage extra fun.",
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
    tip: "Cuddly toys and sippy cups support growing independence.",
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

const BUNDLE = [
  "pampers-new-baby-diapers",
  "johnsons-baby-wipes",
  "johnsons-baby-shampoo",
  "johnsons-baby-lotion",
  "baby-hooded-towel",
  "carters-girl-bodysuit-set",
];

/** Daily surprise copy — replace with the real offer before launch. */
const DAILY_SURPRISE = { title: "[Your offer here]", code: "[CODE]" };

const RAILS = [
  {
    title: "Clothing",
    sub: "Soft cotton for every day",
    category: "Clothing",
    cat: "baby-clothing",
    tone: "sky",
  },
  {
    title: "Diapers & Wipes",
    sub: "Dry, comfy & gentle",
    category: "Diapers",
    cat: "diapers-and-wipes",
    tone: "pink",
  },
  {
    title: "Feeding",
    sub: "Bottles, cups & first foods",
    category: "Feeding",
    cat: "feeding-and-nursing",
    tone: "lemon",
  },
  {
    title: "Bath & Skin",
    sub: "Gentle washes & lotions",
    category: "Bath & Skin",
    cat: "bath-and-hygiene",
    tone: "mint",
  },
  {
    title: "Toys",
    sub: "Play, learn & grow",
    category: "Toys",
    cat: "toys-and-learning",
    tone: "peach",
  },
  {
    title: "Health",
    sub: "Care essentials for parents",
    category: "Health",
    cat: "health-and-safety",
    tone: "lilac",
  },
  {
    title: "Baby Gear",
    sub: "Strollers, carriers & more",
    category: "Baby Care",
    cat: "baby-accessories",
    tone: "teal",
  },
];

const flashDeals = [...products].sort((a, b) => off(b) - off(a)).slice(0, 6);

/* ---------- helpers ---------- */

function useSecondsToMidnight() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const end = new Date(n);
      end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, Math.floor((end.getTime() - n.getTime()) / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}
const pad = (n: number) => String(n).padStart(2, "0");

function CatLink({
  cat,
  className,
  children,
  label,
}: {
  cat: string;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <Link to="/categories/$cat" params={{ cat }} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

function V3Card({ product, tone }: { product: Product; tone?: string }) {
  const pct = off(product);
  return (
    <article className={`hv3-card tone-${tone ?? "lilac"}`}>
      <div className="hv3-card-art">
        <ProductLink slug={product.slug} label={product.name}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </ProductLink>
        {pct > 0 && <span className="hv3-off">-{pct}%</span>}
        <WishButton slug={product.slug} className="hv3-wish" />
      </div>
      <span className="hv3-brand">{product.brand}</span>
      <h4>
        <ProductLink slug={product.slug}>{product.name}</ProductLink>
      </h4>
      <div className="hv3-card-foot">
        <div className="hv3-price">
          <strong>৳ {tk(product.price)}</strong>
          {product.old > product.price && <del>৳ {tk(product.old)}</del>}
        </div>
        <AddToCartButton product={product} className="hv3-add">
          <Plus />
          <span className="sr-only">Add to cart</span>
        </AddToCartButton>
      </div>
    </article>
  );
}

/* ---------- sections ---------- */

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i] ?? SLIDES[0]!;
  const img = getProduct(s.slug)?.image;
  return (
    <section
      className={`hv3-hero tone-${s.tone}`}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <span className="hv3-blob" aria-hidden="true" />
      <Sparkles className="hv3-spark hv3-float-sm" aria-hidden="true" />
      <div className="hv3-hero-copy" key={i}>
        <span className="hv3-chip">{s.tag}</span>
        <h2>
          {s.title[0]}
          <br />
          {s.title[1]}
        </h2>
        <p>{s.sub}</p>
        <CatLink cat={s.cat!} className="hv3-cta">
          {s.cta}
          <ArrowRight />
        </CatLink>
      </div>
      <div className="hv3-hero-art" key={`a${i}`}>
        <img src={img} alt="" className="hv3-float" />
      </div>
      <div className="hv3-hero-nav">
        <div className="hv3-dots">
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
        <div className="hv3-arrows">
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
    </section>
  );
}

function Stories() {
  return (
    <nav className="hv3-stories" aria-label="Quick categories">
      {STORIES.map((s) => {
        const inner = (
          <>
            <span className="hv3-ring">
              <span className="hv3-ring-in">
                <img src={getProduct(s.slug)?.image} alt="" />
              </span>
            </span>
            <span>{s.label}</span>
          </>
        );
        return s.to ? (
          <Link key={s.label} to={s.to} className="hv3-story">
            {inner}
          </Link>
        ) : (
          <CatLink key={s.label} cat={s.cat!} className="hv3-story">
            {inner}
          </CatLink>
        );
      })}
    </nav>
  );
}

function AgeAndPicks() {
  const [id, setId] = useState("nb");
  const st = STAGES.find((x) => x.id === id) ?? STAGES[0]!;
  const picks = pick(...st.picks);
  const circ = 2 * Math.PI * 38;
  return (
    <>
      <section className="hv3-age-row">
        <div className="hv3-age">
          <h2>How old is your little one?</h2>
          <p>Pick an age and we'll tailor the picks below</p>
          <div className="hv3-stage-grid">
            {STAGES.map((x) => (
              <button
                type="button"
                key={x.id}
                aria-pressed={x.id === id}
                className={x.id === id ? "on" : ""}
                onClick={() => setId(x.id)}
              >
                <strong>{x.label}</strong>
                <span>{x.sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="hv3-milestone">
          <div className="hv3-ring-chart">
            <svg viewBox="0 0 92 92" aria-hidden="true">
              <circle cx="46" cy="46" r="38" className="track" />
              <circle
                cx="46"
                cy="46"
                r="38"
                className="bar"
                strokeDasharray={`${((circ * st.pct) / 100).toFixed(1)} ${circ.toFixed(1)}`}
                transform="rotate(-90 46 46)"
              />
            </svg>
            <span>
              <strong>{st.pct}%</strong>
              <small>to next</small>
            </span>
          </div>
          <div>
            <span className="hv3-eyebrow light">MILESTONE GUIDE</span>
            <h3>Up next: {st.next}</h3>
            <p>{st.tip}</p>
          </div>
        </div>
      </section>
      <section className="hv3-section">
        <div className="hv3-head">
          <div>
            <span className="hv3-eyebrow">PERFECT FOR {st.caps}</span>
            <h2>Picks for your little one</h2>
          </div>
          <Link to="/trending" className="hv3-more">
            View all
            <ArrowRight />
          </Link>
        </div>
        <div className="hv3-grid4">
          {picks.map((p) => (
            <V3Card key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function FlashDeals() {
  const left = useSecondsToMidnight();
  const h = left == null ? "--" : pad(Math.floor(left / 3600)),
    m = left == null ? "--" : pad(Math.floor((left % 3600) / 60)),
    s = left == null ? "--" : pad(left % 60);
  return (
    <section className="hv3-flash">
      <div className="hv3-head">
        <div className="hv3-flash-title">
          <Zap className="hv3-pulse" />
          <div>
            <h2>Flash Deals</h2>
            <p>Today's biggest savings</p>
          </div>
        </div>
        <div className="hv3-timer" aria-label="Time left today">
          <span>Ends in</span>
          <b>{h}</b>:<b>{m}</b>:<b className="hot">{s}</b>
        </div>
      </div>
      <div className="hv3-flash-row">
        {flashDeals.map((p) => (
          <V3Card key={p.slug} product={p} tone="white" />
        ))}
      </div>
    </section>
  );
}

function SurpriseAndBundle() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>(BUNDLE.slice(0, 3));
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const items = useMemo(() => pick(...BUNDLE), []);
  const chosen = items.filter((p) => picked.includes(p.slug));
  const total = chosen.reduce((n, p) => n + p.price, 0);
  const regular = chosen.reduce((n, p) => n + p.old, 0);
  return (
    <section className="hv3-duo">
      <div className="hv3-surprise">
        {!open ? (
          <>
            <button
              type="button"
              className="hv3-giftbtn hv3-wiggle"
              aria-label="Open today's surprise"
              onClick={() => setOpen(true)}
            >
              <Gift />
            </button>
            <span className="hv3-eyebrow amber">DAILY SURPRISE</span>
            <h3>Tap the gift box!</h3>
            <p>A new treat for you every day</p>
          </>
        ) : (
          <div className="hv3-pop">
            <span className="hv3-giftbtn open">
              <Star fill="currentColor" />
            </span>
            <span className="hv3-eyebrow amber">YOU UNLOCKED</span>
            <h3>{DAILY_SURPRISE.title}</h3>
            <span className="hv3-code">{DAILY_SURPRISE.code}</span>
          </div>
        )}
      </div>
      <div className="hv3-bundle">
        <div className="hv3-head">
          <div>
            <span className="hv3-eyebrow pink">BUILD A BUNDLE</span>
            <h2>New baby starter kit</h2>
          </div>
        </div>
        <div className="hv3-bundle-list">
          {items.map((p) => {
            const on = picked.includes(p.slug);
            return (
              <button
                type="button"
                key={p.slug}
                aria-pressed={on}
                className={on ? "on" : ""}
                onClick={() => {
                  setAdded(false);
                  setPicked((v) => (on ? v.filter((x) => x !== p.slug) : [...v, p.slug]));
                }}
              >
                <img src={p.image} alt="" />
                <span>
                  <b>{p.name}</b>
                  <small>৳ {tk(p.price)}</small>
                </span>
                <i aria-hidden="true">✓</i>
              </button>
            );
          })}
        </div>
        <div className="hv3-bundle-foot">
          <div>
            <small>
              {chosen.length} items selected
              {regular > total ? ` · you save ৳ ${tk(regular - total)}` : ""}
            </small>
            <strong>৳ {tk(total)}</strong>
          </div>
          <button
            type="button"
            className="hv3-cta pink"
            disabled={!chosen.length}
            onClick={(e) => {
              chosen.forEach((p) => add(p, p.sizes[0] ?? "", 1, e.currentTarget));
              setAdded(true);
            }}
          >
            {added ? "Added to cart ✓" : `Add ${chosen.length} to cart`}
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryRails() {
  const rails = RAILS.map((r) => ({
    ...r,
    items: products.filter((p) => p.category === r.category).slice(0, 6),
  })).filter((r) => r.items.length);
  const count = rails.reduce((n, r) => n + r.items.length, 0);
  return (
    <section className="hv3-section">
      <div className="hv3-head">
        <div>
          <span className="hv3-eyebrow pink">{count} PARENT FAVOURITES</span>
          <h2>Shop every category</h2>
        </div>
      </div>
      <nav className="hv3-chips" aria-label="Jump to category">
        {rails.map((r) => (
          <a key={r.cat} href={`#rail-${r.cat}`} className={`tone-${r.tone}`}>
            {r.title}
          </a>
        ))}
      </nav>
      {rails.map((r) => (
        <div key={r.cat} id={`rail-${r.cat}`} className={`hv3-rail tone-${r.tone}`}>
          <div className="hv3-rail-head">
            <div>
              <h3>{r.title}</h3>
              <p>{r.sub}</p>
            </div>
            <CatLink cat={r.cat} className="hv3-more">
              See all
              <ArrowRight />
            </CatLink>
          </div>
          <div className="hv3-rail-row">
            {r.items.map((p) => (
              <V3Card key={p.slug} product={p} tone={r.tone} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function HelpCard() {
  return (
    <section className="hv3-help">
      <span className="hv3-help-icon hv3-float-sm">
        <Headset />
      </span>
      <div>
        <h3>Not sure what to pick?</h3>
        <p>Our team will help you choose the right products.</p>
      </div>
      <Link to="/support" className="hv3-cta light">
        Get help
      </Link>
    </section>
  );
}

export function HomeV3Top() {
  return (
    <div className="hv3">
      <Hero />
      <Stories />
    </div>
  );
}

export function HomeV3Middle() {
  return (
    <div className="hv3">
      <AgeAndPicks />
      <FlashDeals />
      <SurpriseAndBundle />
      <CategoryRails />
    </div>
  );
}

export function HomeV3Bottom() {
  return (
    <div className="hv3">
      <HelpCard />
    </div>
  );
}
