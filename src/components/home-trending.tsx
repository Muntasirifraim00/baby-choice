import { useState } from "react";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { AddToCartButton, ProductLink, WishButton } from "@/components/live";
import { off, pick, tk, type Product } from "@/lib/products";

const artwork = import.meta.glob<string>("/src/assets/trending/*.jpg", { eager: true, import: "default" });

const homeTrending = pick(
  "pampers-new-baby-diapers", "johnsons-baby-shampoo", "carters-honey-cotton-wash-cloth",
  "nuby-sippy-cup", "sudocrem-nappy-rash-cream", "aptamil-advance-follow-on-milk",
  "baby-hooded-towel",
  "johnsons-baby-lotion", "cetaphil-baby-wash",
  "aveeno-baby-lotion", "chicco-feeding-bottle", "philips-avent-bottle-set",
  "nestle-cerelac-wheat-apple", "carters-girl-bodysuit-set", "girl-party-dress-bow",
  "winter-romper-panda", "baby-play-mat", "soft-teddy-bear",
  "stacking-rings-toy", "digital-baby-thermometer",
);

function TrendingCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const feature = product.slug === "pampers-new-baby-diapers" ? "Best Seller"
    : product.slug === "johnsons-baby-shampoo" ? "No More Tears"
    : product.slug === "carters-honey-cotton-wash-cloth" ? "100% Cotton"
    : product.slug === "nuby-sippy-cup" ? "Spill Proof"
    : product.badge ?? product.category;
  return <article className="ht-card">
      <div className="ht-art">
        <ProductLink slug={product.slug} label={`View ${product.name}`}><img src={artwork[`/src/assets/trending/${product.slug}.jpg`] ?? product.image} alt={product.name} loading="lazy" width={512} height={512} /></ProductLink>
        <span className="ht-discount">−{off(product)}%</span>
        <WishButton slug={product.slug} className="ht-wish" />
      </div>
      <div className="ht-feature">{feature}</div>
      <div className="ht-copy">
        <span className="ht-brand">{product.brand}</span>
        <h3><ProductLink slug={product.slug}>{product.name}</ProductLink></h3>
        <div className="ht-rating"><Star fill="currentColor" /><strong>{product.rating.toFixed(1)}</strong><span>({product.reviews})</span><span className="ht-stock">In Stock</span></div>
        <div className="ht-prices"><strong>৳ {tk(product.price)}</strong><del>৳ {tk(product.old)}</del></div>
        <span className="ht-save">Save ৳{tk(product.old - product.price)}</span>
        <div className="ht-quantity" role="group" aria-label={`Quantity for ${product.name}`}>
          <button type="button" aria-label={`Decrease quantity for ${product.name}`} disabled={qty === 1} onClick={() => setQty(n => n - 1)}><Minus /></button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label={`Increase quantity for ${product.name}`} disabled={qty === 99} onClick={() => setQty(n => n + 1)}><Plus /></button>
        </div>
        <AddToCartButton product={product} qty={qty} size={product.sizes[0] ?? ""} className="ht-add"><ShoppingCart /><span>Add to Cart</span></AddToCartButton>
      </div>
    </article>;
}

export function HomeTrendingGrid() {
  return <div className="ht-grid" aria-label="Trending products">
    {homeTrending.map(product => <TrendingCard product={product} key={product.slug} />)}
  </div>;
}