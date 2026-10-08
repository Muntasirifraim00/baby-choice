import { useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Droplet, Headphones, House, Leaf, Minus, Plus, RefreshCw, Search, ShieldCheck, ShoppingCart, Smile, Truck, Zap, CircleCheck, Heart } from "lucide-react";
import { ShopBottomNav } from "@/components/shop-navigation";
import { Button } from "@/components/ui/button";
import { AddToCartButton, CartCount, ProductLink, WishButton } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { getProduct, off, products, tk } from "@/lib/products";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => { const product = getProduct(params.slug); if (!product) throw notFound(); return { product }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Baby Choice" }, { name: "robots", content: "noindex" }] };
    const x = loaderData.product; const t = `${x.name} — Baby Choice`; const d = `${x.name} (${x.sub}) from ৳${tk(x.price)}. Safe, original baby care delivered across Bangladesh.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: ProductMissing,
  component: ProductPage,
});

function ProductMissing() {
  return <div className="mobile-frame"><main className="baby-screen pd-screen"><div className="lv-empty"><h1>Product not found</h1><Link to="/">Back to Home</Link></div></main></div>;
}

const tabs = ["Description", "Ingredients", "How to Use", "Reviews", "Q&A"] as const;

function ProductPage() {
  const { product: x } = Route.useLoaderData();
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState(x.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const likes = products.filter(p => p.slug !== x.slug && (p.brand === x.brand || p.category === x.category)).slice(0, 4);
  const body: Record<(typeof tabs)[number], string> = {
    Description: `${x.name} is specially chosen for your baby's delicate needs. ${x.sub ? x.sub + "." : ""} Gentle, safe and trusted by parents, it is suitable for everyday use.`,
    Ingredients: "Gentle, dermatologically tested formula. Free from harsh parabens and dyes. Please check the pack for the full ingredient list.",
    "How to Use": "Use as directed on the pack. Keep out of reach of children and store in a cool, dry place.",
    Reviews: `Rated ${x.rating} out of 5 by ${x.reviews} parents. “Gentle, works great and my baby loves it!”`,
    "Q&A": "Is this product original? Yes — every Baby Choice product is 100% original and sourced from authorised distributors.",
  };
  return <div className="mobile-frame"><main className="baby-screen pd-screen">
    <header className="pd-header">
      <button type="button" onClick={() => router.history.back()} aria-label="Back" className="pd-back"><ChevronLeft /></button>
      <Link to="/"><img src={logo.url} className="pd-logo" alt="Baby Choice — Everything for Your Little One" /></Link>
      <Button asChild variant="ghost" className="demo-button pd-circle"><Link to="/search" aria-label="Search"><Search /></Link></Button>
      <Button asChild variant="ghost" className="demo-button pd-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart fill="currentColor" /><CartCount className="pd-count" /></Link></Button>
    </header>
    <nav className="pd-crumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><Link to="/categories">{x.category}</Link><ChevronRight /><span>{x.name}</span></nav>
    <section className="pd-top">
      <div className="pd-gallery"><div className="pd-main lv-pd-main"><img src={x.image} alt={x.name} /><WishButton slug={x.slug} className="lv-pd-wish" /></div><div className="lv-thumbs">{[0, 1, 2, 3].map(i => <img key={i} src={x.image} alt="" className={i === 0 ? "on" : ""} />)}</div></div>
      <div className="pd-info">
        <p className="pd-brand">{x.brand}</p>
        <h1>{x.name}{x.sub && <small>({x.sub})</small>}</h1>
        <div className="pd-rating"><span>★★★★★</span>{x.rating} ({x.reviews} reviews)</div>
        <p className="pd-desc">{body.Description}</p>
        <div className="pd-price"><strong>৳ {tk(x.price)}</strong><del>৳ {tk(x.old)}</del><span>{off(x)}% OFF</span></div>
        <h3>Size</h3>
        <div className="pd-sizes">{x.sizes.map(s => <button type="button" key={s} className={s === size ? "on" : ""} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>)}</div>
        <h3>Quantity</h3>
        <div className="pd-qty"><div><button type="button" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus /></button><b>{qty}</b><button type="button" aria-label="Increase quantity" onClick={() => setQty(q => q + 1)}><Plus /></button></div><p><CircleCheck fill="currentColor" stroke="white" /><strong>In Stock</strong><small>Ready to ship</small></p></div>
        <AddToCartButton product={x} size={size} qty={qty} className="pd-cart" />
        <Button asChild variant="ghost" className="demo-button pd-buy"><Link to="/checkout" onClick={() => add(x, size, qty)}><Zap />Buy Now</Link></Button>
        <div className="pd-trust">
          <span><ShieldCheck fill="currentColor" stroke="white" /><small>100%</small>Original Product</span>
          <span><Truck />Fast Delivery</span><span><RefreshCw />Easy Returns</span><span><Headphones />24/7 Support</span>
        </div>
      </div>
    </section>
    <section className="pd-high"><h2>Key Highlights</h2><div>
      <span><i className="pink"><Heart fill="currentColor" /></i>Gentle Care</span>
      <span><i className="lav"><Droplet /></i>pH Balanced</span>
      <span><i className="green"><Leaf fill="currentColor" /></i>Natural Extracts</span>
      <span><i className="lav"><ShieldCheck fill="currentColor" /></i>Dermatologically Tested</span>
      <span><i className="blue"><Smile /></i>Daily Use</span>
    </div></section>
    <div className="pd-tabs" role="tablist">{tabs.map(t => <button type="button" role="tab" key={t} aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "Reviews" ? `Reviews (${x.reviews})` : t}</button>)}</div>
    <section className="pd-body">
      <p>{body[tab]}</p>
      {tab === "Description" && <ul>{["Gentle and safe formula", "Trusted by parents", "Suitable for daily use", "100% original product"].map(t => <li key={t}><BadgeCheck fill="currentColor" stroke="white" />{t}</li>)}</ul>}
    </section>
    <section className="pd-like"><div className="pd-like-head"><h2>You May Also Like</h2><Link to="/trending">See All <ArrowRight /></Link></div>
      <div className="pd-like-grid">{likes.map(l => <article key={l.slug}><ProductLink slug={l.slug}><img src={l.image} alt={l.name} /><h4>{l.name}</h4></ProductLink><div className="pd-rating sm"><span>★★★★★</span>{l.rating} ({l.reviews})</div><div className="pd-price sm"><strong>৳ {tk(l.price)}</strong><del>৳ {tk(l.old)}</del></div><AddToCartButton product={l} className="lv-mini-add"><ShoppingCart />Add</AddToCartButton></article>)}</div>
    </section>
    <ShopBottomNav active="none" />
  </main></div>;
}
