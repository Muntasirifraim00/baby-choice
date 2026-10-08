import { Star, ShoppingCart } from "lucide-react";
import { AddToCartButton, ProductLink, WishButton } from "@/components/live";
import { off, pick, tk } from "@/lib/products";

const homeTrending = pick(
  "sudocrem-nappy-rash-cream", "carters-honey-cotton-wash-cloth", "aptamil-advance-follow-on-milk",
  "baby-hooded-towel", "johnsons-baby-shampoo", "pampers-new-baby-diapers",
  "johnsons-baby-lotion", "cetaphil-baby-wash", "nuby-sippy-cup",
  "aveeno-baby-lotion", "chicco-feeding-bottle", "philips-avent-bottle-set",
  "nestle-cerelac-wheat-apple", "carters-girl-bodysuit-set", "girl-party-dress-bow",
  "winter-romper-panda", "baby-play-mat", "soft-teddy-bear",
  "stacking-rings-toy", "digital-baby-thermometer",
);

export function HomeTrendingGrid() {
  return <div className="ht-grid" aria-label="Trending products">
    {homeTrending.map(product => <article className="ht-card" key={product.slug}>
      <div className="ht-art">
        <ProductLink slug={product.slug} label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" width={512} height={512} /></ProductLink>
        <span className="ht-discount">−{off(product)}%</span>
        <WishButton slug={product.slug} className="ht-wish" />
      </div>
      <div className="ht-copy">
        <span className="ht-brand">{product.brand}</span>
        <h3><ProductLink slug={product.slug}>{product.name}</ProductLink></h3>
        <div className="ht-rating"><Star fill="currentColor" /><strong>{product.rating}</strong><span>({product.reviews})</span></div>
        <div className="ht-prices"><strong>৳ {tk(product.price)}</strong><del>৳ {tk(product.old)}</del></div>
        <AddToCartButton product={product} size={product.sizes[0]} className="ht-add"><ShoppingCart /><span>Add to Cart</span></AddToCartButton>
      </div>
    </article>)}
  </div>;
}