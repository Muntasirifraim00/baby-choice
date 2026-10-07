import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Droplet, Headphones, House, Leaf, Minus, Plus, RefreshCw, Search, ShieldCheck, ShoppingCart, Smile, Truck, Zap, CircleCheck, Heart } from "lucide-react";
import { DemoControl, ShopBottomNav } from "@/components/shop-navigation";
import logo from "@/assets/logo.png.asset.json";
import main from "@/assets/pd-main.png.asset.json";
import thumbs from "@/assets/pd-thumbs.png.asset.json";
import like1 from "@/assets/pd-like1.png.asset.json";
import like2 from "@/assets/pd-like2.png.asset.json";
import like3 from "@/assets/pd-like3.png.asset.json";
import like4 from "@/assets/pd-like4.png.asset.json";

export const Route = createFileRoute("/product/johnsons-baby-shampoo")({
  component: ProductPage,
  head: () => ({ meta: [
    { title: "Johnson's Baby Shampoo (No More Tears) — Baby Choice" },
    { name: "description", content: "Gentle, tear-free Johnson's Baby Shampoo from ৳620. pH balanced and dermatologically tested." },
    { property: "og:title", content: "Johnson's Baby Shampoo — Baby Choice" },
    { property: "og:description", content: "Gentle and mild formula for your baby's delicate hair and scalp." },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const likes = [
  { img: like1, name: "Baby Lotion", r: "4.7 (210)", p: "650", o: "820" },
  { img: like2, name: "Baby Powder", r: "4.8 (280)", p: "590", o: "750" },
  { img: like3, name: "Baby Body Wash", r: "4.7 (198)", p: "680", o: "850" },
  { img: like4, name: "Baby Wipes", r: "4.8 (246)", p: "320", o: "420" },
];

function ProductPage() {
  return <div className="mobile-frame"><main className="baby-screen pd-screen">
    <header className="pd-header">
      <Link to="/search" aria-label="Back" className="pd-back"><ChevronLeft /></Link>
      <img src={logo.url} className="pd-logo" alt="Baby Choice — Everything for Your Little One" />
      <DemoControl label="Search" className="pd-circle"><Search /></DemoControl>
      <DemoControl label="Cart, 3 items" className="pd-circle"><ShoppingCart fill="currentColor" /><span className="pd-count">3</span></DemoControl>
    </header>
    <nav className="pd-crumb"><Link to="/" aria-label="Home"><House /></Link><ChevronRight /><span>Baby Care</span><ChevronRight /><Link to="/search">Baby Shampoo</Link><ChevronRight /><span>Johnson&apos;s Baby Shampoo</span></nav>
    <section className="pd-top">
      <div className="pd-gallery"><img src={main.url} alt="Johnson's Baby Shampoo bottle" className="pd-main" /><img src={thumbs.url} alt="Product thumbnails" className="pd-thumbs" /></div>
      <div className="pd-info">
        <p className="pd-brand">Johnson&apos;s</p>
        <h1>Johnson’s Baby Shampoo<small>(No More Tears)</small></h1>
        <div className="pd-rating"><span>★★★★★</span>4.8 (320 reviews)</div>
        <p className="pd-desc">Gentle and mild formula to cleanse your baby&apos;s delicate hair and scalp. No more tears, pH balanced and dermatologically tested.</p>
        <div className="pd-price"><strong>৳ 620</strong><del>৳ 780</del><span>20% OFF</span></div>
        <h3>Size</h3>
        <div className="pd-sizes"><span className="on">200ml</span><span>500ml</span><span>750ml</span></div>
        <h3>Quantity</h3>
        <div className="pd-qty"><div><Minus /><b>1</b><Plus /></div><p><CircleCheck fill="currentColor" stroke="white" /><strong>In Stock</strong><small>Ready to ship</small></p></div>
        <DemoControl label="Add to Cart" className="pd-cart"><ShoppingCart />Add to Cart</DemoControl>
        <DemoControl label="Buy Now" className="pd-buy"><Zap />Buy Now</DemoControl>
        <div className="pd-trust">
          <span><ShieldCheck fill="currentColor" stroke="white" /><small>100%</small>Original Product</span>
          <span><Truck />Fast Delivery</span><span><RefreshCw />Easy Returns</span><span><Headphones />24/7 Support</span>
        </div>
      </div>
    </section>
    <section className="pd-high"><h2>Key Highlights</h2><div>
      <span><i className="pink"><Heart fill="currentColor" /></i>No More Tears</span>
      <span><i className="lav"><Droplet /></i>pH Balanced</span>
      <span><i className="green"><Leaf fill="currentColor" /></i>With Natural Extracts</span>
      <span><i className="lav"><ShieldCheck fill="currentColor" /></i>Dermatologically Tested</span>
      <span><i className="blue"><Smile /></i>Gentle for Daily Use</span>
    </div></section>
    <div className="pd-tabs"><span className="on">Description</span><span>Ingredients</span><span>How to Use</span><span>Reviews (320)</span><span>Q&amp;A</span></div>
    <section className="pd-body">
      <p>Johnson&apos;s Baby Shampoo is specially designed for your baby&apos;s delicate hair and scalp. Its mild and gentle formula cleanses softly, leaves hair smooth, shiny and easy to manage. Enriched with natural extracts and clinically proven to be gentle, it is safe for daily use.</p>
      <ul>{["No more tears formula", "Leaves hair soft, smooth and shiny", "Gentle on eyes and scalp", "Suitable for daily use", "pH balanced"].map(t => <li key={t}><BadgeCheck fill="currentColor" stroke="white" />{t}</li>)}</ul>
    </section>
    <section className="pd-like"><div className="pd-like-head"><h2>You May Also Like</h2><span>See All <ArrowRight /></span></div>
      <div className="pd-like-grid">{likes.map(l => <article key={l.name}><img src={l.img.url} alt={`Johnson's ${l.name}`} /><h4>Johnson&apos;s<br />{l.name}</h4><div className="pd-rating sm"><span>★★★★★</span>{l.r}</div><div className="pd-price sm"><strong>৳ {l.p}</strong><del>৳ {l.o}</del></div></article>)}</div>
    </section>
    <ShopBottomNav active="none" />
  </main></div>;
}
