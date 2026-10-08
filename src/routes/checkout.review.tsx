import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/review")({head:()=>shoppingHead("Order Review & Confirm","Review your demo delivery address, products, payment and total."),component:()=> <CheckoutPage step="review"/>});
