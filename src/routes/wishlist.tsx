import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "My Wishlist — Baby Choice", d = "Your saved Baby Choice products for later.";
export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="wishlist" active="Wishlist" cuts={[0,130,320,765,1165,1530,1690]} alt={["Baby Choice header","My Wishlist — 8 items","Pampers diapers and Johnson’s shampoo","Huggies wipes and Aptamil formula","Feeding set and clothing set","Play mat and stroller"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/account", box: [90, 100, 100, 30], label: "My Account" }, productHit([435, 333, 382, 345])]} />,
});
