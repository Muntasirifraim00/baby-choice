import { off, products, type Product } from "@/lib/products";

/** Short display names shared by the /offers page and the header menus. */
export const SHORT_NAMES: Record<string, string> = {
  "winter-romper-panda": "Baby Winter Romper (Panda)",
  "aveeno-baby-shampoo": "Aveeno Baby Shampoo",
  "himalaya-baby-shampoo": "Himalaya Baby Shampoo",
  "carters-girl-bodysuit-set": "Baby Girl 3-Pack Bodysuit Set",
  "carters-boy-bodysuit-pack": "Baby Boy Bodysuit Pack (3 pcs)",
  "aptamil-advance-follow-on-milk": "Aptamil Advance Follow On Milk",
};
export const shortName = (p: Product) => SHORT_NAMES[p.slug] ?? p.name;

const onSale = products.filter((p) => p.old > p.price);
export const saleCount = onSale.length;
export const maxOff = Math.max(0, ...products.map(off));
/** Biggest discount ratio first; Array.sort is stable so ties keep catalogue order. */
export const topDeals = [...onSale].sort((a, b) => a.price / a.old - b.price / b.old).slice(0, 3);
export const topTrending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 3);

const TICKER: Record<string, string> = {
  "pampers-new-baby-diapers": "Pampers",
  "aptamil-advance-follow-on-milk": "Aptamil",
  "philips-avent-bottle-set": "Avent",
};
export const tickerLabel = (p: Product, i: number) => `#${i + 1} ${TICKER[p.slug] ?? p.brand}`;

export const DEAL_TINTS = ["#fff0e4", "#f1eaff", "#fff4d1"];
export const TREND_TINTS = ["#e9f2ff", "#fff4d1", "#e6f2ff"];
export const RANK_COLORS = ["#e0a100", "#8a7aa8", "#c47a3a"];
