import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, ShieldCheck, Truck, PackageCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingShell, ShoppingCTA } from "@/components/shopping-reference";
import { ItemRows, Panel, Summary, FreeDelivery } from "@/components/checkout-reference";
import { LiveCard } from "@/components/live";
import { useCart } from "@/lib/cart-store";
import { pick } from "@/lib/products";
import { shoppingHead, shoppingImage } from "@/lib/shopping-demo";

export const Route = createFileRoute("/cart")({ head: () => shoppingHead("Shopping Cart", "Your Baby Choice shopping cart and recommended baby essentials."), component: Cart });

function Cart() {
  const { lines } = useCart();
  const likes = pick("johnsons-baby-lotion", "pampers-new-baby-diapers", "johnsons-baby-wipes");
  return <ShoppingShell crumb="Shopping Cart" className={`sr-cart ${lines.length ? "co-screen" : ""}`}>
    {lines.length === 0 ? <section className="sr-empty"><img src={shoppingImage("empty-cart-art")} alt="Happy empty purple shopping cart" /><h1>Your Cart is <em>Empty</em></h1><p>Looks like you haven’t added any items yet.<br />Explore our baby care products and find<br />what your little one needs!</p><ShoppingCTA to="/trending"><LockKeyhole />Continue Shopping</ShoppingCTA></section>
      : <div className="lv-cart"><h1 className="lv-title">Shopping Cart</h1><Panel title={`Your Items (${lines.length})`} icon={<ShoppingCart />}><ItemRows lines={lines} /></Panel><Summary lines={lines} /><FreeDelivery lines={lines} /><ShoppingCTA to="/checkout">Proceed to Checkout</ShoppingCTA></div>}
    <div className="sr-benefits"><span><ShieldCheck /><p><b>100%</b>Safe & Secure<br />Shopping</p></span><span><Truck /><p><b>Fast</b>Home Delivery</p></span><span><PackageCheck /><p><b>Easy</b>Return Policy</p></span></div>
    <div className="sr-like-heading"><div><h2>You Might Like</h2><p>Popular products for your little one</p></div><Button asChild variant="ghost"><Link to="/trending">View All<ArrowRight /></Link></Button></div>
    <div className="sr-products live-grid">{likes.map(p => <LiveCard key={p.slug} product={p} compact hideBadge />)}</div>
  </ShoppingShell>;
}
