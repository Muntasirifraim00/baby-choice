import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { getProduct, tk, type Product } from "@/lib/products";

export function CartCount({ className = "" }: { className?: string }) {
  const { lines } = useCart();
  return <span className={className}>{lines.reduce((n, l) => n + l.qty, 0)}</span>;
}

export function WishButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { wish, toggleWish } = useCart();
  const on = wish.includes(slug);
  return <Button type="button" variant="ghost" className={`demo-button live-wish ${on ? "on" : ""} ${className}`} aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Add to wishlist"} onClick={e => { e.preventDefault(); toggleWish(slug); }}><Heart fill={on ? "currentColor" : "none"} /></Button>;
}

export function AddToCartButton({ product, slug, size, qty = 1, className = "", children }: { product?: Product; slug?: string; size?: string; qty?: number; className?: string; children?: ReactNode }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const x = product ?? (slug ? getProduct(slug) : undefined);
  if (!x) return null;
  return <Button type="button" variant="ghost" className={`demo-button ${className}`} aria-label={`Add ${x.name} to Cart`} onClick={e => { e.preventDefault(); add(x, size, qty); setDone(true); setTimeout(() => setDone(false), 1400); }}>{done ? <><Check />Added</> : children ?? <><ShoppingCart />Add to Cart</>}</Button>;
}

export function ProductLink({ slug, className = "", children, label }: { slug: string; className?: string; children: ReactNode; label?: string }) {
  return <Link to="/product/$slug" params={{ slug }} className={className} aria-label={label}>{children}</Link>;
}

export function LiveCard({ product, compact = false, hideBadge = false }: { product: Product; compact?: boolean; hideBadge?: boolean }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const b = product.badge;
  return <article className={`sr-product live-card ${compact ? "compact" : ""}`}>
    <div className="sr-product-art"><ProductLink slug={product.slug} label={product.name}><img src={product.image} alt={product.name} loading="lazy" /></ProductLink>{b && !hideBadge && <span className={`sr-badge ${b === "Best Seller" ? "best" : b === "New Arrival" || b === "New" ? "new" : b === "Popular" ? "popular" : ""}`}>{b}</span>}<WishButton slug={product.slug} className="sr-heart" /></div>
    <div className="sr-product-copy">
      <h2><ProductLink slug={product.slug}>{product.name}</ProductLink></h2>
      {product.sub && <p>{product.sub}</p>}
      <div className="sr-rating"><span>★★★★★</span> {product.rating} ({product.reviews})</div>
      <div className="sr-price"><strong>৳ {tk(product.price)}</strong>{!compact && <del>৳ {tk(product.old)}</del>}</div>
      <div className="sr-sizes">{product.sizes.map(s => <button type="button" key={s} className={s === size ? "on" : ""} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>)}</div>
      <AddToCartButton product={product} size={size} className="sr-add" />
    </div>
  </article>;
}

export function ProductGrid({ items, two = false, compact = false }: { items: Product[]; two?: boolean; compact?: boolean }) {
  if (!items.length) return <p className="lv-empty">No products found.</p>;
  return <div className={`sr-products live-grid ${two ? "two" : ""}`}>{items.map(x => <LiveCard key={x.slug} product={x} compact={compact} />)}</div>;
}
