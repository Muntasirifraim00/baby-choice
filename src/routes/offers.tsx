import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Offers & Deals — Baby Choice" }, { name: "description", content: "Big savings for little ones — flash deals, combo offers and clearance up to 70% off." }, { property: "og:title", content: "Offers & Deals — Baby Choice" }, { property: "og:description", content: "Big savings for little ones — flash deals, combo offers and clearance up to 70% off." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="offers" active="Offers" cuts={[0, 120, 570, 1210, 1590, 1740]} alt={["Baby Choice header and Offers & Deals", "Big Savings for Little Ones — up to 50% off", "Flash Deals", "Combo Offers and Clearance Sale", "More Offers for You"]} links={[searchHit, { to: "/", box: [28, 92, 30, 28], label: "Home" }, productHit([28, 785, 255, 350])]} />,
});
