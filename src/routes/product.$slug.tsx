import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronLeft, Droplet, FileText, Leaf, List, MessageSquare, Minus, MoreVertical, Package, Plus, RefreshCw, Ruler, Search, ShieldCheck, ShoppingCart, Sparkles, Star, Tag, Truck, X, Zap, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton, CartCount, ProductLink, WishButton } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { getProduct, products, tk } from "@/lib/products";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => { const product = getProduct(params.slug); if (!product) throw notFound(); return { product }; },
  head: ({ loaderData }) => {
    const x = loaderData?.product;
    const title = x ? `${x.name} — Baby Choice` : "Product not found — Baby Choice";
    const description = x ? `Explore ${x.name}, available sizes and product details at Baby Choice. From ৳${tk(x.price)}.` : "Find baby products at Baby Choice.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <div className="mobile-frame"><main className="baby-screen"><div className="lv-empty"><h1>Product not found</h1><Link to="/">Back to Home</Link></div></main></div>,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return <ProductDetail key={product.slug} product={product} />;
}

function ProductDetail({ product: x }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState(x.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [dialog, setDialog] = useState<"zoom" | "sizes" | null>(null);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const likes = products.filter(p => p.slug !== x.slug && (p.brand === x.brand || p.category === x.category)).slice(0, 6);
  const sku = x.sub.match(/Code\s+(\w+)/i)?.[1] ?? `BC-${String(products.findIndex(p => p.slug === x.slug) + 1).padStart(5, "0")}`;
  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDialog(null); };
    document.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = old; };
  }, [dialog]);
  function quantityControl() {
    return <div className="bc-quantity"><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={qty === 1} onClick={() => setQty(q => Math.max(1, q - 1))}><Minus /></Button><output aria-live="polite" aria-label="Quantity">{qty}</output><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty(q => q + 1)}><Plus /></Button></div>;
  }
  function buyButton() {
    return <Button asChild variant="ghost" className="bc-buy"><Link to="/checkout" onClick={() => add(x, size, qty)}><Zap fill="currentColor" />Buy Now</Link></Button>;
  }
  const panels = [
    { name: "Description", icon: FileText, content: <p>{x.name}. {x.sub && `${x.sub}. `}Browse available options and choose the size that suits your little one. Refer to the product packaging for care instructions and age suitability.</p> },
    { name: "Product Specifications", icon: List, content: <dl className="bc-specs"><dt>Brand</dt><dd>{x.brand}</dd><dt>Category</dt><dd>{x.category}</dd><dt>SKU</dt><dd>{sku}</dd><dt>Available options</dt><dd>{x.sizes.join(", ")}</dd><dt>Selected option</dt><dd>{size}</dd></dl> },
    { name: `Reviews (${x.reviews})`, icon: Star, content: <p><strong>{x.rating} / 5</strong> · {x.reviews} reviews in the demo catalog. Individual customer reviews are not available.</p> },
    { name: "Questions & Answers", icon: MessageSquare, content: <p>Have a question about {x.name}? <Link to="/support">Contact Baby Choice support <ArrowRight /></Link></p> },
  ];
  return <div className="mobile-frame bc-product-frame"><main className="baby-screen bc-product">
    <header className="bc-product-header">
      <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.history.back()}><ChevronLeft /></Button>
      <Link to="/" className="bc-brand"><img src={logo.url} alt="Baby Choice — Everything for Your Little One" /></Link>
      <Button asChild variant="ghost" size="icon"><Link to="/search" aria-label="Search"><Search /></Link></Button>
      <Button asChild variant="ghost" size="icon" className="bc-header-cart"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart /><CartCount className="bc-cart-count" /></Link></Button>
      <div className="bc-menu-wrap"><Button variant="ghost" size="icon" aria-label="More options" aria-expanded={menu} onClick={() => setMenu(v => !v)}><MoreVertical /></Button>{menu && <nav className="bc-menu"><Link to="/">Home</Link><Link to="/categories">Categories</Link><Link to="/wishlist">Wishlist</Link><Link to="/support">Help & Support</Link></nav>}</div>
    </header>
    <section className="bc-gallery" aria-label="Product gallery">
      <div className={`bc-main-image bc-view-${view}`}><img src={x.image} alt={x.name} /><span className="bc-gallery-label">{x.brand}</span><WishButton slug={x.slug} className="bc-gallery-wish" /><Button variant="ghost" size="icon" className="bc-zoom" aria-label="Zoom product image" onClick={() => setDialog("zoom")}><ZoomIn /></Button></div>
      <div className="bc-thumbnails">{["Product image", "Closer view", "Product detail"].map((label, i) => <Button key={label} variant="ghost" className={`bc-thumbnail bc-view-${i} ${view === i ? "selected" : ""}`} aria-label={label} aria-pressed={view === i} onClick={() => setView(i)}><img src={x.image} alt="" /></Button>)}</div>
    </section>
    <section className="bc-product-info">
      <h1>{x.name}{x.sub && !x.sub.startsWith("Code") && <span> {x.sub}</span>}</h1>
      <div className="bc-rating"><span aria-label={`${x.rating} out of 5 stars`}>{[0, 1, 2, 3, 4].map(i => <Star key={i} fill="currentColor" />)}</span><span>({x.reviews} reviews)</span></div>
      <p className="bc-meta">SKU: {sku}<span aria-hidden="true">|</span>Category: <Link to="/categories/$cat" params={{ cat: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }}>{x.category}</Link></p>
      <div className="bc-price-row"><div className="bc-price"><strong>৳ {tk(x.price)}</strong><del>৳ {tk(x.old)}</del></div><div className="bc-best-price"><Tag fill="currentColor" /><div><b>Best Price</b><small>Great value for your little one</small></div></div></div>
      <div className="bc-options"><div className="bc-option-title">Size / Option <span>{size}</span></div><div className="bc-sizes">{x.sizes.map(s => <Button key={s} variant="ghost" aria-pressed={size === s} className={size === s ? "selected" : ""} onClick={() => setSize(s)}>{s}</Button>)}</div></div>
      <div className="bc-quantity-row"><span>Quantity</span>{quantityControl()}<Button variant="ghost" className="bc-size-guide" onClick={() => setDialog("sizes")}><Ruler />Size Guide</Button></div>
      <div className="bc-purchase"><AddToCartButton product={x} size={size} qty={qty} className="bc-add" />{buyButton()}</div>
    </section>
    <section className="bc-benefits" aria-label="Product benefits">{[{ icon: Sparkles, title: "Chosen with", sub: "Care", tone: "pink" }, { icon: Leaf, title: "For Your", sub: "Little One", tone: "purple" }, { icon: Droplet, title: "Everyday", sub: "Essentials", tone: "blue" }, { icon: ShieldCheck, title: "Trusted", sub: "Brands", tone: "green" }].map(b => <div key={b.tone}><i className={b.tone}><b.icon /></i><span>{b.title}<br />{b.sub}</span></div>)}</section>
    <section className="bc-accordions" aria-label="Product information">{panels.map(p => <div className="bc-accordion" key={p.name}><Button variant="ghost" className="bc-accordion-toggle" aria-expanded={open === p.name} aria-controls={`panel-${p.name.replace(/\W/g, "")}`} onClick={() => setOpen(v => v === p.name ? null : p.name)}><p.icon /><span>{p.name}</span><ChevronDown className={open === p.name ? "expanded" : ""} /></Button><div id={`panel-${p.name.replace(/\W/g, "")}`} hidden={open !== p.name} className="bc-accordion-content">{p.content}</div></div>)}</section>
    <section className="bc-delivery"><div><i><Truck /></i><p><b>Home Delivery</b><span>Delivery across Bangladesh</span></p></div><div><i><Package /></i><p><b>Easy Returns</b><Link to="/support">View return information</Link></p></div></section>
    <section className="bc-related"><div className="bc-related-head"><h2>You may also like</h2><Link to="/categories/$cat" params={{ cat: x.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }}>See All <ArrowRight /></Link></div><div className="bc-related-track">{likes.map(l => <article key={l.slug}><div className="bc-related-art"><ProductLink slug={l.slug}><img src={l.image} alt={l.name} loading="lazy" /></ProductLink><WishButton slug={l.slug} /></div><h3><ProductLink slug={l.slug}>{l.name}</ProductLink></h3><strong>৳ {tk(l.price)}</strong><AddToCartButton product={l} className="bc-related-add" /></article>)}</div></section>
    <footer className="bc-sticky-purchase" aria-label="Quick purchase"><div className="bc-sticky-price"><strong>৳ {tk(x.price)}</strong><small>SKU: {sku}</small></div>{quantityControl()}<AddToCartButton product={x} size={size} qty={qty} className="bc-add" />{buyButton()}</footer>
    {dialog && <div className="bc-dialog-backdrop" onClick={() => setDialog(null)}><section role="dialog" aria-modal="true" aria-label={dialog === "zoom" ? "Product image" : "Size Guide"} className="bc-dialog" onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" autoFocus aria-label="Close dialog" className="bc-dialog-close" onClick={() => setDialog(null)}><X /></Button>{dialog === "zoom" ? <img src={x.image} alt={x.name} /> : <><h2>Size Guide</h2><p>{x.name}</p><div className="bc-dialog-options">{x.sizes.map(s => <Button variant="outline" key={s} aria-pressed={size === s} onClick={() => { setSize(s); setDialog(null); }}>{s}</Button>)}</div><p>Choose from the available options above. For exact dimensions or age guidance, check the product packaging.</p></>}</section></div>}
  </main></div>;
}
