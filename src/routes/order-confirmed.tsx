import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "Order Confirmed — Baby Choice", d = "Your Baby Choice order is confirmed and will be delivered within 2–4 days.";
export const Route = createFileRoute("/order-confirmed")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="confirmed" active="none" cuts={[0,130,390,530,745,1155,1435,1720]} alt={["Order confirmation header","Your Order is Confirmed!","Order number BC-20261007-1234","Delivery address","Ordered items","Order summary total ৳2,790","Estimated delivery and actions"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/checkout", box: [90, 92, 90, 30], label: "Checkout" }, { to: "/checkout/review", box: [34, 1645, 382, 60], label: "View Order Details" }, { to: "/", box: [436, 1645, 380, 60], label: "Continue Shopping" }]} />,
});
