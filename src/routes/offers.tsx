import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Flame, Package, Tag, Sparkles, Percent, Leaf, AlarmClock, Gift, ArrowRight, ImagePlus } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { liveHead } from "@/lib/live-head";
import { off, pick, products } from "@/lib/products";

export const Route = createFileRoute("/offers")({ head: () => liveHead("Offers & Deals", "Big savings for little ones — flash deals, combo offers and clearance up to 70% off."), component: Offers });

const groups = [
  { n: "Flash Deals", i: Zap, c: "red", f: () => pick("johnsons-baby-shampoo", "johnsons-baby-lotion", "pampers-new-baby-diapers") },
  { n: "Mega Deals", i: Flame, c: "amber", f: () => products.filter(p => off(p) >= 20) },
  { n: "Combo Offers", i: Tag, c: "pink", f: () => pick("johnsons-baby-care-gift-set", "philips-avent-bottle-set", "baby-feeding-set", "carters-girl-bodysuit-set") },
  { n: "Best Offers", i: Package, c: "gold", f: () => [...products].sort((a, b) => off(b) - off(a)).slice(0, 6) },
  { n: "New Arrivals", i: Sparkles, c: "blue", f: () => products.filter(p => p.badge === "New Arrival" || p.badge === "New" || p.brand === "Baby Choice").slice(0, 6) },
  { n: "Clearance", i: Percent, c: "rose", f: () => products.filter(p => off(p) >= 22) },
  { n: "Organic & Natural", i: Leaf, c: "green", f: () => pick("himalaya-baby-shampoo", "cetaphil-baby-wash", "aveeno-baby-lotion", "aveeno-baby-shampoo") },
];

function useCountdown(start: number) {
  const [s, setS] = useState(start);
  useEffect(() => { const t = setInterval(() => setS(v => (v > 0 ? v - 1 : start)), 1000); return () => clearInterval(t); }, [start]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad);
}

function BannerPh({ label, tone }: { label: string; tone: string }) {
  return <div className={`of-ph ${tone}`} aria-label={`${label} — banner image placeholder`}><ImagePlus /><span>{label}</span></div>;
}

function Offers() {
  const [g, setG] = useState("Flash Deals");
  const [h, m, s] = useCountdown(12 * 3600 + 24 * 60 + 36);
  const group = groups.find(x => x.n === g) ?? groups[0]!;
  return <ShoppingShell crumb="Offers & Deals" className="lv offers-page" active="Offers">

    {/* Hero banner — user will supply the photo */}
    <section className="of-hero">
      <div className="of-hero-text">
        <span className="of-pill">Limited Time Offer</span>
        <h1>Big Savings<br />for <em>Little Ones</em></h1>
        <p>Top baby care brands at special prices. Because your baby deserves the best.</p>
        <button type="button" className="of-btn" onClick={() => setG("Flash Deals")}>Shop All Offers<ArrowRight /></button>
      </div>
      <BannerPh label="Hero banner image" tone="pink" />
      <span className="of-off-badge">Up to<br /><b>50%</b><br />OFF</span>
    </section>

    {/* Deal category tiles */}
    <div className="of-tiles">{groups.map(({ n, i: Icon, c }) => <button type="button" key={n} className={`of-tile ${g === n ? "on" : ""}`} onClick={() => setG(n)}><Icon className={`ic-${c}`} /><span>{n}</span></button>)}</div>

    {/* Flash Deals banner with countdown */}
    <section className="of-flash">
      <div className="of-flash-text">
        <h2><AlarmClock />Flash Deals</h2>
        <p>Limited Time Offers<br />Don’t Miss Out!</p>
        <button type="button" className="of-btn pink" onClick={() => setG("Flash Deals")}>View All Flash Deals<ArrowRight /></button>
      </div>
      <BannerPh label="Flash deals image" tone="yellow" />
      <div className="of-count" aria-label="Time left">
        <div><b>{h}</b><small>Hours</small></div><i>:</i>
        <div><b>{m}</b><small>Minutes</small></div><i>:</i>
        <div><b>{s}</b><small>Seconds</small></div>
      </div>
    </section>

    {/* Selected deal group products */}
    <ProductGrid items={group.f()} />

    {/* Combo Offers banner */}
    <section className="of-combo">
      <div className="of-combo-text">
        <h2><Gift />Combo Offers</h2>
        <p>Buy More<br />Save More</p>
        <button type="button" className="of-btn blue" onClick={() => setG("Combo Offers")}>View All Combos<ArrowRight /></button>
      </div>
      <BannerPh label="Combo offers image" tone="blue" />
      <span className="of-off-badge small">Up to<br /><b>40%</b><br />OFF</span>
    </section>

    {/* Clearance banner */}
    <section className="of-clear">
      <div className="of-clear-text">
        <h2><Percent />Clearance Sale</h2>
        <p>Top Brands at<br />Unbeatable Prices</p>
        <button type="button" className="of-btn orange" onClick={() => setG("Clearance")}>View Clearance<ArrowRight /></button>
      </div>
      <BannerPh label="Clearance sale image" tone="green" />
      <span className="of-off-badge small">Up to<br /><b>70%</b><br />OFF</span>
    </section>

    {/* More offers */}
    <div className="of-more-head"><h2>More Offers for You</h2><Link to="/trending" className="of-view-all">View All<ArrowRight /></Link></div>
    <div className="of-more">
      <button type="button" className="of-more-card blue" onClick={() => setG("New Arrivals")}><Sparkles /><span><b>New Arrivals</b><small>Special Price</small></span><BannerPh label="New arrivals image" tone="blue" /></button>
      <button type="button" className="of-more-card green" onClick={() => setG("Organic & Natural")}><Leaf /><span><b>Organic &amp; Natural</b><small>Gentle Care</small></span><BannerPh label="Organic care image" tone="green" /></button>
    </div>
  </ShoppingShell>;
}
