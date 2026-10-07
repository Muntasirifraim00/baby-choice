import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit } from "@/components/ref-screen";
export const Route = createFileRoute("/brands/")({
  head: () => ({ meta: [{ title: "All Brands — Baby Choice" }, { name: "description", content: "Trusted baby brands like Johnson's, Cetaphil, Himalaya, Aveeno, Dove and Pampers." }, { property: "og:title", content: "All Brands — Baby Choice" }, { property: "og:description", content: "Trusted baby brands like Johnson's, Cetaphil, Himalaya, Aveeno, Dove and Pampers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="brands" cuts={[0, 95, 505, 575, 1240, 1740]} alt={["Baby Choice header", "All Brands — Top Baby Brands", "Brand alphabet filter", "Johnson's, Cetaphil, Himalaya, Aveeno, Dove and Pampers", "Nestlé Cerelac, Nuby, Chicco, Philips Avent, Mustela and Pigeon"]} links={[searchHit, { to: "/brands/johnsons", box: [28, 590, 260, 312], label: "View Johnson's brand" }]} />,
});
