import { createFileRoute } from "@tanstack/react-router";
import { NewAddressReference } from "@/components/checkout-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/checkout/address/new")({head:()=>shoppingHead("Add New Address","Enter delivery address details for your Baby Choice demo."),component:NewAddressReference});
