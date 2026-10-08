import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/address/")({head:()=>shoppingHead("Address Selection","Choose a delivery address for your Baby Choice demo order."),component:()=> <CheckoutPage step="address"/>});
