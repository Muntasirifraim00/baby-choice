import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { JohnsonsOverview } from "@/components/pages/johnsons-pages";
export const Route = createFileRoute("/brands/johnsons/")({ head: () => liveHead("Johnson's Products", "Shop Johnson's baby products: shampoo, lotion, powder, body wash, oil and wipes."), component: Page });

function Page(){return <JohnsonsOverview/>;}
