import { createFileRoute } from "@tanstack/react-router";
import { Award, Droplet, Globe2, Heart, ShieldCheck, Smile, Users } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { LvBanner, LvHead, Tile } from "@/components/live-ui";
import { JohnsonsHeaderLinks } from "@/components/johnsons";
import { liveHead } from "@/lib/live-head";
import { getProduct, johnsons, pick } from "@/lib/products";

export const Route = createFileRoute("/brands/johnsons/story")({ head: () => liveHead("Johnson's Brand Story", "125+ years of gentle baby care — the Johnson's story, categories and featured products."), component: Page });

const cats = [["Baby Shampoo", 8, "Shampoo"], ["Baby Lotion", 7, "Lotion"], ["Baby Body Wash", 6, "Body Wash"], ["Baby Powder", 5, "Powder"], ["Baby Wipes", 5, "Wipes"], ["Baby Care Sets", 3, "Gift Set"]] as const;

function Page() {
  return <ShoppingShell crumb="Brands › Johnson's Story" className="lv">
    <JohnsonsHeaderLinks />
    <LvBanner title={<>Trusted by Generations of Parents</>} text="Since 1894, Johnson’s has made gentle products for babies’ delicate skin and hair." image={getProduct("johnsons-baby-shampoo")?.image} />
    <div className="lv-grid4"><Tile icon={<Heart />} title="Mild & Gentle" /><Tile icon={<Droplet />} title="pH Balanced" /><Tile icon={<ShieldCheck />} title="Dermatologically Tested" /><Tile icon={<Smile />} title="Safe for Daily Use" /></div>
    <div className="lv-grid2"><Tile icon={<Award />} title="125+ Years" text="of Care" /><Tile icon={<Users />} title="Trusted" text="by Generations" /><Tile icon={<Globe2 />} title="100+ Countries" text="Available worldwide" /><Tile icon={<ShieldCheck />} title="Tested" text="Dermatologically" /></div>
    <LvBanner tone="soft" title="A Legacy of Gentle Care" text="Every Johnson’s product is designed to be clinically proven mild for your baby." cta="Explore All Products" to="/brands/johnsons/products" />
    <LvHead title="Shop by Product Category" to="/brands/johnsons/products" />
    <div className="lv-grid3">{cats.map(([n, c, t]) => { const img = johnsons.find(p => p.type === t)?.image; return <a key={n} href="/brands/johnsons/products" className="lv-tile">{img && <img src={img} alt="" className="lv-tile-img" />}<b>{n}</b><small>{c} Products</small></a>; })}</div>
    <LvHead title="Featured Products" to="/brands/johnsons" />
    <ProductGrid items={pick("johnsons-baby-shampoo", "johnsons-baby-lotion", "johnsons-baby-powder", "johnsons-baby-wipes")} two />
  </ShoppingShell>;
}
