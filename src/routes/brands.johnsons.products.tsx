import { createFileRoute } from "@tanstack/react-router";
import { ShoppingShell } from "@/components/shopping-reference";
import { JohnsonsCatalog, JohnsonsHeaderLinks } from "@/components/johnsons";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/brands/johnsons/products")({ head: () => liveHead("All Johnson's Products", "Browse all Johnson's baby products with filters and sorting."), component: Page });

function Page() {
  return <ShoppingShell crumb="Brands › Johnson's Products" className="lv">
    <JohnsonsHeaderLinks />
    <h1 className="lv-title">Johnson’s Products</h1><p className="lv-sub">42 Products Found</p>
    <JohnsonsCatalog withCounts />
  </ShoppingShell>;
}
