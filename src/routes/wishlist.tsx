import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, Trash2 } from "lucide-react";
import { ShoppingShell } from "@/components/shopping-reference";
import { ProductGrid } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { liveHead } from "@/lib/live-head";
import { getProduct, type Product } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({ head: () => liveHead("My Wishlist", "Your saved baby products — move them to cart any time."), component: Wishlist });

function Wishlist() {
  const { wish, moveAllToCart, clearWish } = useCart();
  const [sort, setSort] = useState("Newest");
  let items = wish.map(getProduct).filter((x): x is Product => !!x);
  if (sort === "Price: Low to High") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") items = [...items].sort((a, b) => b.price - a.price);
  return <ShoppingShell crumb="My Wishlist" className="lv" active="Wishlist">
    <h1 className="lv-title">My Wishlist</h1><p className="lv-sub">{items.length} items</p>
    {items.length > 0 ? <>
      <div className="lv-toolbar"><button type="button" className="lv-btn" onClick={moveAllToCart}><ShoppingCart />Move All to Cart</button><button type="button" className="lv-btn ghost" onClick={clearWish}><Trash2 />Clear All</button>
        <label className="lv-select"><span>Sort by:</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort wishlist"><option>Newest</option><option>Price: Low to High</option><option>Price: High to Low</option></select></label></div>
      <ProductGrid items={items} two />
    </> : <div className="lv-empty"><p>Your wishlist is empty. Tap the heart on any product to save it here.</p><Link to="/trending" className="lv-btn">Browse Products</Link></div>}
  </ShoppingShell>;
}
