import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Heart, Headphones, Package, Phone, Search, ShieldCheck, ShoppingCart, Truck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuButton } from "@/components/shop-menu";
import { CartCount } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { products, tk } from "@/lib/products";
import logo from "@/assets/logo.png.asset.json";
import baby from "@/assets/desktop-nav/baby.png.asset.json";
import clothing from "@/assets/desktop-nav/clothing.jpg";
import diapers from "@/assets/desktop-nav/diapers.jpg";
import feeding from "@/assets/desktop-nav/feeding.jpg";
import bath from "@/assets/desktop-nav/bath.jpg";
import toys from "@/assets/desktop-nav/toys.jpg";
import offers from "@/assets/desktop-nav/offers.jpg";
import essentials from "@/assets/desktop-nav/essentials.jpg";
import pampers from "@/assets/brand-4.png.asset.json";
import johnsons from "@/assets/brand-6.png.asset.json";
import avent from "@/assets/brand-7.png.asset.json";

const tiles = [
  { name: "Baby Clothing", sub: "New Collection", image: clothing, cat: "baby-clothing", tone: "pink" },
  { name: "Diapers & Care", sub: "Dry & Comfortable", image: diapers, cat: "diapers-and-wipes", tone: "blue" },
  { name: "Feeding", sub: "Healthy Growth", image: feeding, cat: "feeding-and-nursing", tone: "yellow" },
  { name: "Bath & Health", sub: "Gentle Care", image: bath, cat: "bath-and-hygiene", tone: "mint" },
  { name: "Toys & Gear", sub: "Fun & Learning", image: toys, cat: "toys-and-learning", tone: "lilac" },
];

export function DesktopHeader() {
  const { wish } = useCart();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const matches = query.trim().length >= 2 ? products.filter(p => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase().trim())).slice(0, 6) : [];
  return <header className="dh-header">
    <div className="dh-benefits"><div className="dh-wide">
      <div className="dh-benefit-list"><span><Truck /><span>Free delivery on orders over <strong>৳3,000</strong></span></span><span><ShieldCheck />100% Original Products</span><span><Package />Easy Returns</span><span><Headphones />24/7 Customer Support</span></div>
      <a className="dh-phone" href="tel:+8801712345678"><Phone />+880 1712 345678</a>
      <Button asChild className="dh-help"><Link to="/support"><Headphones />Need Help?</Link></Button>
    </div></div>
    <div className="dh-masthead dh-wide">
      <Link className="dh-logo" to="/" aria-label="Baby Choice home"><img src={logo.url} alt="Baby Choice — Everything for Your Little One" width={400} height={120} /></Link>
      <div className="dh-search-wrap">
        <form className="dh-search" role="search" onSubmit={e => { e.preventDefault(); setFocused(false); navigate({ to: "/search", search: { q: query } }); }}>
          <div className="dh-category-select"><MenuButton /><span>All Categories</span><ChevronDown /></div>
          <Search className="dh-search-icon" />
          <input aria-label="Search baby products" placeholder="Search for baby products, brands, or categories..." value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={e => { if (e.key === "Escape") setFocused(false); }} />
          <Button type="submit" className="dh-search-submit">Search</Button>
        </form>
        {focused && query.trim().length >= 2 && <div className="dh-suggestions" aria-label="Product suggestions">{matches.length ? matches.map(p => <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} onMouseDown={e => e.preventDefault()} onClick={() => setFocused(false)}><img src={p.image} alt="" width={48} height={48} /><span>{p.name}<small>{p.brand}</small></span><strong>{tk(p.price)}</strong></Link>) : <p>No products match your search</p>}</div>}
      </div>
      <div className="dh-actions">
        <Button asChild variant="ghost"><Link to="/wishlist" aria-label="Wishlist"><span className="dh-action-icon"><Heart />{wish.length > 0 && <i>{wish.length}</i>}</span><span>Wishlist</span></Link></Button>
        <Button asChild variant="ghost"><Link to="/account" aria-label="Account"><span className="dh-action-icon"><UserRound /></span><span>Account</span></Link></Button>
        <Button asChild variant="ghost"><Link to="/cart" aria-label="Shopping Cart"><span className="dh-action-icon"><ShoppingCart /><CartCount className="cart-count" /></span><span>Cart <ChevronDown /></span></Link></Button>
      </div>
      <img className="dh-baby" src={baby.url} alt="Smiling baby in a pink bear hood" width={1034} height={768} />
    </div>
    <nav className="dh-tile-nav dh-wide" aria-label="Shop departments">
      <div className="dh-special"><img src={essentials} alt="Teddy bear, towels, bottle and rubber duck" width={768} height={768} /><div className="dh-special-copy"><span className="dh-offer-label">SPECIAL OFFER</span><h2>Baby Care<br /><em>Essentials</em></h2><p>Safe • Soft • Happy Days</p><Button asChild className="dh-shop-now"><Link to="/offers">Shop Now <ArrowRight /></Link></Button></div></div>
      {tiles.map(t => <Button asChild variant="ghost" key={t.name} className={`dh-tile dh-${t.tone}`}><Link to="/categories/$cat" params={{ cat: t.cat }} aria-current={pathname === `/categories/${t.cat}` ? "page" : undefined}><img src={t.image} alt="" width={512} height={512} /><span className="dh-tile-copy"><span className="dh-tile-text"><strong>{t.name}</strong><small>{t.sub}</small></span><span className="dh-tile-arrow"><ArrowRight /></span></span></Link></Button>)}
      <Button asChild variant="ghost" className="dh-tile dh-brands"><Link to="/brands" aria-current={pathname.startsWith("/brands") ? "page" : undefined}><span className="dh-brand-art"><img src={pampers.url} alt="Pampers" /><img src={johnsons.url} alt="Johnson's" /><span>chicco</span><img src={avent.url} alt="Philips Avent" /></span><span className="dh-tile-copy"><span className="dh-tile-text"><strong>Brands</strong><small>Top Brands</small></span><span className="dh-tile-arrow"><ArrowRight /></span></span></Link></Button>
      <Button asChild variant="ghost" className="dh-tile dh-pink"><Link to="/offers" aria-current={pathname === "/offers" ? "page" : undefined}><img src={offers} alt="" width={512} height={512} /><span className="dh-tile-copy"><span className="dh-tile-text"><strong>Hot Offers</strong><small>Save More</small></span><span className="dh-tile-arrow"><ArrowRight /></span></span></Link></Button>
    </nav>
  </header>;
}