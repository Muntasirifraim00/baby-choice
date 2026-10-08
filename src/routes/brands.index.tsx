import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { LvBanner } from "@/components/live-ui";
import { liveHead, slugify } from "@/lib/live-head";
import { products } from "@/lib/products";
import b1 from "@/assets/brand-1.png.asset.json";
import b2 from "@/assets/brand-2.png.asset.json";
import b3 from "@/assets/brand-3.png.asset.json";
import b4 from "@/assets/brand-4.png.asset.json";
import b5 from "@/assets/brand-5.png.asset.json";
import b6 from "@/assets/brand-6.png.asset.json";
import b7 from "@/assets/brand-7.png.asset.json";

export const Route = createFileRoute("/brands/")({ head: () => liveHead("All Brands", "Shop trusted baby brands: Johnson's, Cetaphil, Himalaya, Aveeno, Dove, Pampers and more."), component: Brands });

export const allBrands: { name: string; count: number; logo?: string }[] = [
  { name: "Johnson's", count: 42, logo: b6.url }, { name: "Cetaphil", count: 36 }, { name: "Himalaya", count: 28 }, { name: "Aveeno", count: 24 },
  { name: "Dove", count: 20 }, { name: "Pampers", count: 18, logo: b4.url }, { name: "Nestlé Cerelac", count: 22, logo: b2.url }, { name: "Nuby", count: 26 },
  { name: "Chicco", count: 19 }, { name: "Philips Avent", count: 30, logo: b7.url }, { name: "Mustela", count: 16 }, { name: "Pigeon", count: 18 },
  { name: "Aptamil", count: 14, logo: b1.url }, { name: "Sudocrem", count: 6, logo: b3.url }, { name: "Carter's", count: 40, logo: b5.url },
];
const letters = ["All", ..."ABCDEFGHIJKLM".split("")];

function Brands() {
  const [q, setQ] = useState(""); const [letter, setLetter] = useState("All");
  const list = allBrands.filter(b => b.name.toLowerCase().includes(q.toLowerCase()) && (letter === "All" || b.name.startsWith(letter)));
  return <ShoppingShell crumb="All Brands" className="lv">
    <h1 className="lv-title">All Brands</h1><p className="lv-sub">Shop from the brands parents trust most</p>
    <label className="lv-input"><Search /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search brands..." aria-label="Search brands" /></label>
    <LvBanner title={<>Top Baby Brands</>} text="Johnson's, Cetaphil, Himalaya, Aveeno, Dove, Pampers — all in one place." image={products[0]?.image} cta="Shop Johnson's" to="/brands/johnsons" />
    <div className="lv-chips">{letters.map(l => <button type="button" key={l} className={`lv-chip ${letter === l ? "on" : ""}`} onClick={() => setLetter(l)}>{l}</button>)}</div>
    {list.length === 0 && <p className="lv-empty">No brands found.</p>}
    <div className="lv-grid3">{list.map(b => <Link key={b.name} to={b.name === "Johnson's" ? "/brands/johnsons" : "/brands/$brand"} params={{ brand: slugify(b.name) }} className="lv-brand">
      {b.logo ? <img src={b.logo} alt="" /> : <span className="lv-mono">{b.name[0]}</span>}<b>{b.name}</b><small>{b.count} Products</small><em>View Brand <ArrowRight /></em></Link>)}</div>
  </ShoppingShell>;
}
