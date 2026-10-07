import { createFileRoute } from "@tanstack/react-router";
import { TrendingReference } from "@/components/trending-reference";
import { shoppingHead } from "@/lib/shopping-demo";
export const Route=createFileRoute("/trending/")({head:()=>shoppingHead("Trending Products","Most loved baby products, popular brands and today’s trending baby essentials."),component:()=> <TrendingReference/>});
