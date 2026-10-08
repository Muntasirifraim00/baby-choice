import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/products";

export type CartLine = { slug: string; size: string; qty: number };
export type Order = { number: string; placed: string; lines: CartLine[]; payment: string };

const seed: CartLine[] = [
  { slug: "johnsons-baby-shampoo", size: "500ml", qty: 1 },
  { slug: "pampers-new-baby-diapers", size: "M", qty: 2 },
  { slug: "johnsons-baby-wipes", size: "120 pcs", qty: 1 },
];
const seedWish = ["pampers-new-baby-diapers", "johnsons-baby-shampoo", "huggies-baby-wipes", "aptamil-advance-follow-on-milk", "baby-feeding-set", "baby-clothing-set", "baby-play-mat", "baby-stroller"];

export const FREE_DELIVERY = 3000;
export function totals(lines: CartLine[]) {
  let subtotal = 0, discount = 0, count = 0;
  for (const l of lines) { const x = getProduct(l.slug); if (!x) continue; subtotal += x.old * l.qty; discount += (x.old - x.price) * l.qty; count += l.qty; }
  const net = subtotal - discount;
  const delivery = count === 0 || net >= FREE_DELIVERY ? 0 : 80;
  return { subtotal, discount, delivery, total: net + delivery, count, net };
}

type Ctx = {
  lines: CartLine[]; wish: string[]; lastOrder: Order | null; payment: string; address: string;
  add: (x: Product, size?: string, qty?: number) => void; setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void; toggleWish: (slug: string) => void; clearWish: () => void;
  moveAllToCart: () => void; setPayment: (m: string) => void; setAddress: (a: string) => void; placeOrder: () => void;
};
const CartContext = createContext<Ctx | null>(null);
const KEY = "baby-choice-store-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(seed);
  const [wish, setWish] = useState<string[]>(seedWish);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState("Cash on Delivery");
  const [address, setAddress] = useState("Home");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const s = JSON.parse(raw); setLines(s.lines ?? seed); setWish(s.wish ?? seedWish); setLastOrder(s.lastOrder ?? null); setPayment(s.payment ?? "Cash on Delivery"); setAddress(s.address ?? "Home"); }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify({ lines, wish, lastOrder, payment, address })); }, [loaded, lines, wish, lastOrder, payment, address]);

  const add = useCallback((x: Product, size = x.sizes[0] ?? "", qty = 1) => {
    setLines(ls => ls.some(l => l.slug === x.slug && l.size === size) ? ls.map(l => l.slug === x.slug && l.size === size ? { ...l, qty: l.qty + qty } : l) : [...ls, { slug: x.slug, size, qty }]);
    toast.success(`${x.name} added to cart`, { description: size ? `Size: ${size} · Qty: ${qty}` : undefined });
  }, []);
  const setQty = useCallback((slug: string, size: string, qty: number) => setLines(ls => qty <= 0 ? ls.filter(l => !(l.slug === slug && l.size === size)) : ls.map(l => l.slug === slug && l.size === size ? { ...l, qty } : l)), []);
  const remove = useCallback((slug: string, size: string) => setLines(ls => ls.filter(l => !(l.slug === slug && l.size === size))), []);
  const toggleWish = useCallback((slug: string) => setWish(w => w.includes(slug) ? w.filter(s => s !== slug) : [slug, ...w]), []);
  const clearWish = useCallback(() => setWish([]), []);
  const moveAllToCart = useCallback(() => {
    setLines(ls => { let next = [...ls]; for (const s of wish) { const x = getProduct(s); if (!x) continue; const size = x.sizes[0] ?? ""; next = next.some(l => l.slug === s && l.size === size) ? next.map(l => l.slug === s && l.size === size ? { ...l, qty: l.qty + 1 } : l) : [...next, { slug: s, size, qty: 1 }]; } return next; });
    setWish([]); toast.success("All wishlist items moved to cart");
  }, [wish]);
  const placeOrder = useCallback(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const number = `BC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    const placed = d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
    setLastOrder({ number, placed, lines, payment }); setLines([]);
  }, [lines, payment]);

  const value = useMemo(() => ({ lines, wish, lastOrder, payment, address, add, setQty, remove, toggleWish, clearWish, moveAllToCart, setPayment, setAddress, placeOrder }), [lines, wish, lastOrder, payment, address, add, setQty, remove, toggleWish, clearWish, moveAllToCart, placeOrder]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
