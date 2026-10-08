import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { JohnsonsProducts } from "@/components/pages/johnsons-pages";
export const Route = createFileRoute("/brands/johnsons/products")({ validateSearch: (s:Record<string, unknown>) => ({type: typeof s['type']==='string'?s['type']:'All',sort:typeof s['sort']==='string'?s['sort']:'Popular'}), head: () => liveHead("All Johnson's Products", "Browse all Johnson's baby products with filters and sorting."), component: Page });

function Page(){const search=Route.useSearch();return <JohnsonsProducts {...search}/>;}
