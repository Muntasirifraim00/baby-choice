import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, House, LayoutGrid, List, Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopBottomNav } from "@/components/shop-navigation";
import logo from "@/assets/logo.png.asset.json";
import { type ShoppingProduct } from "@/lib/shopping-demo";
import type { ReactNode } from "react";
import { CartCount, LiveCard } from "@/components/live";
import { products } from "@/lib/products";

export function ShoppingShell({children,crumb,title,className="",active="none"}:{children:ReactNode;crumb:string;title?:string;empty?:boolean;className?:string;active?:"Home"|"Categories"|"Offers"|"Wishlist"|"Account"|"none"}) {
 return <div className="mobile-frame"><main className={`baby-screen shopping-reference ${className}`}><header className="sr-header"><Button asChild variant="ghost"><Link to="/categories" aria-label="Menu"><Menu/></Link></Button><img src={logo.url} alt="Baby Choice — Everything for Your Little One"/><div><Button asChild variant="ghost" className="sr-circle"><Link to="/search" aria-label="Search"><Search/></Link></Button><Button asChild variant="ghost" className="sr-circle"><Link to="/cart" aria-label="Shopping Cart"><ShoppingCart/><CartCount/></Link></Button></div></header><nav className="sr-crumb" aria-label="Breadcrumb"><Link to="/" aria-label="Home"><House/></Link><ChevronRight/>{crumb.startsWith("Checkout")?<Link to="/checkout">Checkout</Link>:<span>{crumb}</span>}{crumb.includes(" › ")&&<><ChevronRight/><span>{crumb.split(" › ")[1]}</span></>}</nav>{title&&<h1>{title}</h1>}{children}<ShopBottomNav active={active}/></main></div>;
}
export function ShoppingCTA({to,children}:{to:"/"|"/trending"|"/trending/popular"|"/checkout"|"/checkout/address"|"/checkout/address/new"|"/checkout/payment"|"/checkout/review";children:ReactNode}) {return <Button asChild className="sr-cta" variant="ghost"><Link to={to}>{children}<ArrowRight/></Link></Button>;}
const idMap:Record<string,string>={diapers:"pampers-new-baby-diapers",shampoo:"johnsons-baby-shampoo",lotion:"johnsons-baby-lotion",cetaphil:"cetaphil-baby-wash",wipes:"johnsons-baby-wipes",cup:"nuby-sippy-cup",aveeno:"aveeno-baby-lotion",chicco:"chicco-feeding-bottle",avent:"philips-avent-bottle-set",cerelac:"nestle-cerelac-wheat-apple"};
export function ShoppingCard({product,compact=false}:{product:ShoppingProduct;compact?:boolean}) {const x=products.find(p=>p.slug===idMap[product.id]);if(!x)return null;return <LiveCard product={{...x,name:product.name,sizes:product.sizes,badge:product.badge}} compact={compact}/>;}
export function ViewToggle({popular=false}:{popular?:boolean}) {return <div className="sr-view"><Button asChild variant="ghost" className={!popular?"selected":""}><Link to="/trending" aria-label="Nine-product view"><LayoutGrid/></Link></Button><Button asChild variant="ghost" className={popular?"selected":""}><Link to="/trending/popular" aria-label="Six-product view"><List/></Link></Button></div>;}
