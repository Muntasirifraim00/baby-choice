import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/pages/cart-page";
import { shoppingHead } from "@/lib/shopping-demo";

export const Route = createFileRoute("/cart")({ head: () => shoppingHead("Shopping Cart", "Your Baby Choice shopping cart and recommended baby essentials."), component: CartPage });
