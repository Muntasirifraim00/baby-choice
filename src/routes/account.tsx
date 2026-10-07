import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "My Account — Baby Choice", d = "Manage your Baby Choice profile, orders and preferences.";
export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="account" active="Account" cuts={[0,130,250,470,670,1500,1650]} alt={["Baby Choice header","My Account","Sara Ahmed profile","Order statistics","Account menu","Logout"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/wishlist", box: [30, 795, 790, 105], label: "My Wishlist" }, { to: "/wishlist", box: [625, 500, 195, 155], label: "Wishlist Items" }, { to: "/support", box: [30, 1382, 790, 108], label: "Help & Support" }, { to: "/login", box: [30, 1518, 790, 118], label: "Logout" }]} />,
});
