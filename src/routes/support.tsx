import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "Customer Support — Baby Choice", d = "Contact Baby Choice customer support by phone, WhatsApp or live chat.";
export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="support" active="Account" cuts={[0,130,480,750,940,1255,1380,1730]} alt={["Baby Choice header","Customer Support — We’re Here to Help","Call, WhatsApp and Live Chat","Need help with an order?","How can we help you?","Frequently Asked Questions","Support hours and privacy"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/account", box: [90, 100, 100, 30], label: "My Account" }, { to: "/about", box: [650, 958, 170, 40], label: "View All Topics" }]} />,
});
