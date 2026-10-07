import { Link } from "@tanstack/react-router";
import { ShopBottomNav } from "@/components/shop-navigation";

const pointers = import.meta.glob<{ default: { url: string } }>("../assets/ref-*.jpg.asset.json", { eager: true });
const url = (key: string, i: number) => pointers[`../assets/ref-${key}-${i}.jpg.asset.json`]?.default.url ?? "";

export type RefLink = { to: string; box: [number, number, number, number]; label: string };

/** Renders a reference screen from cropped section images (850px-wide reference coordinates) with active link zones. */
export function RefScreen({ name, cuts, links, alt, active = "none" }: { name: string; cuts: number[]; links: RefLink[]; alt: string[]; active?: "Home" | "Categories" | "Offers" | "Wishlist" | "Account" | "none" }) {
  return <div className="mobile-frame"><main className="baby-screen ref-screen">
    {cuts.slice(0, -1).map((y0, i) => {
      const y1 = cuts[i + 1] ?? y0;
      return <section key={y0} className="ref-strip">
        <img src={url(name, i)} alt={alt[i] ?? ""} />
        {links.filter(l => l.box[1] >= y0 && l.box[1] < y1).map(l => <Link key={l.label} to={l.to as "/"} aria-label={l.label} className="ref-hit" style={{ left: `${l.box[0] / 8.5}%`, width: `${l.box[2] / 8.5}%`, top: `${((l.box[1] - y0) / (y1 - y0)) * 100}%`, height: `${(l.box[3] / (y1 - y0)) * 100}%` }} />)}
      </section>;
    })}
    <ShopBottomNav active={active} />
  </main></div>;
}

export const searchHit: RefLink = { to: "/search", box: [668, 18, 66, 62], label: "Search" };
export const productHit = (box: RefLink["box"]): RefLink => ({ to: "/product/johnsons-baby-shampoo", box, label: "Johnson's Baby Shampoo" });
