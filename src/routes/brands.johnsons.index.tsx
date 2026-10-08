import { createFileRoute } from "@tanstack/react-router";
import { ShoppingShell } from "@/components/shopping-reference";
import { LvBanner } from "@/components/live-ui";
import { JohnsonsCatalog, JohnsonsHeaderLinks } from "@/components/johnsons";
import { liveHead } from "@/lib/live-head";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/brands/johnsons/")({ head: () => liveHead("Johnson's Products", "Shop 42 Johnson's baby products: shampoo, lotion, powder, body wash, oil and wipes."), component: Page });

function Page() {
  return <ShoppingShell crumb="Brands › Johnson's" className="lv">
    <JohnsonsHeaderLinks />
    <LvBanner title={<>Johnson’s<br />Trusted by Generations of Parents</>} text="Gentle care for your baby’s delicate skin and hair. 42 Products." image={getProduct("johnsons-baby-care-gift-set")?.image} cta="View Brand Story" to="/brands/johnsons/story" />
    <h1 className="lv-title">Johnson’s Products</h1><p className="lv-sub">42 Products Found</p>
    <JohnsonsCatalog />
  </ShoppingShell>;
}
