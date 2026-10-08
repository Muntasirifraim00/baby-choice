import { createFileRoute } from "@tanstack/react-router";
import { OffersPage } from "@/components/pages/offers-page";
import { liveHead } from "@/lib/live-head";
export const Route = createFileRoute("/offers")({ head: () => liveHead("Offers & Deals", "Big savings for little ones — flash deals, bundles and everyday offers on top baby brands."), component: OffersPage });
