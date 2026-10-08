import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { BrandPage } from "@/components/pages/brand-page";
export const Route = createFileRoute("/brands/$brand")({
  head: ({ params }) => { const n = params.brand.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); return liveHead(`${n} Products`, `Shop ${n} baby products at Baby Choice.`); },
  component: Page,
});

function Page(){const {brand}=Route.useParams();return <BrandPage slug={brand}/>}
