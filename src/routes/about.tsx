import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "About & Contact — Baby Choice", d = "Learn about Baby Choice and reach us by phone, WhatsApp, email or in store.";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="about" active="Account" cuts={[0,130,515,745,1035,1320,1675]} alt={["Baby Choice header","About Baby Choice — Everything for Your Little One","Safe products, trusted brand, fast delivery","Contact information","Visit our store in Dhanmondi","Send us a message"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/support", box: [90, 98, 150, 30], label: "About & Contact" }]} />,
});
