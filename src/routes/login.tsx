import { createFileRoute } from "@tanstack/react-router";
import { RefScreen, searchHit, productHit } from "@/components/ref-screen";
const t = "Login — Baby Choice", d = "Login to your Baby Choice account and continue shopping for your little one.";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <RefScreen name="login" active="none" cuts={[0,110,420,1270,1460,1665]} alt={["Baby Choice header","Welcome Back!","Login form","New to Baby Choice? Create Account","Account benefits"]} links={[searchHit, { to: "/cart", box: [750, 18, 66, 62], label: "Cart" }, { to: "/", box: [28, 92, 34, 30], label: "Home" }, { to: "/account", box: [62, 930, 728, 86], label: "Login" }]} />,
});
