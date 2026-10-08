import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/address/new")({head:()=>shoppingHead("Add New Address","Enter delivery address details for your Baby Choice demo."),component:()=> <CheckoutPage step="address" startNew/>});
