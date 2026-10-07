import { createFileRoute } from "@tanstack/react-router";
import { ReviewReference } from "@/components/checkout-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/review")({head:()=>shoppingHead("Order Review & Confirm","Review your demo delivery address, products, payment and total."),component:ReviewReference});
