import { products, type Product } from "@/lib/products";
import { shortName } from "@/lib/header-data";

/** One search engine for the desktop panel, the phone sheet and the /search page. */

export function normalize(q: string): string {
  return q
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RAW_ALIASES: Record<string, string> = {
  "ডায়াপার": "diaper", "ডাইপার": "diaper", diper: "diaper", daiper: "diaper", dayaper: "diaper", nappy: "diaper", nappies: "diaper",
  aptamill: "aptamil", aptamel: "aptamil",
  shampu: "shampoo", "শ্যাম্পু": "shampoo",
  "দুধ": "milk", formula: "milk",
  "তেল": "oil", "লোশন": "lotion",
  "জামা": "clothes", jama: "clothes",
  "বোতল": "bottle", "ওয়াইপস": "wipes",
};
/** Keys are normalized so Bangla input composed either way still matches. */
export const ALIASES: Record<string, string> = Object.fromEntries(Object.entries(RAW_ALIASES).map(([k, v]) => [normalize(k), v]));

export const KEYWORDS: Record<string, string> = {
  Diapers: "diaper diapers nappy wipes",
  Feeding: "bottle formula milk cereal food",
  "Bath & Skin": "shampoo bath lotion oil wash soap",
  Clothing: "clothes bodysuit romper onesie dress",
  Health: "rash cream thermometer care",
  // "teether" omitted: no teether is stocked, so matching every toy would be misleading.
  Toys: "toy rattle",
  "Baby Care": "gear stroller gift",
};

export const CATEGORIES: Record<string, { name: string; slug: string; tint: string; scope: string }> = {
  Diapers: { name: "Diapers & Wipes", slug: "diapers-and-wipes", tint: "#e9f2ff", scope: "Diapers" },
  Feeding: { name: "Feeding", slug: "feeding-and-nursing", tint: "#fff3d1", scope: "Feeding" },
  "Bath & Skin": { name: "Bath & Skin", slug: "bath-and-hygiene", tint: "#e2f8ee", scope: "Bath" },
  Health: { name: "Health", slug: "health-and-safety", tint: "#ffeef4", scope: "Health" },
  Clothing: { name: "Clothing", slug: "baby-clothing", tint: "#ffe6ef", scope: "Clothing" },
  Toys: { name: "Toys", slug: "toys-and-learning", tint: "#ffeef4", scope: "Toys" },
  "Baby Care": { name: "Baby Care", slug: "baby-accessories", tint: "#efe8ff", scope: "Baby Care" },
};
export const SCOPES = ["All", "Diapers", "Feeding", "Bath", "Clothing", "Health", "Toys"] as const;
export const scopeOf = (p: Product) => CATEGORIES[p.category]?.scope ?? p.category;

export const PHRASES = [
  "diapers size M", "diapers for newborns", "diaper rash cream", "aptamil formula", "aptamil stage 2", "baby shampoo", "shampoo tear free",
  "feeding bottles", "baby wipes", "baby oil massage", "baby lotion", "gift sets", "winter romper", "stroller",
];
export const POPULAR_SEARCHES = ["pampers diapers", "aptamil formula", "baby wipes", "feeding bottles", "baby shampoo"];

const SIZE_TOKENS = new Set(["s", "m", "l", "xl", "xxl", "nb", "size", "stage"]);
const SEARCH_NAMES: Record<string, string> = { "sudocrem-nappy-rash-cream": "Sudocrem Nappy Rash Cream" };
export const displayName = (p: Product) => SEARCH_NAMES[p.slug] ?? shortName(p);

const aliasWords = (s: string) => s.split(" ").map((w) => ALIASES[w] ?? w).join(" ");

export function resolve(q: string): { query: string; corrected?: string } {
  const n = normalize(q);
  if (!n) return { query: "" };
  const fixed = ALIASES[n] ?? aliasWords(n);
  return fixed !== n ? { query: fixed, corrected: fixed } : { query: n };
}

type Indexed = { p: Product; i: number; name: string; nameWords: string[]; brand: string; direct: string; hay: string };
const INDEX: Indexed[] = products.map((p, i) => {
  const rawName = normalize(p.name);
  const name = `${rawName} ${aliasWords(rawName)}`;
  const brand = normalize(p.brand);
  // Explicit category-name queries (e.g. Diapers) are intentional, not keyword filler.
  const direct = normalize(`${p.name} ${p.brand} ${p.category}`);
  const hay = normalize(`${p.name} ${p.brand} ${p.category} ${p.sub} ${p.type ?? ""} ${KEYWORDS[p.category] ?? ""}`);
  return { p, i, name: rawName, nameWords: name.split(" "), brand, direct: `${direct} ${aliasWords(direct)}`, hay: `${hay} ${aliasWords(hay)}` };
});

export type SearchResult = { query: string; corrected?: string; typed: string; results: Product[] };

export function search(q: string): SearchResult {
  const { query, corrected } = resolve(q);
  if (!query) return { query, typed: q, results: [] };
  const all = query.split(" ");
  const words = all.some((w) => !SIZE_TOKENS.has(w)) ? all.filter((w) => !SIZE_TOKENS.has(w)) : all;
  const scored: { p: Product; s: number; i: number; strong: boolean }[] = [];
  for (const x of INDEX) {
    if (!words.every((w) => x.hay.includes(w))) continue;
    let s = 0;
    for (const w of words) {
      s += x.name.startsWith(w) ? 100 : x.nameWords.some((nw) => nw.startsWith(w)) ? 80 : x.brand.includes(w) ? 60 : x.name.includes(w) ? 40 : 20;
    }
    scored.push({ p: x.p, s, i: x.i, strong: words.every((w) => x.direct.includes(w)) });
  }
  scored.sort((a, b) => b.s - a.s || b.p.reviews - a.p.reviews || a.i - b.i);
  const matches = scored.filter((x) => x.strong);
  const relevant = matches.length >= 3 ? matches : scored;
  return { query, ...(corrected ? { corrected } : {}), typed: q, results: relevant.map((x) => x.p) };
}

export function suggest(q: string): string[] {
  const { query } = resolve(q);
  if (!query) return [];
  const out = PHRASES.filter((ph) => normalize(ph).includes(query)).slice(0, 4);
  if (out.length < 2) {
    for (const p of search(q).results) {
      const n = displayName(p).toLowerCase();
      if (!out.includes(n)) out.push(n);
      if (out.length >= 4) break;
    }
  }
  return out;
}

export function categoryCounts(results: Product[]) {
  const map = new Map<string, number>();
  results.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({ name: CATEGORIES[cat]?.name ?? cat, slug: CATEGORIES[cat]?.slug ?? "", tint: CATEGORIES[cat]?.tint ?? "#f6f1ff", count }));
}

/** First case-insensitive match; render <mark> only when `hit` is non-empty. */
export function highlight(text: string, q: string): { pre: string; hit: string; post: string } {
  const t = q.trim();
  const i = t ? text.toLowerCase().indexOf(t.toLowerCase()) : -1;
  if (i < 0) return { pre: text, hit: "", post: "" };
  return { pre: text.slice(0, i), hit: text.slice(i, i + t.length), post: text.slice(i + t.length) };
}

/* recent searches */
export const RECENT_KEY = "bc-recent-searches";
export function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
}
export function saveRecent(q: string): string[] {
  const c = q.trim();
  const next = c ? [c, ...readRecent().filter((s) => s.toLowerCase() !== c.toLowerCase())].slice(0, 6) : readRecent();
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
}
export function clearRecent() {
  try { localStorage.setItem(RECENT_KEY, "[]"); } catch { /* storage unavailable */ }
}

export const STAGE_KEY = "baby-choice-stage";
export const AGE_TILES = [
  { id: "nb", label: "0–3", sub: "months", bg: "#e9f2ff" },
  { id: "m6", label: "3–6", sub: "months", bg: "#fff3d1" },
  { id: "m12", label: "6–12", sub: "months", bg: "#e2f8ee" },
  { id: "y2", label: "1–2", sub: "years", bg: "#ffe6ef" },
  { id: "y4", label: "2–4", sub: "years", bg: "#efe8ff" },
];
export const popularNow = () => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
export const TINTS = ["#e9f2ff", "#ffeef4", "#fff4d1", "#e2f8ee", "#fff4d1", "#e2f8ee"];
