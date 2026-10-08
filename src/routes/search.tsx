import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/components/pages/search-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({ q: typeof search['q'] === "string" ? search['q'] : "" }),
  component: SearchResults,
  head: () => ({ meta: [
    { title: "Search Baby Products — Baby Choice" },
    { name: "description", content: "Search baby shampoo, diapers, feeding and clothing from trusted baby-care brands at Baby Choice." },
    { property: "og:title", content: "Search Baby Products — Baby Choice" },
    { property: "og:description", content: "Compare gentle baby products, sizes and prices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
function SearchResults(){ const { q = "" } = Route.useSearch(); return <SearchPage query={q} />; }
