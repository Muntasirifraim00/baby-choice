import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/")({head:()=>shoppingHead("Checkout","Review your Baby Choice demo items, discounts and delivery total."),component:()=> <CheckoutPage step="address"/>});
