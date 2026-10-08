import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/payment")({head:()=>shoppingHead("Payment Method","Preview cash on delivery, bKash, Nagad and card payment options."),component:()=> <CheckoutPage step="payment"/>});
