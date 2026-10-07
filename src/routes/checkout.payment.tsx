import { createFileRoute } from "@tanstack/react-router";
import { PaymentReference } from "@/components/checkout-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/payment")({head:()=>shoppingHead("Payment Method","Preview cash on delivery, bKash, Nagad and card payment options."),component:PaymentReference});
