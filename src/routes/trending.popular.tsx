import { createFileRoute } from "@tanstack/react-router";
import { TrendingReference } from "@/components/trending-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/trending/popular")({head:()=>shoppingHead("Most Popular Baby Products","Popular shampoo, diapers, lotions, wipes and feeding essentials at Baby Choice."),component:()=> <TrendingReference popular/>});
