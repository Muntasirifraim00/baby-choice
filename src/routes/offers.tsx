import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Zap, Flame, Package, Tag, Sparkles, Percent, Leaf, Timer } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { LvBanner, LvHead } from "@/components/live-ui";
import { liveHead } from "@/lib/live-head";
import { getProduct, off, pick, products } from "@/lib/products";

export const Route = createFileRoute("/offers")({ head: () => liveHead("Offers & Deals", "Big savings for little ones — flash deals, combo offers and clearance up to 70% off."), component: Offers });

const groups = [
  { n: "Flash Deals", i: Zap, f: () => pick("johnsons-baby-shampoo", "johnsons-baby-lotion", "pampers-new-baby-diapers") },
  { n: "Mega Deals", i: Flame, f: () => products.filter(p => off(p) >= 20) },
  { n: "Combo Offers", i: Package, f: () => pick("johnsons-baby-care-gift-set", "philips-avent-bottle-set", "baby-feeding-set", "carters-girl-bodysuit-set") },
  { n: "Best Offers", i: Tag, f: () => [...products].sort((a, b) => off(b) - off(a)).slice(0, 6) },
  { n: "New Arrivals", i: Sparkles, f: () => products.filter(p => p.badge === "New Arrival" || p.badge === "New" || p.brand === "Baby Choice").slice(0, 6) },
  { n: "Clearance", i: Percent, f: () => products.filter(p => off(p) >= 22) },
  { n: "Organic & Natural", i: Leaf, f: () => pick("himalaya-baby-shampoo", "cetaphil-baby-wash", "aveeno-baby-lotion", "aveeno-baby-shampoo") },
];

function useCountdown(start: number) {
  const [s, setS] = useState(start);
  useEffect(() => { const t = setInterval(() => setS(v => (v > 0 ? v - 1 : start)), 1000); return () => clearInterval(t); }, [start]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad);
}

function Offers() {
  const [g, setG] = useState("Flash Deals");
  const [h, m, s] = useCountdown(12 * 3600 + 24 * 60 + 36);
  const group = groups.find(x => x.n === g) ?? groups[0]!;
  return <ShoppingShell crumb="Offers & Deals" className="lv" active="Offers">
    <h1 className="lv-title">Offers & Deals</h1>
    <LvBanner title={<>Big Savings for Little Ones</>} text="Up to 50% OFF on top baby brands. Limited time only!" image={getProduct("pampers-new-baby-diapers")?.image} />
    <div className="lv-chips">{groups.map(({ n, i: Icon }) => <button type="button" key={n} className={`lv-chip ${g === n ? "on" : ""}`} onClick={() => setG(n)}><Icon />{n}</button>)}</div>
    <div className="lv-section-head"><h2>{g}</h2>{g === "Flash Deals" && <span className="lv-timer"><Timer />Ends in <b>{h}</b>:<b>{m}</b>:<b>{s}</b></span>}</div>
    <ProductGrid items={group.f()} two />
    <div className="lv-grid2">
      <button type="button" className="lv-promo" onClick={() => setG("Combo Offers")}><b>Combo Offers</b><span>Buy More Save More</span></button>
      <button type="button" className="lv-promo pink" onClick={() => setG("Clearance")}><b>Clearance Sale</b><span>UP TO 70% OFF</span></button>
    </div>
    <LvHead title="More Offers for You" to="/trending" />
    <ProductGrid items={products.filter(p => off(p) >= 15).slice(0, 6)} two />
  </ShoppingShell>;
}
