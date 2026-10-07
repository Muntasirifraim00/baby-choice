import { createFileRoute } from "@tanstack/react-router";
import { CheckoutReference } from "@/components/checkout-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/")({head:()=>shoppingHead("Checkout","Review your Baby Choice demo items, discounts and delivery total."),component:CheckoutReference});
